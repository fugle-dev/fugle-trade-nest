import { Inject } from '@nestjs/common';
import { FUGLE_TRADE_INSTANCE } from '../fugle-trade.constants';

export const InjectFugleTrade = (): ParameterDecorator => {
  return Inject(FUGLE_TRADE_INSTANCE);
};
