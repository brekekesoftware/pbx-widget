import Logo from '@/assets/images/logo.png';
import CallLog from '@/components/CallLog';
import Log from '@/components/Log';
import { pbx } from '@/services/pbx';
import { authState } from '@/state/authState';
import { onNumberEntry } from '@/utils/events/listeners';
import { fireMakeCallEvent, fireNumberEntryEvent } from '@/utils/events/triggers';
import { useObserver } from 'mobx-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import ActiveCalls from './ActiveCalls';
import { callsState } from '@/state/callsState';
import Keypad from './Keypad';
import KeypadIcon from '@/assets/icons/keypad.svg';
import logout from '@/assets/icons/logout.png';
import user from '@/assets/icons/user.png';

const Main = () => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => onNumberEntry(setValue), []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const account = useObserver(() => authState.account);

  const call = useCallback((number: string) => pbx.call(number), []);

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      call(value);
    },
    [call, value],
  );

  return (
    <>
      <div className="z-50 flex h-10 items-center justify-between border-b bg-white p-2.5">
        <img className="h-5" src={Logo} alt="" />
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full bg-gray-200 p-0.5 pl-2">
            <span className="text-sm font-bold">{account!.pbxUsername}</span>
            <img className="h-6 w-6" src={user} alt="user" />
          </div>
          <button
            className="rounded-full border border-transparent hover:border-gray-300"
            onClick={pbx.disconnect}>
            <img className="h-6 w-6" src={logout} alt="logout" title="logout" />
          </button>
        </div>
      </div>
      <ActiveCalls />
      <CallLog />
      <form
        className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t p-2 py-1"
        onSubmit={submit}>
        <input
          value={value}
          onChange={event => setValue(event.target.value)}
          className="h-8 w-full rounded border px-2 font-bold"
        />
        <button onClick={open} type="button">
          <img className="h-10 w-10" src={KeypadIcon} alt="keypad" />
        </button>
      </form>
      <Keypad number={value} onNumberChange={setValue} close={close} show={isOpen} call={call} />
      <Log />
    </>
  );
};

export default Main;
