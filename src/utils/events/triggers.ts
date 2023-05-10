import { GlobalEventTrigger } from '@/types/events';
import { fireEvent } from '@/utils/events/common';

export const fireCallEvent: GlobalEventTrigger<'call'> = (call: any) => {
  return fireEvent('call', { call });
}

export const fireMakeCallEvent: GlobalEventTrigger<'make-call'> = (number: string) => {
  return fireEvent('make-call', { number });
}

export const fireNumberEntryEvent: GlobalEventTrigger<'number-entry'> = (number: string) => fireEvent('number-entry', { number });

export const fireCallUpdatedEvent: GlobalEventTrigger<'call-updated'> = (call: any) => fireEvent('call-updated', { call });
export const fireCallEndedEvent: GlobalEventTrigger<'call-ended'> = (call: any) => fireEvent('call-ended', { call });
