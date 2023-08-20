import { logState } from '@/state/logState';
import { CallInfo, Contact } from '@/types/events';
import { Call } from '@/types/phone';
import { whenDev } from '@/utils/app';
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
    return this.calls.filter(call => this.callsEndedTime[call.id] === undefined);
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
    this.callsRecord[call.id] = call;

    whenDev(() => {
      this.callInfo(call, [
        { id: '1', name: 'John Doe', type: 'user' },
        { id: '2', name: 'Jane Doe', type: 'lead' },
      ]);
    });
  };

  endCall = (call: Call) => {
    this.callsEndedTime[call.id] = Date.now();
  };

  callHasEnded = (call: Call) => this.callsEndedTime[call.id] !== undefined;

  endedCallDuration = (call: Call) => this.callsEndedTime[call.id]! - call.answeredAt;

  callContact = (call: Call) => this.callsContact[call.id];

  displayName = (call: Call) => {
    const contact = this.callContact(call);
    if (contact === undefined) return undefined;
    return contact.name;
  };

  updateCallContact = (call: Call, contact: Contact) => {
    if (this.callContact(call)?.id === contact.id) return;
    const prev = this.callContact(call);
    this.callsContact[call.id] = contact;
    logState.contactSelected(call, contact);
    if (this.callHasEnded(call) || prev === undefined) return;
    fireContactSelectedEvent(call, contact);
  };

  callInfo = (call: Call, info: CallInfo) => {
    if (this.callsContact[call.id] !== undefined) return;
    this.updateCallContact(call, Array.isArray(info) ? info[0] : info);
    if (Array.isArray(info)) this.contactsRecord[call.id] = info;
  };

  callContacts = (call: Call) => this.contactsRecord[call.id] ?? [];

  callHasMultipleContacts = (call: Call) => this.callContacts(call).length > 1;

  reset = () => {
    this.callsRecord = {};
    this.callsEndedTime = {};
    this.callsContact = {};
    this.contactsRecord = {};
  };
}

export const callsState = new CallsState();
