import { whenDev } from '@core/utils/app';

export const logger = (...args: any[]) => {
  whenDev(() => console.log('widget-pbx', ...args));
};
