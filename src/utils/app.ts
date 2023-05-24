export function when(value: boolean, callback?: () => void): boolean {
  if (value) {
    callback?.();
    return true;
  }
  return value;
}

export const appMode = (): string => import.meta.env.MODE;

export const isProd = (callback?: () => void) => when(import.meta.env.PROD, callback);
export const whenProd = (callback?: () => void) => isProd(callback);

export const isDev = (callback?: () => void) => when(import.meta.env.DEV, callback);
export const whenDev = (callback?: () => void) => isDev(callback);

export const isSSR = (callback?: () => void) => when(import.meta.env.SSR, callback);

export const isMode = (modes: string | string[], callback?: () => void) =>
  when(modes.includes(appMode()), callback);
