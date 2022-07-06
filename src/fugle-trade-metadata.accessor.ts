import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ListenerMetadata } from './interfaces';
import { STREAMER_LISTENER_METADATA } from './fugle-trade.constants';

@Injectable()
export class FugleTradeMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getStreamerListenerMetadata(target: Type<unknown>): ListenerMetadata | undefined {
    return this.reflector.get(STREAMER_LISTENER_METADATA, target);
  }
}
