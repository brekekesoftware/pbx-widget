import { Account, Call } from '@core/types/phone';
import { Notification } from './notification';

type GlobalEventsMap = {
  'logged-in': {
    parameters: [account: Account];
    details: Account;
    result: boolean | void;
  };
  'logged-out': {
    parameters: [];
    details: null;
    result: boolean | void;
  };
  'number-entry': {
    parameters: [number: string];
    details: string;
    result: boolean | void;
  };
  call: {
    parameters: [call: Call];
    details: Call;
    result: boolean | void;
  };
  'call-updated': {
    parameters: [call: Call];
    details: Call;
    result: boolean | void;
  };
  'call-ended': {
    parameters: [call: Call];
    details: Call;
    result: boolean | void;
  };
  'duplicate-contact-call-answered': {
    parameters: [call: Call, contact?: Contact];
    details: {
      call: Call;
      contact?: Contact;
    };
    result: boolean | void;
  };
  'make-call': {
    parameters: [number: string];
    details: string;
    result: boolean | void;
  };
  'call-info': {
    parameters: [call: Call, info: CallInfo];
    details: {
      call: Call;
      info: CallInfo;
    };
    result: boolean | void;
  };
  'contact-selected': {
    parameters: [call: Call, contact: Contact];
    details: {
      call: Call;
      contact: Contact;
    };
    result: boolean | void;
  };
  log: {
    parameters: [log: Log];
    details: Log;
    result: boolean | void;
  };
  'log-saved': {
    parameters: [log: Log];
    details: Log;
    result: boolean | void;
  };
  'log-failed': {
    parameters: [log: Log];
    details: Log;
    result: boolean | void;
  };
  config: {
    parameters: [config: Config];
    details: Config;
    result: boolean | void;
  };
  'call-recorded': {
    parameters: [data: CallRecord];
    details: CallRecord;
    result: boolean | void;
  };
  notification: {
    parameters: [notification: string | Omit<Notification, 'id'>];
    details: string | Omit<Notification, 'id'>;
    result: void;
  };
};

export interface Contact {
  id: string;
  name: string;
  type?: string;
}

export type CallInfo = Contact | Contact[];

interface LogInput {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  defaultValue?: string | number | ((call: Call) => string);
}

export interface SelectLogInput extends LogInput {
  type: 'select';
  options: { label: string; value: string | number }[];
}

export interface Config {
  enableLog?: boolean;
  logButtonTitle?: string;
  logInputs?: Array<LogInput | SelectLogInput>;
  version?: string;
}

export type Log = {
  call: Call;
  duration: number;
  recording?: { id: string; url: string };
  inputs: Record<string, string | number>;
  contactId: string;
  contactType?: string;
  related?: { id: string };
  tenant: string;
  user: string;
};

export interface CallRecord {
  roomId: string;
  recordingId: string;
  recordingURL: string;
}

export type GlobalEventNames = keyof GlobalEventsMap;

export type GlobalEventParameters<TEventName extends GlobalEventNames> =
  GlobalEventsMap[TEventName]['parameters'];
export type GlobalEventDetails<TEventName extends GlobalEventNames> =
  GlobalEventsMap[TEventName]['details'];
export type GlobalEventResult<TEventName extends GlobalEventNames> =
  GlobalEventsMap[TEventName]['result'];
export type GlobalEvent<TEventName extends GlobalEventNames> = CustomEvent<
  GlobalEventDetails<TEventName>
>;
export type GlobalEventTrigger<TEventName extends GlobalEventNames> = (
  ...params: GlobalEventParameters<TEventName>
) => GlobalEventResult<TEventName>;
// export type GlobalEventCallback<TEventName extends GlobalEventNames> = (...params: GlobalEventParameters<TEventName>) => GlobalEventResult<TEventName>;
export type GlobalEventCallback<TEventName extends GlobalEventNames> = (
  event: GlobalEvent<TEventName>['detail'],
) => GlobalEventResult<TEventName>;

declare global {
  interface DocumentEventMap {
    'brekeke:call': GlobalEvent<'call'>;
  }
}
