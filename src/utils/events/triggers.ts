import { CallInfo, GlobalEventTrigger, Log } from '@core/types/events';
import { Call } from '@core/types/phone';
import { fireEvent } from '@core/utils/events/common';

export const fireCallEvent: GlobalEventTrigger<'call'> = (call: any) => {
  return fireEvent('call', { call });
}

export const fireMakeCallEvent: GlobalEventTrigger<'make-call'> = (number: string) => {
  return fireEvent('make-call', { number });
}

export const fireNumberEntryEvent: GlobalEventTrigger<'number-entry'> = (number: string) => fireEvent('number-entry', { number });

export const fireCallUpdatedEvent: GlobalEventTrigger<'call-updated'> = (call: any) => fireEvent('call-updated', { call });
export const fireCallEndedEvent: GlobalEventTrigger<'call-ended'> = (call: any) => fireEvent('call-ended', { call });

export const fireLoggedInEvent: GlobalEventTrigger<'logged-in'> = () => fireEvent('logged-in');
export const fireLoggedOutEvent: GlobalEventTrigger<'logged-out'> = () => fireEvent('logged-out');

export const fireCallInfoEvent: GlobalEventTrigger<'call-info'> = (call: Call, info: CallInfo) => fireEvent('call-info', { call, info });

export const fireLogEvent: GlobalEventTrigger<'log'> = (log: Log) => fireEvent('log', { log });
export const fireLogSavedEvent: GlobalEventTrigger<'log-saved'> = (log: Log) => fireEvent('log-saved', { log });

