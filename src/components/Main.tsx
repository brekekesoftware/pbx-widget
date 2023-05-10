import Logo from '@/assets/images/logo.png';
import CallLog from '@/components/CallLog';
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

  useEffect(() => onNumberEntry((e) => setValue(e.number)), []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const account = useObserver(() => authState.account);

  const call = useCallback((number: string) => pbx.call(number), []);

  const submit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    call(value);
  }, [call, value]);

  return (
    <div>
      <div className='bg-white h-10 flex items-center p-2.5 border-b justify-between'>
        <img className='h-5' src={Logo} alt="" />
        <div className="flex gap-2 items-center">
          <div className="flex items-center rounded-full bg-gray-200 p-0.5 pl-2">
            <span className='font-bold text-sm'>{account!.pbxUsername}</span>
            <img className='h-6 w-6' src={user} alt="user" />
          </div>
          <button className='border border-transparent hover:border-gray-300 rounded-full' onClick={pbx.disconnect}>
            <img className='h-6 w-6' src={logout} alt="logout" title='logout' />
          </button>
        </div>
      </div>
      <div className="flex flex-col relative bg-gray-100/75" style={{ height: '450px' }}>
        <ActiveCalls state={callsState} />
        <CallLog />
        <form className="flex gap-2 py-1 p-2 mt-auto items-center border-t" onSubmit={submit}>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded border h-8 font-bold px-2"
          />
          <button onClick={open} type='button'>
            <img className="h-10 w-10" src={KeypadIcon} alt="keypad" />
          </button>
        </form>
        <Keypad
          number={value}
          onNumberChange={setValue}
          close={close}
          show={isOpen}
          call={call}
        />
      </div>
    </div>
  );
};

export default Main;
