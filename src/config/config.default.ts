
/**
 *
 * @export
 * @param {KoaApp} app
 * @returns
 */
export default function config(): any {
  const config: any = {};

  config.memoryCheck = {
    enable: false,
    triggerThreshold: 0.9,
    intervalTime: 300000,
    cron: '*/20 * * * * *',
  };

  return config;
}
