# Widget Core

A javascript library which renders a PBX Widget and utilises [Brekekephone](https://github.com/brekekesoftware/brekekephone) to connect with your PBX instance.

It can be used to integrate PBX on platforms, your own website or as a standalone widget.

## Tech Stack
- ReactJS
- Brekekephone
- TailwindCSS
- MobX
- Vite

## Usage

### 1. Installation

Run the command `npm install` to install all the dependencies, then run `npm run build` to build the project.

After building, copy the contents of the `dist` folder to your project and include the following files in your HTML file.

### 2. Usage
Use the following method to render the widget on your page.

`window.Brekeke.renderWidget(element, callback)`

This renders the widget on the given element and calls the callback with a set of event triggers/listeners.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Brekeke PBX Widget</title>
    <script type="text/javascript" src="/webphone.js"></script>
    <script type="text/javascript" src="/widget.js"></script>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div id="widget_embed_div"></div>
    <script type="text/javascript">
      window.Brekeke.renderWidget(
        document.getElementById('widget_embed_div'),
        ({
           fireCallInfoEvent,
           fireConfigEvent,
           fireLogFailedEvent,
           fireLogSavedEvent,
           fireMakeCallEvent,
           fireNotification,
           onCallUpdatedEvent,
           onCallEndedEvent,
           onCallRecordedEvent,
           onDuplicateContactCallAnsweredEvent,
           onContactSelectedEvent,
           onLoggedOutEvent,
           onLoggedInEvent,
           onCallEvent,
           onLogEvent,
         }) => {
          // Use the event triggers and listeners here
          ...
        },
      );
    </script>
  </body>
</html>
```

### 3. Events & Triggers
The callback parameter of the `renderWidget` method exposes a set of event triggers and listeners which can be used to communicate between the widget and your app.

- `fireCallInfoEvent` - Update call with user information.
- `fireConfigEvent` - Configure widget behaviour.
- `fireLogFailedEvent` - Notify the widget that the log failed to save.
- `fireLogSavedEvent` - Notify the widget that the log saved successfully.
- `fireMakeCallEvent` - Start a call to number.
- `fireNotification` - Display a notification in the widget.
- `onCallEvent` - Listener for the call event. The callback is called with the call object as the event parameter.
- `onCallUpdatedEvent` - Listener for the call updated event. The callback is called with the call object as the event parameter.
- `onCallEndedEvent` - Listener for the call ended event. The callback is called with the call object as the event parameter.
- `onLoggedOutEvent` - Listener for the logged out event.
- `onLoggedInEvent` - Listener for the logged in event. The callback is called with the account object as the event parameter.
- `onLogEvent` - Listener for the log event. The callback is called with the log object as the event parameter.
- `onDuplicateContactCallAnsweredEvent` - Listener for incoming call with duplicate contacts answered event. The
  callback is called with an object which contains the selected contact, and the associated call.
- `onContactSelectedEvent` - Listener for contact selected event. The callback is called with an object which contains
  the selected contact, and the associated call.

