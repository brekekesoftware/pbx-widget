import { CallInfo } from '@/types/events';
import { Call } from '@/types/phone';
import {
  onCallEndedEvent,
  onCallEvent,
  onCallInfoEvent,
  onCallUpdatedEvent,
} from '@/utils/events/listeners';
import { action, computed, makeObservable, observable } from 'mobx';

export class CallsState {
  callsRecord: Record<string, Call> = {};
  callsEndedTime: Record<string, number> = {};
  callsInfo: Record<string, CallInfo> = {};

  get calls() {
    return Object.values(this.callsRecord)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  get activeCalls() {
    return this.calls.filter((call) => this.callsEndedTime[call.id] === undefined);
  }

  get inactiveCalls() {
    return this.calls.filter(this.callEnded);
  }

  constructor() {
    makeObservable(this, {
      callsRecord: observable,
      callsEndedTime: observable,
      callsInfo: observable,
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
    onCallInfoEvent(({ call, info }) => this.callInfo(call, info));
  }

  addCall = (call: Call) => {
    this.callsRecord[call.id] = call;
  }

  endCall = (call: Call) => {
    this.callsEndedTime[call.id] = Date.now();
  }

  callDuration = (call: Call) => this.callsEndedTime[call.id] - call.answeredAt;

  callInfo = (call: Call, info: CallInfo) => {
    if (this.callsInfo[call.id] !== undefined) return;
    this.callsInfo[call.id] = info;
  }

  displayName = (call: Call) => {
    const info = this.callsInfo[call.id];
    if (info === undefined) return undefined;
    return info.name;
  }

  callEnded = (call: Call) => this.callsEndedTime[call.id] !== undefined;

  reset = () => {
    this.callsRecord = {};
    this.callsEndedTime = {};
    this.callsInfo = {};
  }
}

export const callsState = new CallsState();
