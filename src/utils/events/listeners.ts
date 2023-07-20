import { GlobalEventCallback } from '@core/types/events';
import { onEvent } from '@core/utils/events/common';

export const onNumberEntry = (callback: GlobalEventCallback<'number-entry'>) => onEvent('number-entry', callback);

export const onMakeCallEvent = (callback: GlobalEventCallback<'make-call'>) => onEvent('make-call', callback);

export const onCallEvent = (callback: GlobalEventCallback<'call'>) => onEvent('call', callback);
export const onCallUpdatedEvent = (callback: GlobalEventCallback<'call-updated'>) => onEvent('call-updated', callback);
export const onCallEndedEvent = (callback: GlobalEventCallback<'call-ended'>) => onEvent('call-ended', callback);

export const onLoggedInEvent = (callback: GlobalEventCallback<'logged-in'>) => onEvent('logged-in', callback);
export const onLoggedOutEvent = (callback: GlobalEventCallback<'logged-out'>) => onEvent('logged-out', callback);

export const onCallInfoEvent = (callback: GlobalEventCallback<'call-info'>) => onEvent('call-info', callback);

export const onLogEvent = (callback: GlobalEventCallback<'log'>) => onEvent('log', callback);
export const onLogSavedEvent = (callback: GlobalEventCallback<'log-saved'>) => onEvent('log-saved', callback);

export const onConfigEvent = (callback: GlobalEventCallback<'config'>) => onEvent('config', callback);

export const onCallRecordedEvent = (callback: GlobalEventCallback<'call-recorded'>) => onEvent('call-recorded', callback);
