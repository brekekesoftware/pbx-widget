import {
  GlobalEvent,
  GlobalEventCallback,
  GlobalEventDetails,
  GlobalEventNames,
  GlobalEventTrigger,
} from '@/types/events';

const fireEvent = <TEventName extends GlobalEventNames>(name: TEventName, options: CustomEventInit<GlobalEventDetails<TEventName>>) => {
  return document.dispatchEvent(new CustomEvent<GlobalEventDetails<TEventName>>(`brekeke:${name}`, options));
};

const onEvent = <TEventName extends GlobalEventNames>(name: TEventName, callback: GlobalEventCallback<TEventName>): VoidFunction => {
  const listener = ((event: GlobalEvent<TEventName>) => {
    const response = callback(event.detail);
    if (event.cancelable && !event.defaultPrevented && response === false) {
      event.preventDefault();
    }
  }) as EventListener;

  const type = `brekeke:${name}`;
  document.addEventListener(type, listener);
  return () => document.removeEventListener(type, listener);
};

const fireCallEvent: GlobalEventTrigger<'call'> = (number: string) => {
  return fireEvent('call', { detail: { number }});
}

const onCallEvent = (callback: GlobalEventCallback<'call'>) => onEvent('call', callback);

