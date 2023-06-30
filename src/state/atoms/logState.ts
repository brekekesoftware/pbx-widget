import { authState } from '@/state/authState';
import { callsState } from '@/state/callsState';
import { Log } from '@/types/events';
import { Call } from '@/types/phone';
import { onLogSavedEvent } from '@/utils/events/listeners';
import { fireLogEvent } from '@/utils/events/triggers';
import { action, computed, makeObservable, observable } from 'mobx';

export class LogState {
  callsLog: Record<string, Log> = {};
  savedLogs: Record<string, boolean> = {};
  current?: Call;

  get showLog() {
    return this.current !== undefined;
  }

  get currentLog() {
    return this.current && this.getLog(this.current);
  }

  get submitted() {
    return this.current && this.savedLogs[this.current.id];
  }

  get canSubmit() {
    if (this.current === undefined) return false;
    return !this.savedLogs[this.current.id] && callsState.callEnded(this.current);
  }

  constructor() {
    makeObservable(this, {
      callsLog: observable,
      savedLogs: observable,
      current: observable,
      showLog: computed,
      currentLog: computed,
      submitted: computed,
      canSubmit: computed,
      getLog: action,
      close: action,
      open: action,
      reset: action,
      updateLog: action,
      submitLog: action,
      saveLog: action,
    });

    onLogSavedEvent(e => this.saveLog(e.log));
  }

  open = (call: Call) => {
    this.current = call;
  }

  close = () => {
    this.current = undefined;
  }

  getLog = (call: Call) => {
    return this.callsLog[call.id] ??= {
      call: call,
      duration: 0,
      comment: '',
      recordId: callsState.callsInfo[call.id]?.id ?? '',
      result: '',
      subject: `Call on ${new Date(call.createdAt).toUTCString()}`,
      tenant: authState.account?.pbxTenant ?? '',
      user: authState.account!.pbxUsername
    };
  }

  updateLog = <K extends keyof Log>(key: K, value: Log[K]) => {
    if (this.current === undefined) return;
    const log = this.getLog(this.current);
    log[key] = value;
    this.callsLog[this.current.id] = log;
  }

  submitLog = () => {
    if (this.current === undefined) return;
    const log = this.getLog(this.current);
    log.duration = callsState.callDuration(this.current);
    fireLogEvent(log);
  }

  saveLog = (log: Log) => {
    this.savedLogs[log.call.id] = true;
    if (this.current && log.call.id === this.current.id) {
      this.close();
    }
  }

  reset = () => {
    this.callsLog = {};
    this.savedLogs = {};
    this.current = undefined;
  }
}

export const logState = new LogState();
