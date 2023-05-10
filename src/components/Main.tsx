import Logo from '@/assets/images/logo.png';
import CallLog from '@/components/CallLog';
import { pbx } from '@/services/pbx';
import { authState } from '@/state/authState';
import { onNumberEntry } from '@/utils/events/listeners';
import { fireMakeCallEvent, fireNumberEntryEvent } from '@/utils/events/triggers';
import { useObserver } from 'mobx-react';
import { useCallback, useEffect, useState } from 'react';
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

  const backspace = () => {
    if (value === '') return;
    // fireNumberEntryEvent(value.slice(0, value.length - 1));
    setValue(prevState => {
      if (prevState.length > 0) {
        return prevState.slice(0, prevState.length - 1);
      }
      return '';
    });
  };

  const inputKey = useCallback(
    (key: string) => {
      // fireNumberEntryEvent(value + key);
      setValue(prevState => prevState + key);
    },
    [value],
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const account = useObserver(() => authState.account);

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
        <ActiveCalls />
        <CallLog />
        <div className="flex gap-2 py-1 p-2 mt-auto items-center border-t">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded border h-8 font-bold px-2"
          />
          <button onClick={open}>
            <img className="h-10 w-10" src={KeypadIcon} alt="keypad" />
          </button>
        </div>
        <Keypad
          backspace={backspace}
          inputKey={inputKey}
          value={value}
          close={close}
          show={isOpen}
          call={number => pbx.call(number)}
        />
      </div>
    </div>
  );
};

export default Main;
