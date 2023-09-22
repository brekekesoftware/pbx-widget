import { Config } from '@/types/events';
import { whenDev } from '@/utils/app';
import { onConfigEvent } from '@/utils/events/listeners';
import { fireConfigEvent } from '@/utils/events/triggers';
import { action, computed, makeObservable, observable } from 'mobx';

export class ConfigState {
  _config?: Config = undefined;

  get logEnabled() {
    return this._config?.enableLog ?? true;
  }

  get logButtonTitle() {
    return this._config?.logButtonTitle ?? 'Note';
  }

  constructor() {
    makeObservable(this, {
      _config: observable,
      logEnabled: computed,
      logButtonTitle: computed,
      config: action,
    });

    onConfigEvent(this.config);

    whenDev(() =>
      fireConfigEvent({
        logInputs: [
          {
            label: 'Subject',
            name: 'subject',
            type: 'text',
            required: true,
            defaultValue: call => `Call on ${new Date(call.createdAt).toUTCString()}`,
          },
          {
            label: 'Description',
            name: 'description',
            type: 'textarea',
            required: true,
            defaultValue: 'hello',
          },
          {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
              { label: 'Open', value: 2 },
              { label: 'Pending', value: 3 },
              { label: 'Resolved', value: 4 },
              { label: 'Closed', value: 5 },
            ],
          },
          {
            label: 'Priority',
            name: 'priority',
            type: 'select',
            defaultValue: 2,
            options: [
              { label: 'Low', value: 1 },
              { label: 'Medium', value: 2 },
              { label: 'High', value: 3 },
              { label: 'Urgent', value: 4 },
            ],
          },
        ],
      }),
    );
  }

  get logInputs() {
    return this._config?.logInputs ?? [];
  }

  config = (config: Config) => {
    this._config = config;
  };
}

export const configState = new ConfigState();
