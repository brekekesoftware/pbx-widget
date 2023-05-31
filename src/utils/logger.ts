import { whenDev } from '@/utils/app';

export const logger = (...args: any[]) => {
  whenDev(() => console.log('pbx-widget', ...args));
}
