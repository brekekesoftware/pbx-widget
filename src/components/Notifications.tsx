import { Notification, Type } from '@/types/notification';
import { onNotification } from '@/utils/events/listeners';
import { c } from '@/utils/html-class';
import { Transition } from '@headlessui/react';
import { FC, Fragment, useEffect, useMemo, useState } from 'react';

const timeouts: Record<number | string, NodeJS.Timeout> = {};

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
    });
  }, []);

  useEffect(() => {
    return () => {
      const ids = Object.keys(timeouts) as unknown as number[];
      ids.forEach(id => clearTimeout(timeouts[id]));
      remove(ids);
    };
  }, []);

  const notificationsX = useMemo(() => Object.values(notifications).sort(), [notifications]);

  if (notificationsX.length == 0) return null;

  return (
    <div className="absolute right-4 top-12 z-50 ml-4 flex flex-col items-end space-y-2">
      {notificationsX.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={() => remove(notification.id)}
        />
      ))}
    </div>
  );
};

interface Props {
  notification: Notification;
  onRemove: () => void;
}

const Notification: FC<Props> = ({ notification, onRemove }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    timeouts[notification.id] = setTimeout(() => setShow(false), 4000);
  }, [notification]);

  return (
    <Transition
      appear
      show={show}
      as={Fragment}
      afterLeave={onRemove}
      enter="duration-200 ease-out"
      enterFrom="opacity-0 translate-y-8"
      enterTo="opacity-100 translate-y-0"
      entered="transition-all duration-300 ease-linear"
      leave="duration-300 ease-in"
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
            className="rounded-full bg-gray-100/60 p-1 text-gray-500"
            onClick={() => setShow(false)}>
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
  );
};

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

const indicatorClass = (n: Notification) => indicator[n.type] ?? indicator.default;
const backgroundClass = (n: Notification) => background[n.type] ?? background.default;
const textClass = (n: Notification) => text[n.type] ?? text.default;
