import { authState } from '@/state/authState';
import { callsState } from '@/state/callsState';
import { configState } from '@/state/configState';
import { CallRecord, Contact, Log } from '@/types/events';
import { Call } from '@/types/phone';
import { whenDev } from '@/utils/app';
import { id } from '@/utils/call';
import { onCallRecordedEvent, onLogFailedEvent, onLogSavedEvent } from '@/utils/events/listeners';
import { fireLogEvent } from '@/utils/events/triggers';
import { logger } from '@/utils/logger';
import { action, computed, makeObservable, observable } from 'mobx';

export class LogState {
  callsLog: Record<string, Log> = {};
  savedLogs: Record<string, boolean> = {};
  submitting = new Map<string, boolean>();
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

  constructor() {
    makeObservable(this, {
      callsLog: observable,
      savedLogs: observable,
      submitting: observable,
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
      logFailed: action,
      contactSelected: action,
    });

    onLogSavedEvent(this.saveLog);
    onLogFailedEvent(this.logFailed);
    onCallRecordedEvent(this.callRecorded);
  }

  get canSubmit() {
    if (this.current === undefined) return false;
    const idx = id(this.current);
    if (this.submitting.get(idx)) return false;
    return !this.savedLogs[idx] && callsState.callHasEnded(this.current);
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
    log.contactId = contact.id;
    log.contactType = contact.type;
    this.callsLog[id(call)] = log;
  };

  callRecorded = (record: CallRecord) => {
    const { roomId, recordingId, recordingURL } = record;

    // attach recording to latest call, using this because call backs use same room id.
    const id = Object.keys(callsState.callsEndedTime)
      .reverse()
      .find(k => k.endsWith(roomId));

    logger('callRecorded', record, id);

    if (!id) return;

    const call = callsState.callsRecord[id];
    const log = this.getLog(call);
    log.recording = { id: recordingId, url: recordingURL };
    this.callsLog[id] = log;
  };

  defaultCustomInputValues = (call: Call) => {
    return configState.logInputs.reduce(
      (object, { name, defaultValue }) => {
        let value = defaultValue ?? '';
        value = typeof value === 'function' ? value(call) : value;

        if (typeof value === 'string') {
          value = value.replace('#createdAt', new Date(call.createdAt).toUTCString());
        }

        object[name] = value;
        return object;
      },
      {} as Log['inputs'],
    );
  };

  getLog = (call: Call) => {
    return (this.callsLog[id(call)] ??= {
      call: call,
      duration: 0,
      contactId: callsState.callsContact[id(call)]?.id ?? '',
      contactType: callsState.callsContact[id(call)]?.type,
      tenant: authState.account?.pbxTenant ?? '',
      user: authState.account!.pbxUsername,
      inputs: this.defaultCustomInputValues(call),
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
    this.submitting.set(id(this.current), true);
    const log = this.getLog(this.current);
    log.duration = callsState.endedCallDuration(this.current);
    fireLogEvent(log);

    whenDev(() => setTimeout(() => this.saveLog(log), 2000));
  };

  saveLog = (log: Log) => {
    const idx = id(log.call);
    this.savedLogs[idx] = true;
    this.submitting.set(idx, false);
    if (this.current && idx === id(this.current)) {
      this.close();
    }
  };

  logFailed = (log: Log) => void this.submitting.set(id(log.call), false);

  callLogSaved = (call: Call) => this.savedLogs[id(call)] ?? false;

  reset = () => {
    this.callsLog = {};
    this.savedLogs = {};
    this.current = undefined;
  };
}

export const logState = new LogState();
