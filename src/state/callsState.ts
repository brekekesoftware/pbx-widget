import { Call } from '@/types/phone';
import { onCallEndedEvent, onCallEvent, onCallUpdatedEvent } from '@/utils/events/listeners';
import { action, computed, makeObservable, observable } from 'mobx';

export class CallsState {
  callsRecord: Record<string, Call> = {};
  callsEndedTime: Record<string, number> = {};

  get calls() {
    return Object.values(this.callsRecord)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  get activeCalls() {
    return this.calls.filter((call) => this.callsEndedTime[call.id] === undefined);
  }

  get inactiveCalls() {
    return this.calls.filter((call) => this.callsEndedTime[call.id] !== undefined);
  }

  constructor() {
    makeObservable(this, {
      callsRecord: observable,
      callsEndedTime: observable,
      calls: computed,
      activeCalls: computed,
      inactiveCalls: computed,
      addCall: action,
      endCall: action,
      reset: action,
    });

    onCallEvent(e => this.addCall(e.call));
    onCallUpdatedEvent(e => this.addCall(e.call));
    onCallEndedEvent(e => this.endCall(e.call));
  }

  addCall = (call: Call) => {
    this.callsRecord[call.id] = call;
  }

  endCall = (call: Call) => {
    this.callsEndedTime[call.id] = Date.now();
  }

  reset = () => {
    this.callsRecord = {};
    this.callsEndedTime = {};
  }
}

export const callsState = new CallsState();
