import { onLoggedInEvent, onLoggedOutEvent } from '@/utils/events/listeners';
import { fireMakeCallEvent } from '@/utils/events/triggers';

// document.addEventListener('load', () => {
  // add click to dial listener
  sforce.opencti.onClickToDial({
    listener: (payload) => {
      console.log('clickToDial', payload);
      fireMakeCallEvent(String(payload.number));
    },
  });
// })

onLoggedInEvent(() => {
  sforce.opencti.enableClickToDial({ callback: () => console.log('enableClickToDial') });
});

onLoggedOutEvent(() => {
  sforce.opencti.disableClickToDial({ callback: () => console.log('disableClickToDial') });
});
