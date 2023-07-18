import logger from '@yunflyjs/loggers';

const fs = require('fs');
const treeKill = require('tree-kill');
const nodeSchedule = require('node-schedule');

let beginTime = 0;

interface OptionConfig {
  triggerThreshold: number;
  intervalTime: number;
  cron: string;
}

export default function checkMemory(option: OptionConfig): void {
  logger.prefix('memory-check').window().log('check-memory option:', option);

  // timed task executor
  nodeSchedule.scheduleJob(option.cron, () => {
    try {
      const { memoryUsed, result } = getRestartStatus(option);
      // logger.prefix('memory-check').window().log({ msg: 'memory schedule', res: result, option, beginTime });
      if (result) {
        logger.window().log(`【warning】: node service forced restart, memory usage rate greater than ${(memoryUsed * 100).toFixed(2)}% for ${option.intervalTime / 1000 / 60} minutes, is there a Memory leak problem.`);
        treeKill(process.pid, 'SIGKILL');
      }
    } catch (err) {
      logger.window().error({
        msg: 'error: run check-memory schedule task error. error msg:',
        error: err,
      });
      throw err;
    }
  });

}

/**
 * get memory usage
 *
 * @return {*}
 */
function getMemoryUsageRate() {
  const memoryLimit = '/sys/fs/cgroup/memory/memory.limit_in_bytes';
  const memoryUsage = '/sys/fs/cgroup/memory/memory.usage_in_bytes';

  if (fs.existsSync(memoryLimit) && fs.existsSync(memoryUsage)) {
    const memory_max = fs.readFileSync(memoryLimit).toString().trim();
    const memory_current = fs.readFileSync(memoryUsage).toString().trim();
    const memoryUsed = parseInt(memory_current, 10) / parseInt(memory_max, 10);
    return memoryUsed;
  }

  const memoryMax = '/sys/fs/cgroup/memory.max';
  const memoryCurrent = '/sys/fs/cgroup/memory.current';
  if (fs.existsSync(memoryMax) && fs.existsSync(memoryCurrent)) {
    const memory_max = fs.readFileSync(memoryMax).toString().trim();
    const memory_current = fs.readFileSync(memoryCurrent).toString().trim();
    const memoryUsed = parseInt(memory_current, 10) / parseInt(memory_max, 10);
    return memoryUsed;
  }
  return 0;
}

/**
 * get restart status
 *
 * @param {OptionConfig} { triggerThreshold, intervalTime }
 * @return {*}
 */
function getRestartStatus({ triggerThreshold, intervalTime }: OptionConfig) {
  const memoryUsed = getMemoryUsageRate();
  // logger.prefix('memory-check').window().log('check-memory memoryUsed:', memoryUsed);
  if (!memoryUsed) { return { memoryUsed, result: false }; }

  if (memoryUsed >= triggerThreshold && !beginTime) {
    beginTime = Date.now();
    return { memoryUsed, result: false };
  }

  if (memoryUsed >= triggerThreshold && beginTime && (Date.now() - beginTime >= intervalTime)) {
    beginTime = 0;
    return { memoryUsed, result: true };
  }

  if (memoryUsed < triggerThreshold && beginTime) {
    beginTime = 0;
    return { memoryUsed, result: false };
  }

  return { memoryUsed, result: false };
}

