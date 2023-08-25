import { authState } from '@/state/authState';
import { callsState } from '@/state/callsState';
import { Contact, Log } from '@/types/events';
import { Call } from '@/types/phone';
import { whenDev } from '@/utils/app';
import { id } from '@/utils/call';
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
    return this.current && this.savedLogs[id(this.current)];
  }

  get canSubmit() {
    if (this.current === undefined) return false;
    return !this.savedLogs[id(this.current)] && callsState.callHasEnded(this.current);
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
      contactSelected: action,
    });

    onLogSavedEvent(this.saveLog);
  }

  open = (call: Call) => {
    this.current = call;
  };

  close = () => {
    this.current = undefined;
  };

  contactSelected = (call: Call, contact: Contact) => {
    if (this.callLogSaved(call)) return;
    const log = this.callsLog[id(call)];
    if (log === undefined) return;
    log.recordId = contact.id;
    log.recordType = contact.type;
    this.callsLog[id(call)] = log;
  };

  getLog = (call: Call) => {
    return (this.callsLog[id(call)] ??= {
      call: call,
      duration: 0,
      subject: `Call on ${new Date(call.createdAt).toUTCString()}`,
      comment: '',
      description: '',
      result: '',
      recordId: callsState.callsContact[id(call)]?.id ?? '',
      recordType: callsState.callsContact[id(call)]?.type,
      tenant: authState.account?.pbxTenant ?? '',
      user: authState.account!.pbxUsername,
    });
  };

  updateLog = <K extends keyof Log>(key: K, value: Log[K]) => {
    if (this.current === undefined) return;
    const log = this.getLog(this.current);
    log[key] = value;
    this.callsLog[id(this.current)] = log;
  };

  submitLog = () => {
    if (this.current === undefined) return;
    const log = this.getLog(this.current);
    log.duration = callsState.endedCallDuration(this.current);
    fireLogEvent(log);

    whenDev(() => setTimeout(() => this.saveLog(log), 2000));
  };

  saveLog = (log: Log) => {
    this.savedLogs[id(log.call)] = true;
    if (this.current && id(log.call) === id(this.current)) {
      this.close();
    }
  };

  callLogSaved = (call: Call) => this.savedLogs[id(call)] ?? false;

  reset = () => {
    this.callsLog = {};
    this.savedLogs = {};
    this.current = undefined;
  };
}

export const logState = new LogState();
