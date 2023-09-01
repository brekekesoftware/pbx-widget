import { createListener } from '@core/utils/events/common';

export const onNumberEntry = createListener('number-entry');

export const onMakeCallEvent = createListener('make-call');

export const onCallEvent = createListener('call');
export const onCallUpdatedEvent = createListener('call-updated');
export const onCallEndedEvent = createListener('call-ended');
export const onDuplicateContactCallAnsweredEvent = createListener(
  'duplicate-contact-call-answered',
);

export const onLoggedInEvent = createListener('logged-in');
export const onLoggedOutEvent = createListener('logged-out');

export const onCallInfoEvent = createListener('call-info');

export const onLogEvent = createListener('log');
export const onLogSavedEvent = createListener('log-saved');

export const onConfigEvent = createListener('config');

export const onCallRecordedEvent = createListener('call-recorded');

export const onContactSelectedEvent = createListener('contact-selected');
export const onNotification = createListener('notification');
