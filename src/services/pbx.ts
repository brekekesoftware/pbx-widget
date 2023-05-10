import { authState } from '@/state/authState';
import { AuthData } from '@/types/app';
import { Pbx, PbxEvent } from '@/types/brekekejs';
import { Call, Phone } from '@/types/phone';
import { onMakeCallEvent } from '@/utils/events/listeners';
import { fireCallEndedEvent, fireCallEvent, fireCallUpdatedEvent } from '@/utils/events/triggers';
import { logger } from '@/utils/logger';

export type AuthCallback = (value: boolean) => void;

export class PBX {
  pal?: Pbx;
  phone?: Phone;

  callRecord: Record<string, Call> = {};
  endedCalls: Record<string, Call> = {};

  get calls() {
    return Object.values(this.callRecord)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  private onHold = false;

  listeners: VoidFunction[] = [];

  constructor() {
    // makeObservable(this, {
    //   calls: computed,
    //   call: observable,
    //   callRecord: observable,
    //   endedCalls: observable,
    // });
  }

  call = (number: string) => {
    this.phone?.call(number);
  }

  connect = async (auth: AuthData & { callback: AuthCallback }) => {
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
      logger('phone.on(pal)', pal);
      authState.login(phone.getCurrentAccount());
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

      // auth?.callback?.(true);

      const account = phone.getCurrentAccount();
      logger('.on(pal)', { account, pal });

      this.pal = pal;

      this.listeners.push(
        onMakeCallEvent(event => {
          logger('onMakeCallEvent', event);

          phone.call(event.number);
        }),
      );
    });

    let answered = false;

    phone.on('call', call => {
      return;
      if (call.incoming && !answered) {
        answered = true;
        setTimeout(() => {
          logger('answering call');
          // call.answerCallKeep();
          // return;
          call.answer();
          return;
          this.pal?.call_pal('remoteControl', {
            talker_id: call.pbxTalkerId,
            tenant: 'esr',
            action: 'talk',
          });
        }, 5000);
      }
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
    this.callRecord[call.id] = call;
  }

  private onCallUpdated = (call: Call) => {
    logger('call_update', call);
    fireCallUpdatedEvent(call);
  }

  private onCallEnded = (call: Call) => {
    logger('call_end', call);
    fireCallEndedEvent(call);
  }

  answerCall = () => {
    // this.
  }

  endCall = () => {

  }

  toggleHold = () => {
    const param = {
      tid: this.pal?.getCurrentCall()?.pbxTalkerId,
      tenant: 'esr',
    };

    const action = this.onHold ? 'unhold' : 'hold';

    this.pal?.call_pal(action, param);
  }

  private removeListeners = () => {
    this.listeners.forEach(listener => listener());
    this.listeners = [];
  }

  disconnect = () => {
    authState.logout();
    this.phone?.cleanup();
    this.phone = undefined;
    this.pal = undefined;
    this.callRecord = {};
    this.removeListeners();
    logger('pbx disconnected');
  }

  disconnectx = () => {
    this.pal?.close();
    this.pal = undefined;
    this.removeListeners();
    logger('pbx disconnected');
  }

  private onClose = () => {
    logger('pbx closed');
    this.removeListeners();
  }

  private onError = (e: Error) => {
    logger('pbx error', e);
  }

  private onStatus = (e: PbxEvent['userStatus']) => {
    logger('notify_status', e);
  }

  private onServerStatus = (e: PbxEvent['serverStatus']) => {
    logger('notify_serverstatus', e);
  }

  private onVoicemail = (e: PbxEvent['voicemail']) => {
    logger('notify_voicemail', e);
  }

  private onCallRecording = (e: PbxEvent['callRecording']) => {
    logger('notify_callrecording', e);
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

  connectx = async (data: Partial<AuthData & { callback: AuthCallback }> = {}) => {
    const user = data.user ?? '50101';
    const password = data.password ?? '1234';
    const tenant = data.tenant ?? 'esr';
    const host = data.host ?? '127.0.0.1';
    const port = data.port ?? 8443;

    const uri = `wss://${host}:${port}/pbx/ws`;

    const client = window.Brekeke.pbx.getPal(uri, {
      tenant,
      user,
      login_user: user,
      login_password: password,
      secure_login_password: true,
      voicemail: 'self',
      callrecording: 'self',
      status: true,
      phonetype: 'webphone',
    });

    client.debugLevel = 2;

    client.call_pal = (method: keyof Pbx, params?: any) => {
      return new Promise((resolve, reject) => {
        const func = client[method] as Function;

        if (typeof func !== 'function') {
          return reject(new Error(`PAL client doesn't support "${method}"`))
        }

        func.call(client, params, (result: any) => {
          logger('call_pal', { method, params, result });
          resolve(result);
        }, reject);
      });
    }

    // logger('pal', pal);

    // const phone = window.Brekeke.Phone.render(document.getElementById('root'), {
    //   auto_login: true,
    //   clear_existing_accounts: true,
    //   accounts: [
    //     {
    //       hostname: host,
    //       port: port,
    //       tenant: tenant,
    //       username: user,
    //       password: password,
    //     },
    //   ],
    // });

    const login = new Promise<boolean>((resolve, reject) => {
      client.login(() => {
        resolve(true);
        data?.callback?.(true);
      }, reject);
    });

    client.onClose ??= this.onClose;
    client.onError ??= this.onError;
    client.notify_status ??= this.onStatus;
    client.notify_serverstatus ??= this.onServerStatus;
    client.notify_voicemail ??= this.onVoicemail;
    client.notify_callrecording ??= this.onCallRecording;

    // await Promise.race([login]);
    // pal.login(
    //   (...args) => {
    //     logger('login:success', ...args);
    //     data?.callback?.(true);
    //   },
    //   err => {
    //     logger('login:error', err);
    //     data?.callback?.(false);
    //   },
    // );

    this.pal = client;

    // pal.call_pal('makeCall', {
    //   user,
    //   from: user,
    //   to: ['50102'],
    //   type: '2',
    // });

    // this.getUsers()?.then(value => logger('getUsers', value));

    this.listeners.push(
      onMakeCallEvent(event => {
        logger('onMakeCallEvent', event);
        // @ts-ignore
        client.call_pal('makeCall', {
          user,
          from: user,
          to: [event.number],
          type: '2',
        });
      }),
    );
  };
}

export const pbx = new PBX();
