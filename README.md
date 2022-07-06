# @fugle/trade-nest

[![NPM version][npm-image]][npm-url]

> A Nest module wrapper for [@fugle/trade](https://github.com/fugle-dev/fugle-trade-node)

## Installation

To begin using it, we first install the required dependencies.

```bash
$ npm install --save @fugle/trade-nest @fugle/trade
```

## Getting started

Once the installation is complete, import the `FugleTradeModule` into the root `AppModule` and run the `forRoot()` static method as shown below:

```typescript
import { Module } from '@nestjs/common';
import { FugleTradeModule } from '@fugle/trade-nest';

@Module({
  imports: [
    FugleTradeModule.forRoot({
      configPath: '/path/to/config.ini',
    }),
  ],
})
export class IntradayModule {}
```

The `.forRoot()` call initializes the `FugleTrade` client, then logs in to the remote server and connects to streamer when the `onApplicationBootstrap` lifecycle hook occurs.

Next, inject the `FugleTrade` instance using the `@InjectFugleTrade()` decorator.

```typescript
constructor(@InjectFugleTrade() private readonly fugle: FugleTrade) {}
```

## Declarative streamer listeners

The `@Streamer.On()` decorator will handle any event emitted from the streamer. Additionally, we provide decorators to let you declare streamer listeners easily.

```typescript
import { Injectable } from '@nestjs/common';
import { FugleTrade } from '@fugle/trade';
import { InjectFugleTrade, Streamer } from '@fugle/trade-nest';

@Injectable()
export class FugleTradeService {
  constructor(@InjectFugleTrade() private readonly fugle: FugleTrade) {}

  @Streamer.OnConnect()
  async onConnect() {
    // streamer connected
  }

  @Streamer.OnDisconnect()
  async onDisconnect() {
    // streamer disconnected
  }

  @Streamer.OnOrder()
  async onOrder(data) {
    // receive order confirmation
  }

  @Streamer.OnTrade()
  async onTrade(data) {
    // receive execution report
  }

  @Streamer.OnMessage()
  async onMessage(data) {
    // receive message from streamer
  }

  @Streamer.OnError()
  async onError(err) {
    // handle error
  }
}
```

## Async configuration

When you need to pass module options asynchronously instead of statically, use the `forRootAsync()` method. As with most dynamic modules, Nest provides several techniques to deal with async configuration.

One technique is to use a factory function:

```typescript
FugleTradeModule.forRootAsync({
  useFactory: () => ({
    configPath: '/path/to/config.ini',
  }),
});
```

Like other factory providers, our factory function can be [async](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) and can inject dependencies through `inject`.

```typescript
FugleTradeModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    configPath: configService.get('FUGLE_TRADE_CONFIG_PATH'),
  }),
  inject: [ConfigService],
});
```

Alternatively, you can configure the `FugleTradeModule` using a class instead of a factory, as shown below.

```typescript
FugleTradeModule.forRootAsync({
  useClass: FugleTradeConfigService,
});
```

The construction above instantiates `FugleTradeConfigService` inside `FugleTradeModule`, using it to create an options object. Note that in this example, the `FugleTradeConfigService` has to implement `FugleTradeModuleOptionsFactory` interface as shown below. The `FugleTradeModule` will call the `createFugleTradeOptions()` method on the instantiated object of the supplied class.

```typescript
@Injectable()
class FugleTradeConfigService implements FugleTradeModuleOptionsFactory {
  createFugleTradeOptions(): FugleTradeModuleOptions {
    return {
      configPath: '/path/to/config.ini',
    };
  }
}
```

If you want to reuse an existing options provider instead of creating a private copy inside the `FugleTradeModule`, use the `useExisting` syntax.

```typescript
FugleTradeModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: FugleTradeConfigService,
});
```

## Reference

- [fugle-trade-node](https://github.com/fugle-dev/fugle-trade-node)
- [富果股市 API](https://developer.fugle.tw)

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fugle/trade-nest.svg
[npm-url]: https://npmjs.com/package/@fugle/trade-nest
