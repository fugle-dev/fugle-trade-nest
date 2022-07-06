import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { FugleTrade } from '@fugle/trade';
import { FugleTradeMetadataAccessor } from './fugle-trade-metadata.accessor';
import { FUGLE_TRADE_INSTANCE } from './fugle-trade.constants';

@Injectable()
export class FugleTradeExplorer implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(FUGLE_TRADE_INSTANCE) private readonly fugle: FugleTrade,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: FugleTradeMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
  ) { }

  onApplicationBootstrap() {
    this.fugle.login().then(() => {
      this.fugle.streamer.connect();
      this.loadStreamerListeners();
    });
  }

  onApplicationShutdown() {
    this.fugle.streamer.removeAllListeners();
    this.fugle.streamer.disconnect();
  }

  loadStreamerListeners() {
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();
    [...providers, ...controllers]
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(wrapper => wrapper.instance)
      .forEach((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;
        const prototype = Object.getPrototypeOf(instance) || {};
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) =>
            this.subscribeToStreamerIfListener(instance, methodKey),
        );
      });
  }

  private subscribeToStreamerIfListener(instance: Record<string, any>, methodKey: string) {
    const streamerListenerMetadata = this.metadataAccessor.getStreamerListenerMetadata(instance[methodKey]);
    if (!streamerListenerMetadata) return;

    const { event } = streamerListenerMetadata;
    const listenerMethod = this.fugle.streamer.on.bind(this.fugle.streamer);

    listenerMethod(event, (...args: unknown[]) => instance[methodKey].call(instance, ...args));
  }
}
