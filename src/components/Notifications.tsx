import { onNotification } from '@/utils/events/listeners';
import { c } from '@/utils/html-class';
import { Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

const timeouts: Record<number | string, NodeJS.Timeout> = {};

enum Type {
  success = 'success',
  error = 'error',
  default = 'default',
}

export interface Notification {
  id: number;
  message: string;
  type: Type | keyof typeof Type;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Record<number, Notification>>({});

  const remove = (id: number | number[]) => {
    const ids = Array.isArray(id) ? id : [id];

    setNotifications(prevState => {
      const newState = { ...prevState };
      ids.forEach(k => {
        delete newState[k];
        delete timeouts[k];
      });
      return newState;
    });
  };

  useEffect(() => {
    return () => {
      const id = 1;
      remove(id);
    };
  }, []);

  useEffect(() => {
    return onNotification(e => {
      const id = Date.now();
      const notification: Notification =
        typeof e === 'object' ? { ...e, id } : { message: e, type: 'default', id };
      setNotifications(prev => ({ ...prev, [id]: notification }));
      timeouts[id] = setTimeout(() => remove(id), 4000);
    });
  }, []);

  useEffect(() => {
    return () => {
      const ids = Object.keys(timeouts) as unknown as number[];
      ids.forEach(id => clearTimeout(timeouts[id]));
      remove(ids);
    };
  }, []);

  return (
    <div className="absolute right-4 top-12 z-50 ml-4 flex flex-col items-end space-y-2">
      {Object.values(notifications)
        .sort()
        .map(notification => (
          <Transition
            show
            appear
            as={Fragment}
            key={notification.id}
            enter="duration-1000 ease-out"
            enterFrom="opacity-0 translate-y-8"
            enterTo="opacity-100 translate-y-0"
            leave="duration-1000 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-8">
            <div className="flex min-h-[48px] gap-1.5 rounded-md bg-white p-1.5 text-sm shadow-md">
              <div className={c('w-1.5 rounded', indicatorClass(notification))} />
              <div
                className={c(
                  'flex w-full items-center gap-2 rounded px-1.5',
                  backgroundClass(notification),
                )}>
                <div className={c('flex-1 font-semibold', textClass(notification))}>
                  {notification.message}
                </div>
                <button
                  className="rounded-full bg-gray-100 p-1 text-gray-500"
                  onClick={() => remove(notification.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Transition>
        ))}
    </div>
  );
};

const indicatorClass = (n: Notification) => indicator[n.type] ?? indicator.default;
const backgroundClass = (n: Notification) => background[n.type] ?? background.default;
const textClass = (n: Notification) => text[n.type] ?? text.default;

interface Props {
  notification: Notification;
  onRemove: () => void;
}

export default Notifications;

const indicator: Record<Type, string> = {
  success: 'bg-emerald-500',
  default: 'bg-blue-500',
  error: 'bg-red-500',
};

const text: Record<Type, string> = {
  success: 'text-emerald-500',
  default: 'text-blue-500',
  error: 'text-red-500',
};

const background: Record<Type, string> = {
  success: 'bg-emerald-100',
  default: 'bg-blue-100',
  error: 'bg-red-100',
};
