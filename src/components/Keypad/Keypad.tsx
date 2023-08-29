import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import Button from './Button';
import { fireMakeCallEvent } from '@/utils/events/triggers';
import { BackspaceIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';

const keyRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

interface Props {
  show: boolean;
  close: () => void;
  title?: string;
  number?: string;
  onNumberChange?: (value: string) => void;
  onKeyInput?: (key: string) => void;
  call: (number: string) => void;
}

const Keypad: FC<Props> = ({ number, onNumberChange, title, onKeyInput, show, close, call }) => {
  const [value, setValue] = useState(number || '');

  useEffect(() => setValue(number || ''), [number]);

  const backspace = () => {
    if (value === '') return;
    // fireNumberEntryEvent(value.slice(0, value.length - 1));
    setValue(prevState => {
      if (prevState.length > 0) {
        const state = prevState.slice(0, prevState.length - 1);
        onNumberChange?.(state);
        return state;
      }
      return '';
    });
  };

  const inputKey = useCallback(
    (key: string) => {
      // fireNumberEntryEvent(value + key);
      setValue(prevState => {
        const state = prevState + key;
        onNumberChange?.(state);
        return state;
      });
      onKeyInput?.(key);
    },
    [value, onKeyInput],
  );

  const renderKey = useCallback(
    (key: string) => <Button key={key} value={key} onClick={() => inputKey(key)} />,
    [inputKey],
  );

  const renderRow = useCallback((row: string[]) => row.map(renderKey), [renderKey]);

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="absolute inset-0 z-40">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="absolute inset-0 bg-black/5" onClick={close} />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <div className="absolute inset-x-0 bottom-0 z-50 rounded-sm bg-white p-2">
            {title && (
              <div className="ml-1 text-center text-sm uppercase tracking-wide">{title}</div>
            )}
            <input
              disabled
              value={value}
              className="w-full rounded border px-2 py-1 text-center text-xl font-bold tracking-widest disabled:bg-transparent"
            />
            <div className="mt-2 grid w-full grid-cols-3 gap-1 text-xl">
              {keyRows.map(renderRow)}
              <div className="col-start-2 flex items-center justify-center">
                <button
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-app font-bold"
                  onClick={() => {
                    if (value.trim().length === 0) return;
                    close();
                    call(value);
                  }}>
                  <PhoneIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              {value !== '' && (
                <Button
                  value={<BackspaceIcon className="h-6 w-6 text-black" />}
                  onClick={backspace}
                />
              )}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Keypad;
