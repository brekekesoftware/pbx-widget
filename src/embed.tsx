import App from '@/App';
import { WidgetCallback } from '@/types/brekekejs';
import {
  onCallEndedEvent,
  onCallEvent,
  onCallRecordedEvent,
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
  const initCallback = (callback: WidgetCallback) => {
    callback({
      fireCallInfoEvent,
      fireConfigEvent,
      fireLogSavedEvent,
      fireMakeCallEvent,
      onCallEvent,
      onCallEndedEvent,
      onCallRecordedEvent,
      onCallUpdatedEvent,
      onLogEvent,
      onLoggedInEvent,
      onLoggedOutEvent,
    });
  };

  const initWidget = (el: HTMLElement) => {
    ReactDOM.createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);
  };

  window.Brekeke.renderWidget = (el, callback) => {
    initWidget(el);
    initCallback(callback);
  };

  window.Brekeke.widget = {
    render: initWidget,
    events: initCallback,
  };
};

