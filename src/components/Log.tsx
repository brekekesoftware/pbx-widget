import { configState } from '@/state/configState';
import { logState } from '@/state/logState';
import { Log } from '@/types/events';
import { Transition } from '@headlessui/react';
import { useObserver } from 'mobx-react';
import { FormEventHandler, Fragment, useEffect, useState } from 'react';

const Log = () => {
  const showLog = useObserver(() => logState.showLog);
  const currentLog = useObserver(() => logState.currentLog);
  const disableSubmit = useObserver(() => !logState.canSubmit);
  const submitted = useObserver(() => logState.submitted);

  const descriptionEnabled = useObserver(() => configState.logDescriptionEnabled);
  const resultEnabled = useObserver(() => configState.logResultEnabled);

  const [log, setLog] = useState(() => currentLog ?? ({} as Log));

  useEffect(() => {
    setLog(currentLog ?? ({} as Log));
  }, [currentLog]);

  const updateLog = <K extends keyof Log>(key: K, value: Log[K]) => {
    setLog(prevState => {
      logState.updateLog(key, value);
      return { ...prevState, [key]: value };
    });
  };

  const submit: FormEventHandler = e => {
    e.preventDefault();
    logState.submitLog();
  };

  return (
    <Transition appear show={showLog} as={Fragment}>
      <div className="absolute inset-0 z-40">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="absolute inset-0 bg-black/5" onClick={logState.close} />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <div className="bg-white shadow absolute z-50 inset-x-0 bottom-0 p-2 rounded-sm">
            <form onSubmit={submit} className="space-y-2 p-2 pb-6">
              <input
                type="text"
                value={log?.subject}
                disabled={submitted}
                placeholder="Subject"
                className="disabled:bg-gray-100 w-full rounded border border-gray-300 p-2 py-1"
                onChange={event => updateLog('subject', event.target.value)}
              />
              {descriptionEnabled && (
                <input
                  type="text"
                  value={log?.description}
                  disabled={submitted}
                  placeholder="Description"
                  className="disabled:bg-gray-100 w-full rounded border border-gray-300 p-2 py-1"
                  onChange={event => updateLog('description', event.target.value)}
                />
              )}
              <textarea
                className="disabled:bg-gray-100 w-full rounded border border-gray-300 p-2 py-1"
                placeholder="Comment"
                disabled={submitted}
                onChange={event => updateLog('comment', event.target.value)}
                value={log?.comment}
              />
              {resultEnabled && (
                <input
                  type="text"
                  value={log?.result}
                  disabled={submitted}
                  placeholder="Result"
                  className="disabled:bg-gray-100 w-full rounded border border-gray-300 p-2 py-1"
                  onChange={event => updateLog('result', event.target.value)}
                />
              )}
              <button
                disabled={disableSubmit}
                type="submit"
                className="bg-app disabled:bg-gray-200 disabled:text-black py-1 rounded font-bold uppercase text-white w-full">
                Submit
              </button>
            </form>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Log;
