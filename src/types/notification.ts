export enum Type {
  success = 'success',
  error = 'error',
  default = 'default',
}

export interface Notification {
  id: number;
  message: string;
  type: Type | keyof typeof Type;
}
