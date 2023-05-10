import { Call } from '@/types/phone';

type GlobalEventsMap = {
  'logged-in': {
    parameters: [],
    details: {},
    result: boolean | void,
  },
  'logged-out': {
    parameters: [],
    details: {},
    result: boolean | void,
  },
  'number-entry': {
    parameters: [number: string],
    details: {
      number: string,
    },
    result: boolean | void,
  },
  call: {
    parameters: [call: Call],
    details: {
      call: Call,
    },
    result: boolean | void,
  },
  'call-updated': {
    parameters: [call: Call],
    details: {
      call: Call,
    },
    result: boolean | void,
  },
  'call-ended': {
    parameters: [call: Call],
    details: {
      call: Call,
    },
    result: boolean | void,
  },
  'make-call': {
    parameters: [number: string],
    details: {
      number: string,
    },
    result: boolean | void,
  },
};

export type GlobalEventNames = keyof GlobalEventsMap;

export type GlobalEventParameters<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['parameters'];
export type GlobalEventDetails<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['details'];
export type GlobalEventResult<TEventName extends GlobalEventNames> = GlobalEventsMap[TEventName]['result'];
export type GlobalEvent<TEventName extends GlobalEventNames> = CustomEvent<GlobalEventDetails<TEventName>>;
export type GlobalEventTrigger<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>;
// export type GlobalEventCallback<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>;
export type GlobalEventCallback<TEventName extends GlobalEventNames> = (event: GlobalEvent<TEventName>['detail']) => GlobalEventResult<TEventName>;

declare global {
  interface DocumentEventMap {
    'brekeke:call': GlobalEvent<'call'>;
  }
}
