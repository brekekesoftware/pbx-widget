import {
  GlobalEvent,
  GlobalEventCallback,
  GlobalEventDetails,
  GlobalEventNames,
} from '@core/types/events';
import { logger } from '@core/utils/logger';

const prefix = 'brekeke';

export const fireEvent = <TEventName extends GlobalEventNames>(name: TEventName, detail: CustomEventInit<GlobalEventDetails<TEventName>>['detail'] = {}) => {
  logger(`fired-${name}`, detail);
  return document.dispatchEvent(new CustomEvent<GlobalEventDetails<TEventName>>(`${prefix}:${name}`, { detail }));
};

export const onEvent = <TEventName extends GlobalEventNames>(name: TEventName, callback: GlobalEventCallback<TEventName>): VoidFunction => {
  const listener = ((event: GlobalEvent<TEventName>) => {
    logger(`on-${name}`, event.detail);
    const response = callback(event.detail);
    if (event.cancelable && !event.defaultPrevented && response === false) {
      event.preventDefault();
    }
  }) as EventListener;

  const type = `${prefix}:${name}`;
  document.addEventListener(type, listener);
  return () => document.removeEventListener(type, listener);
};
