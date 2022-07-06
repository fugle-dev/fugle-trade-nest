import { Module, DynamicModule, Provider } from '@nestjs/common';
import { FugleTrade } from '@fugle/trade';
import { FugleTradeModuleOptions, FugleTradeModuleAsyncOptions, FugleTradeModuleOptionsFactory } from './interfaces';
import { FUGLE_TRADE_INSTANCE, FUGLE_TRADE_OPTIONS } from './fugle-trade.constants';

@Module({})
export class FugleTradeModule {
  static register(options: FugleTradeModuleOptions): DynamicModule {
    return {
      module: FugleTradeModule,
      providers: [
        {
          provide: FUGLE_TRADE_INSTANCE,
          useValue: new FugleTrade(options),
        },
      ],
      exports: [FUGLE_TRADE_INSTANCE],
    };
  }

  static registerAsync(options: FugleTradeModuleAsyncOptions): DynamicModule {
    return {
      module: FugleTradeModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: FUGLE_TRADE_INSTANCE,
          useFactory: (options: FugleTradeModuleOptions) => new FugleTrade(options),
          inject: [FUGLE_TRADE_OPTIONS],
        },
      ],
      exports: [FUGLE_TRADE_INSTANCE],
    };
  }

  private static createAsyncProviders(options: FugleTradeModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: FugleTradeModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: FUGLE_TRADE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: FUGLE_TRADE_OPTIONS,
      useFactory: async (optionsFactory: FugleTradeModuleOptionsFactory) =>
        optionsFactory.createFugleTradeOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
