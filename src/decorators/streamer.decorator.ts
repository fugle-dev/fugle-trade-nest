import { SetMetadata } from '@nestjs/common'
import { STREAMER_LISTENER_METADATA } from '../fugle-trade.constants'

export class Streamer {
  static On = (event: string) => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event })
  }

  static OnConnect = () => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event: 'connect' });
  }

  static OnDisconnect = () => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event: 'disconnect' });
  }

  static OnOrder = () => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event: 'order' });
  }

  static OnTrade = () => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event: 'trade' });
  }

  static OnMessage = () => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event: 'message' });
  }

  static OnError = () => {
    return SetMetadata(STREAMER_LISTENER_METADATA, { event: 'error' });
  }
}
