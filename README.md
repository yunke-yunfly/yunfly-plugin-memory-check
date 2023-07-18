# @yunflyjs/yunfly-plugin-memory-check

Yunfly memory check plugin. If a certain threshold is exceeded, kill node service.

## Usage

1. install

```bash
yarn add @yunflyjs/yunfly-plugin-memory-check
```

2. declare plugins in **config/config.plugin.ts**

```ts
/**
 * yunfly plugin
 */
const plugins: {[key:string]: string}[] = [
  {
    name: 'memoryCheck',
    package: '@yunflyjs/yunfly-plugin-memory-check',
    lifeHook: 'beforeStart'
  }
];
// 
export default plugins;
```

3. enable plugins in **config/config.default.ts**

```js
config.memoryCheck = {
  enable: true,
  triggerThreshold: 0.9, // memory usage rate 90%
  intervalTime: 300000, // 5 minute
  cron: '*/20 * * * * *',
}
```


