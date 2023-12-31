import App from '@/App';
import { WidgetCallback } from '@/types/brekekejs';
import {
  onCallEndedEvent,
  onCallEvent,
  onCallUpdatedEvent,
  onContactSelectedEvent,
  onDuplicateContactCallAnsweredEvent,
  onLogEvent,
  onLoggedInEvent,
  onLoggedOutEvent,
} from '@/utils/events/listeners';
import {
  fireCallInfoEvent,
  fireConfigEvent,
  fireLogFailedEvent,
  fireLogSavedEvent,
  fireMakeCallEvent,
  fireNotification,
} from '@/utils/events/triggers';
import React from 'react';
import ReactDOM from 'react-dom/client';

export const embedWidgetRender = () => {
  const initCallback = (callback: WidgetCallback) => {
    callback({
      fireCallInfoEvent,
      fireConfigEvent,
      fireLogFailedEvent,
      fireLogSavedEvent,
      fireMakeCallEvent,
      fireNotification,
      onCallEvent,
      onCallEndedEvent,
      onCallUpdatedEvent,
      onDuplicateContactCallAnsweredEvent,
      onLogEvent,
      onLoggedInEvent,
      onLoggedOutEvent,
      onContactSelectedEvent,
    });
  };

  const initWidget = (el: HTMLElement) => {
    ReactDOM.createRoot(el).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
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
