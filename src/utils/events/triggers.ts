import { GlobalEventTrigger } from '@core/types/events';
import { fireEvent } from '@core/utils/events/common';

export const fireMakeCallEvent: GlobalEventTrigger<'make-call'> = number =>
  fireEvent('make-call', number);

export const fireNumberEntryEvent: GlobalEventTrigger<'number-entry'> = number =>
  fireEvent('number-entry', number);

export const fireCallEvent: GlobalEventTrigger<'call'> = call => fireEvent('call', call);
export const fireCallUpdatedEvent: GlobalEventTrigger<'call-updated'> = call =>
  fireEvent('call-updated', call);
export const fireCallEndedEvent: GlobalEventTrigger<'call-ended'> = call =>
  fireEvent('call-ended', call);
export const fireDuplicateContactCallAnsweredEvent: GlobalEventTrigger<
  'duplicate-contact-call-answered'
> = (call, contact) => fireEvent('duplicate-contact-call-answered', { call, contact });

export const fireLoggedInEvent: GlobalEventTrigger<'logged-in'> = account =>
  fireEvent('logged-in', account);
export const fireLoggedOutEvent: GlobalEventTrigger<'logged-out'> = () => fireEvent('logged-out');

export const fireCallInfoEvent: GlobalEventTrigger<'call-info'> = (call, info) =>
  fireEvent('call-info', { call, info });

export const fireLogEvent: GlobalEventTrigger<'log'> = log => fireEvent('log', log);
export const fireLogSavedEvent: GlobalEventTrigger<'log-saved'> = log =>
  fireEvent('log-saved', log);

export const fireConfigEvent: GlobalEventTrigger<'config'> = config => fireEvent('config', config);

export const fireCallRecordedEvent: GlobalEventTrigger<'call-recorded'> = e =>
  fireEvent('call-recorded', e);

export const fireContactSelectedEvent: GlobalEventTrigger<'contact-selected'> = (call, contact) =>
  fireEvent('contact-selected', { call, contact });
