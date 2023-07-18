import checkMemory from './check-memory';

interface PluginOptions {
  pluginConfig: MemoryCheckPluginConfig;
}

export interface MemoryCheckPluginConfig {
  enable: boolean;
  triggerThreshold?: number;
  intervalTime?: number;
  cron?: string;
}

/**
 * yunfly plugin
 *
 * @export
 * @param {PluginOptions} {
 *   pluginConfig,
 * }
 * @return {*}  {void}
 */
export default function yunflyPlugin({
  pluginConfig,
}: PluginOptions): void {
  const { enable, triggerThreshold, intervalTime, cron } = pluginConfig;

  if (!enable) return;

  const option: any = {
    triggerThreshold: +(process as any).env.CHECK_MEMORY_INTERVAL_TIME || triggerThreshold,
    intervalTime: +(process as any).env.CHECK_MEMORY_INTERVAL_TIME || intervalTime,
    cron: process.env.CHECK_MEMORY_INTERVAL_TIME || cron,
  };
  checkMemory(option);
}

