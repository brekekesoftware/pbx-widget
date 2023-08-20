import {
  GlobalEvent,
  GlobalEventCallback,
  GlobalEventDetails,
  GlobalEventNames,
} from '@core/types/events';
import { logger } from '@core/utils/logger';

const prefix = 'brekeke';

export const fireEvent = <TEventName extends GlobalEventNames>(name: TEventName, detail: GlobalEventDetails<TEventName> = {}) => {
  logger(`fired-${name}`, detail);
  return document.dispatchEvent(new CustomEvent<typeof detail>(`${prefix}:${name}`, { detail }));
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

type GlobalEventListener<TEventName extends GlobalEventNames> = (callback: GlobalEventCallback<TEventName>) => VoidFunction;
type GlobalEventDispatcher<TEventName extends GlobalEventNames> = (detail?: GlobalEventDetails<TEventName>) => boolean;

const createDispatcher = <TEventName extends GlobalEventNames>(name: TEventName): GlobalEventDispatcher<TEventName> => {
  return detail => fireEvent(name, detail);
};

const createListener = <TEventName extends GlobalEventNames>(name: TEventName): GlobalEventListener<TEventName> => {
  return callback => onEvent(name, callback);
};

export { createListener, createDispatcher };

// const dispatchCallRecordedEvent = createDispatcher('call-recorded');
// const onCallRecordedEvent = createListener('call-recorded');

// const dispatchCallInfoEvent = createDispatcher('call-info');
// const dispatchLoggedOutEvent = createDispatcher('logged-out');

// dispatchCallRecordedEvent({ recordingURL: '', roomId: '', recordingId: '' });
// onCallRecordedEvent(event => void event.recordingURL);
