import { authState } from '@/state/authState';
import { callsState } from '@/state/callsState';
import { logState } from '@/state/logState';
import { AuthData } from '@/types/app';
import { Pbx } from '@/types/brekekejs';
import { Call, Phone } from '@/types/phone';
import { onMakeCallEvent } from '@/utils/events/listeners';
import {
  fireCallEndedEvent,
  fireCallEvent,
  fireCallRecordedEvent,
  fireCallUpdatedEvent,
} from '@/utils/events/triggers';
import { logger } from '@/utils/logger';

export class PBX {
  pal?: Pbx;
  phone?: Phone;

  listeners: VoidFunction[] = [];

  call = (number: string) => {
    this.phone?.call(number);
  };

  connect = async (auth: AuthData) => {
    logger('PBX.connect', auth);
    const el = document.getElementById('webphone_embed')!;
    const phone: Phone = window.Brekeke.Phone.render(el, {
      autoLogin: true,
      clearExistingAccounts: true,
      accounts: [
        {
          hostname: auth.host,
          port: auth.port,
          tenant: auth.tenant,
          username: auth.user,
          password: auth.password,
        },
      ],
      palEvents: ['onClose', 'onError', 'notify_serverstatus', 'notify_status'],
      'webphone.pal.param.user': '*',
    });

    logger('phone', phone, el);

    // @ts-ignore
    phone.on('pal.onError', e => {
      logger('phone.on(pal.onError)', e);
      this.disconnect();
      // if (e.error.message === 'Login failed (4)') {
      //   console.log('Login failed');
      // }
    });

    // @ts-ignore
    phone.on('pal.onClose', e => {
      logger('phone.on(pal.onClose)', e);
      this.disconnect();
    });

    // @ts-ignore
    phone.on('pal.notify_serverstatus', e => logger('phone.on(pal.notify_serverstatus)', e));

    // @ts-ignore
    phone.on('pal.notify_status', e => {
      logger('phone.on(pal.notify_status)', e);
      const { status, rec, room_id } = e;

      if (status === '-1' && rec && room_id) {
        // https://127.0.0.1:8443/pbx/rec/fd60464ad65ef63400dba80cbd63f05b3d665c0f7f982b64f13bfdd3156824b2
        const url = `https://${auth.host}:${auth.port}/pbx/rec/${rec}`;
        logger('phone.on(recorded)', { status, rec, room_id, url });
        fireCallRecordedEvent({
          roomId: room_id,
          recordingId: rec,
          recordingURL: url,
        });
      }
    });

    phone.on('pal', pal => {
      const account = phone.getCurrentAccount();
      logger('phone.on(pal)', { account, pal });
      authState.login(account, () => {
        this.listeners.push(
          onMakeCallEvent(number => {
            logger('onMakeCallEvent', number);

            phone.call(number);
          }),
        );
      });

      this.pal = pal;
    });

    phone.on('call', this.onCall);
    phone.on('call_update', this.onCallUpdated);
    phone.on('call_end', this.onCallEnded);

    phone.on('webrtcclient', (phone: any) => {
      logger('webrtcclient', phone);
    });

    this.phone = phone;
  };

  private onCall = (call: Call) => {
    logger('phone.on.call', call);
    fireCallEvent(call);
  };

  private onCallUpdated = (call: Call) => {
    logger('phone.on.call_updated', call);
    fireCallUpdatedEvent(call);
  };

  private onCallEnded = (call: Call) => {
    logger('phone.on.call_end', call);
    fireCallEndedEvent(call);
  };

  private removeListeners = () => {
    this.listeners.forEach(listener => listener());
    this.listeners = [];
  };

  disconnect = () => {
    authState.logout();
    callsState.reset();
    logState.reset();
    this.phone?.removeAllListeners();
    this.phone?.cleanup();
    this.phone = undefined;
    this.pal = undefined;
    this.removeListeners();
    logger('pbx disconnected');
  };

  private onError = (e: Error) => {
    logger('pbx error', e);
  };

  getUsers = () => {
    if (!this.pal) {
      return;
    }

    return this.pal.call_pal('getExtensions', {
      tenant: 'esr',
      pattern: '..*',
      limit: -1,
      type: 'user',
      property_names: ['name'],
    });
  };
}

export const pbx = new PBX();
