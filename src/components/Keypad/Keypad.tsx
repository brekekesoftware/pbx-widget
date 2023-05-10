import { FC, Fragment, useCallback } from "react";
import Button from "./Button";
import { fireMakeCallEvent } from "@/utils/events/triggers";
import { BackspaceIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

const keyRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

interface Props {
  inputKey: (key: string) => void;
  backspace: () => void;
  close: () => void;
  value: string;
  show: boolean;
  call: (number: string) => void;
}

const Keypad: FC<Props> = ({ inputKey, value, backspace, show, close, call }) => {
  const renderKey = useCallback(
    (key: string) => <Button key={key} value={key} onClick={() => inputKey(key)} />,
    [inputKey]
  );

  const renderRow = useCallback((row: string[]) => row.map(renderKey), [renderKey]);

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="absolute inset-0 z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/5" onClick={close} />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="bg-white absolute inset-x-0 bottom-0 p-2 rounded-sm">
            <input disabled value={value} className="w-full disabled:bg-transparent border text-xl text-center rounded font-bold px-2 py-1" />
            <div className="w-full mt-2 text-xl grid grid-cols-3 gap-1">
              {keyRows.map(renderRow)}
              <div className="col-start-2 flex items-center justify-center">
                <button
                  className="h-12 w-12 rounded-full bg-app font-bold flex items-center justify-center"
                  onClick={() => call(value)}
                >
                  <PhoneIcon className="text-white h-6 w-6" />
                </button>
              </div>
              {value !== "" && (
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
