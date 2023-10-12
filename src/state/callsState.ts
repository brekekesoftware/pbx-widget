import { logState } from '@/state/logState';
import { CallInfo, Contact } from '@/types/events';
import { Call } from '@/types/phone';
import { whenDev } from '@/utils/app';
import { unique, wrap } from '@/utils/array';
import { id } from '@/utils/call';
import {
  onCallEndedEvent,
  onCallEvent,
  onCallInfoEvent,
  onCallUpdatedEvent,
} from '@/utils/events/listeners';
import { fireContactSelectedEvent } from '@/utils/events/triggers';
import { action, computed, makeObservable, observable } from 'mobx';

export class CallsState {
  callsRecord: Record<string, Call> = {};
  callsEndedTime: Record<string, number | undefined> = {};
  callsContact: Record<string, Contact | undefined> = {};
  contactsRecord: Record<string, Contact[] | undefined> = {};

  get calls() {
    return Object.values(this.callsRecord).sort((a, b) => b.createdAt - a.createdAt);
  }

  get activeCalls() {
    return this.calls.filter(call => this.callsEndedTime[id(call)] === undefined);
  }

  get inactiveCalls() {
    return this.calls.filter(this.callHasEnded);
  }

  constructor() {
    makeObservable(this, {
      callsRecord: observable,
      callsEndedTime: observable,
      callsContact: observable,
      contactsRecord: observable,
      calls: computed,
      activeCalls: computed,
      inactiveCalls: computed,
      addCall: action,
      endCall: action,
      updateCallContact: action,
      callInfo: action,
      reset: action,
    });

    onCallEvent(this.addCall);
    onCallUpdatedEvent(this.addCall);
    onCallEndedEvent(this.endCall);
    onCallInfoEvent(({ call, info }) => this.callInfo(call, info));
  }

  addCall = (call: Call) => {
    if (!call.pbxRoomId) return;
    this.callsRecord[id(call)] = call;

    whenDev(() => {
      this.callInfo(call, [
        { id: '1', name: 'John Doe', type: 'user' },
        { id: '2', name: 'Jane Doe', type: 'lead' },
      ]);
    });
  };

  endCall = (call: Call) => {
    if (!call.pbxRoomId) return;
    this.callsEndedTime[id(call)] = Date.now();
  };

  callHasEnded = (call: Call) => this.callsEndedTime[id(call)] !== undefined;

  endedCallDuration = (call: Call) => this.callsEndedTime[id(call)]! - call.answeredAt;

  callContact = (call: Call) => this.callsContact[id(call)];

  displayName = (call: Call) => {
    const contact = this.callContact(call);
    if (contact === undefined) return undefined;
    return contact.name;
  };

  updateCallContact = (call: Call, contact: Contact) => {
    if (this.callContact(call)?.id === contact.id) return;
    const prev = this.callContact(call);
    this.callsContact[id(call)] = contact;
    logState.contactSelected(call, contact);
    if (this.callHasEnded(call) || prev === undefined) return;
    fireContactSelectedEvent(call, contact);
  };

  callInfo = (call: Call, info: CallInfo) => {
    const contacts = [...this.callContacts(call), ...wrap(info)];
    if (this.callsContact[id(call)] === undefined) {
      this.updateCallContact(call, contacts[0]);
    }
    this.contactsRecord[id(call)] = unique(contacts, ({ id, type }) => `${id} - ${type ?? ''}`);
  };

  callContacts = (call: Call) => this.contactsRecord[id(call)] ?? [];

  callHasMultipleContacts = (call: Call) => this.callContacts(call).length > 1;

  reset = () => {
    this.callsRecord = {};
    this.callsEndedTime = {};
    this.callsContact = {};
    this.contactsRecord = {};
  };
}

export const callsState = new CallsState();
