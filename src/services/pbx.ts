import { authState } from '@/state/authState';
import { callsState } from '@/state/callsState';
import { AuthData } from '@/types/app';
import { Pbx, PbxEvent } from '@/types/brekekejs';
import { Call, Phone } from '@/types/phone';
import { onMakeCallEvent } from '@/utils/events/listeners';
import { fireCallEndedEvent, fireCallEvent, fireCallUpdatedEvent } from '@/utils/events/triggers';
import { logger } from '@/utils/logger';

export class PBX {
  pal?: Pbx;
  phone?: Phone;

  listeners: VoidFunction[] = [];

  call = (number: string) => {
    this.phone?.call(number);
  }

  connect = async (auth: AuthData) => {
    logger('PBX.connect', auth);
    const el = document.getElementById('webphone_embed')!;
    const phone: Phone = window.Brekeke.Phone.render(el, {
      auto_login: true,
      clear_existing_accounts: true,
      accounts: [
        {
          hostname: auth.host,
          port: auth.port,
          tenant: auth.tenant,
          username: auth.user,
          password: auth.password,
        },
      ],
    });

    phone.on('pal', (pal) => {
      const account = phone.getCurrentAccount();
      logger('phone.on(pal)', { account, pal });
      authState.login(account);

      const onError = pal.onError;
      pal.onError = (e) => {
        onError?.(e);
        console.log('pal.onError', e);
        // auth?.callback?.(false);
        authState.logout();
        // if (e.error.message === 'Login failed (4)') {
        //   console.log('Login failled');
        //   auth?.callback?.(false);
        // }
      }

      this.pal = pal;

      this.listeners.push(
        onMakeCallEvent(event => {
          logger('onMakeCallEvent', event);

          phone.call(event.number);
        }),
      );
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
    logger('call', call);
    fireCallEvent(call);
  }

  private onCallUpdated = (call: Call) => {
    logger('call_update', call);
    fireCallUpdatedEvent(call);
  }

  private onCallEnded = (call: Call) => {
    logger('call_end', call);
    fireCallEndedEvent(call);
  }

  private removeListeners = () => {
    this.listeners.forEach(listener => listener());
    this.listeners = [];
  }

  disconnect = () => {
    authState.logout();
    callsState.reset();
    this.phone?.cleanup();
    this.phone = undefined;
    this.pal = undefined;
    this.removeListeners();
    logger('pbx disconnected');
  }

  private onError = (e: Error) => {
    logger('pbx error', e);
  }

  getUsers = () => {
    if (!this.pal) {
      return
    }

    return this.pal.call_pal('getExtensions', {
      tenant: 'esr',
      pattern: '..*',
      limit: -1,
      type: 'user',
      property_names: ['name'],
    })
  }
}

export const pbx = new PBX();
