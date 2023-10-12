import { configState } from '@/state/configState';
import { logState } from '@/state/logState';
import { Log, SelectLogInput } from '@/types/events';
import { Transition } from '@headlessui/react';
import { useObserver } from 'mobx-react';
import { FormEventHandler, Fragment, useCallback, useEffect, useState } from 'react';

const Log = () => {
  const showLog = useObserver(() => logState.showLog);
  const currentLog = useObserver(() => logState.currentLog);
  const disableSubmit = useObserver(() => !logState.canSubmit);
  const submitted = useObserver(() => logState.submitted);

  const inputs = useObserver(() => configState.logInputs);

  const [log, setLog] = useState(() => currentLog ?? ({} as Log));
  const [showError, setShowError] = useState(false);

  const resetInputErrors = useCallback(() => {
    const initial = {} as Record<string, boolean>;
    return inputs.reduce((acc, { name, required }) => {
      if (required) acc[name] = !currentLog?.inputs?.[name];
      return acc;
    }, initial);
  }, [currentLog, inputs]);

  const [inputErrors, setInputErrors] = useState(resetInputErrors);

  useEffect(() => {
    setLog(currentLog ?? ({} as Log));
    setShowError(false);
    setInputErrors(resetInputErrors());
  }, [currentLog, resetInputErrors]);

  const updateLog = <K extends keyof Log>(key: K, value: Log[K]) => {
    setLog(prevState => {
      logState.updateLog(key, value);
      return { ...prevState, [key]: value };
    });
  };

  const submit: FormEventHandler = e => {
    e.preventDefault();

    const hasErrors = Object.values(inputErrors).filter(v => v).length > 0;
    setShowError(hasErrors);

    if (hasErrors) {
      return;
    }

    logState.submitLog();
  };

  const renderError = (text: string, show: boolean) => {
    if (!show) return null;

    return <span className="!-mt-1.5 inline-block text-sm text-red-400">{text}</span>;
  };

  const renderInputs = () => {
    return inputs.map(input => {
      const { type, name, required } = input;
      const label = input.label ?? name;

      const update = (value: string) => {
        const record = log?.inputs ?? {};
        updateLog('inputs', { ...record, [name]: value });
        if (required) setInputErrors(state => ({ ...state, [name]: !value }));
      };

      const hasError = !!required && !!inputErrors[name] && showError;

      const value = log?.inputs?.[name] ?? '';

      if (type === 'text') {
        return (
          <>
            <input
              key={name}
              type="text"
              value={value}
              disabled={submitted}
              placeholder={label}
              className="w-full rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
              onChange={event => update(event.target.value)}
            />
            {renderError(`${label} is required`, hasError)}
          </>
        );
      }

      if (type === 'textarea') {
        return (
          <>
            <textarea
              key={name}
              value={value}
              disabled={submitted}
              placeholder={label}
              className="block w-full resize-none rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
              onChange={event => update(event.target.value)}
            />
            {renderError(`${label} is required`, hasError)}
          </>
        );
      }

      if (type === 'select') {
        const { options } = input as SelectLogInput;
        return (
          <>
            <select
              key={name}
              value={value}
              disabled={submitted}
              className="w-full rounded border border-gray-300 p-2 py-1 disabled:bg-gray-100"
              onChange={e => update(e.target.value)}>
              <option disabled value={''}>
                Select {label}
              </option>
              {options.map(({ label, value }) => (
                <option key={`${name}-${label}`} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {renderError(`You have not selected a ${label}`, hasError)}
          </>
        );
      }
    });
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
          <button className="absolute inset-0 cursor-default bg-black/5" onClick={logState.close} />
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
              {renderInputs()}
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
