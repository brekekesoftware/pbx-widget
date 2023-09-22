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
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setLog(currentLog ?? ({} as Log));
    setShowError(false);
  }, [currentLog]);

  const updateLog = <K extends keyof Log>(key: K, value: Log[K]) => {
    setLog(prevState => {
      logState.updateLog(key, value);
      return { ...prevState, [key]: value };
    });

    if (showError && key === 'subject' && value) {
      setShowError(false);
    }
  };

  const submit: FormEventHandler = e => {
    e.preventDefault();

    if (!log.subject) {
      setShowError(true);
      return;
    }

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
          <div className="absolute inset-x-0 bottom-0 z-50 rounded-sm bg-white p-2 shadow">
            <form onSubmit={submit} className="space-y-2 p-2 pb-6">
              <input
                type="text"
                value={log?.subject ?? ''}
                disabled={submitted}
                placeholder="Subject"
                className="w-full rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
                onChange={event => updateLog('subject', event.target.value)}
              />
              {showError && (
                <span className="!-mt-1.5 inline-block text-sm text-red-400">
                  Subject cannot be empty
                </span>
              )}
              {descriptionEnabled && (
                <input
                  type="text"
                  value={log?.description ?? ''}
                  disabled={submitted}
                  placeholder="Description"
                  className="w-full rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
                  onChange={event => updateLog('description', event.target.value)}
                />
              )}
              <textarea
                className="w-full rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
                placeholder="Comment"
                disabled={submitted}
                onChange={event => updateLog('comment', event.target.value)}
                value={log?.comment ?? ''}
              />
              {resultEnabled && (
                <input
                  type="text"
                  value={log?.result ?? ''}
                  disabled={submitted}
                  placeholder="Result"
                  className="w-full rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
                  onChange={event => updateLog('result', event.target.value)}
                />
              )}
              <button
                disabled={disableSubmit}
                type="submit"
                className="w-full rounded bg-app py-1 font-bold uppercase text-white disabled:bg-gray-200 disabled:text-black">
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
