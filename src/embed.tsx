import App from '@/App';
import {
  onCallEndedEvent,
  onCallEvent,
  onCallUpdatedEvent,
  onLogEvent,
  onLoggedInEvent,
  onLoggedOutEvent,
} from '@/utils/events/listeners';
import {
  fireCallInfoEvent,
  fireConfigEvent,
  fireLogSavedEvent,
  fireMakeCallEvent,
} from '@/utils/events/triggers';
import React from 'react';
import ReactDOM from 'react-dom/client';

export const embedWidgetRender = () => {
  window.Brekeke.renderWidget = (el, callback) => {
    ReactDOM.createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);

    callback({
      fireCallInfoEvent,
      fireConfigEvent,
      fireLogSavedEvent,
      fireMakeCallEvent,
      onCallEvent,
      onCallEndedEvent,
      onCallUpdatedEvent,
      onLogEvent,
      onLoggedInEvent,
      onLoggedOutEvent,
    });
  };
};

