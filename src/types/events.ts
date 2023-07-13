import { Account, Call } from '@core/types/phone';

type GlobalEventsMap = {
  'logged-in': {
    parameters: [account: Account],
    details: Account,
    result: boolean | void,
  },
  'logged-out': {
    parameters: [],
    details: null,
    result: boolean | void,
  },
  'number-entry': {
    parameters: [number: string],
    details: string,
    result: boolean | void,
  },
  call: {
    parameters: [call: Call],
    details: Call,
    result: boolean | void,
  },
  'call-updated': {
    parameters: [call: Call],
    details: Call,
    result: boolean | void,
  },
  'call-ended': {
    parameters: [call: Call],
    details: Call,
    result: boolean | void,
  },
  'make-call': {
    parameters: [number: string],
    details: string,
    result: boolean | void,
  },
  'call-info': {
    parameters: [call: Call, info: CallInfo],
    details: {
      call: Call,
      info: CallInfo,
    },
    result: boolean | void,
  },
  log: {
    parameters: [log: Log],
    details: Log,
    result: boolean | void,
  },
  'log-saved': {
    parameters: [log: Log],
    details: Log,
    result: boolean | void,
  },
  config: {
    parameters: [config: Config],
    details: Config,
    result: boolean | void,
  }
};

export interface CallInfo {
  id: string;
  name: string;
  type?: string;
}

export interface Config {
  enableLog?: boolean;
  enableLogDescription?: boolean;
  enableLogResult?: boolean;
}

export type Log = {
  call: Call,
  duration: number,
  subject: string,
  description: string,
  comment: string,
  result: string,
  recordId: string,
  recordType?: string,
  relatedRecordId?: string,
  tenant: string,
  user: string,
}

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
