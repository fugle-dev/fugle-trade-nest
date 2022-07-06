import { ModuleMetadata, Type } from '@nestjs/common';
import { FugleTradeOptions } from '@fugle/trade';

export interface FugleTradeModuleOptions extends FugleTradeOptions {}

export interface FugleTradeModuleOptionsFactory {
  createFugleTradeOptions(): Promise<FugleTradeModuleOptions> | FugleTradeModuleOptions;
}

export interface FugleTradeModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FugleTradeModuleOptionsFactory>;
  useClass?: Type<FugleTradeModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<FugleTradeModuleOptions> | FugleTradeModuleOptions;
  inject?: any[];
}
