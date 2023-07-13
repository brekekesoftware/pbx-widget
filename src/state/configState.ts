import { Config } from '@/types/events';
import { onConfigEvent } from '@/utils/events/listeners';
import { action, computed, makeObservable, observable } from 'mobx';

export class ConfigState {
  _config?: Config = undefined;

  get logEnabled() {
    return this._config?.enableLog ?? true;
  }

  get logDescriptionEnabled() {
    return this._config?.enableLogDescription ?? false;
  }

  get logResultEnabled() {
    return this._config?.enableLogResult ?? true;
  }

  constructor() {
    makeObservable(this, {
      _config: observable,
      logEnabled: computed,
      logDescriptionEnabled: computed,
      logResultEnabled: computed,
      config: action,
    });

    onConfigEvent(this.config);
  }

  config = (config: Config) => {
    this._config = config;
  }
}

export const configState = new ConfigState();
