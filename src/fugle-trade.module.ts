import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { FugleTrade } from '@fugle/trade';
import { FugleTradeExplorer } from './fugle-trade.explorer';
import { FugleTradeMetadataAccessor } from './fugle-trade-metadata.accessor';
import { FugleTradeModuleOptions, FugleTradeModuleAsyncOptions, FugleTradeModuleOptionsFactory } from './interfaces';
import { FUGLE_TRADE_INSTANCE, FUGLE_TRADE_OPTIONS } from './fugle-trade.constants';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [FugleTradeExplorer, FugleTradeMetadataAccessor],
})
export class FugleTradeModule {
  static forRoot(options: FugleTradeModuleOptions): DynamicModule {
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

  static forRootAsync(options: FugleTradeModuleAsyncOptions): DynamicModule {
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
