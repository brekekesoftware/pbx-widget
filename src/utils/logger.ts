import { whenDev } from '@core/utils/app';

export const logger = (...args: unknown[]) => {
  whenDev(() => console.log('widget-pbx', ...args));
};
