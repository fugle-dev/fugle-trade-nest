# @fugle/trade-nest

[![NPM version][npm-image]][npm-url]

> A Nest module wrapper for [@fugle/trade](https://github.com/fugle-dev/fugle-trade-node)

## Installation

To begin using it, we first install the required dependency.

```bash
$ npm install --save @fugle/trade-nest @fugle/trade
```

## Getting started

Once the installation is complete, to use the `FugleTrade`, first import `FugleTradeModule` and pass the options with `configPath` to the `register()` method.

```typescript
import { Module } from '@nestjs/common';
import { FugleTradeModule } from '@fugle/trade-nest';

@Module({
  imports: [
    FugleTradeModule.register({
      configPath: '/path/to/config.ini',
    }),
  ],
})
export class IntradayModule {}
```

Next, inject the `FugleTrade` instance using the `@InjectFugleTrade()` decorator.

```typescript
constructor(@InjectFugleTrade() private readonly fugle: FugleTrade) {}
```

## Async configuration

When you need to pass module options asynchronously instead of statically, use the `registerAsync()` method. As with most dynamic modules, Nest provides several techniques to deal with async configuration.

One technique is to use a factory function:

```typescript
FugleTradeModule.registerAsync({
  useFactory: () => ({
    configPath: '/path/to/config.ini',
  }),
});
```

Like other factory providers, our factory function can be [async](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) and can inject dependencies through `inject`.

```typescript
FugleTradeModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    apiToken: configService.get('FUGLE_REALTIME_API_TOKEN'),
  }),
  inject: [ConfigService],
});
```

Alternatively, you can configure the `FugleTradeModule` using a class instead of a factory, as shown below.

```typescript
FugleTradeModule.registerAsync({
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
FugleTradeModule.registerAsync({
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
