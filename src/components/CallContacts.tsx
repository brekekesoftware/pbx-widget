import { callsState } from '@/state/callsState';
import { Contact } from '@/types/events';
import { Call } from '@/types/phone';
import { c } from '@/utils/html-class';
import { logger } from '@/utils/logger';
import { Float } from '@headlessui-float/react';
import { Menu } from '@headlessui/react';
import { useObserver } from 'mobx-react';
import React, { FC, Fragment } from 'react';

interface Props {
  call: Call;
  disabled?: boolean;
  children: (props: { open: boolean }) => JSX.Element;
}

const CallContacts: FC<Props> = ({ call, disabled, children }) => {
  const contacts = useObserver(() => callsState.callContacts(call));
  const selected = useObserver(() => callsState.callContact(call));

  const clickContact = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation();
    callsState.updateCallContact(call, contact);
    logger('selected contact', contact);
  };

  const renderContacts = () => {
    return contacts.map(contact => (
      <Menu.Item key={contact.id}>
        {({ active }) => {
          const s = selected?.id === contact.id;
          return (
            <button
              className={c(
                'flex w-full flex-col truncate rounded-md px-2 py-2 text-start text-sm font-medium transition-all',
                { 'bg-app text-white': active || s },
              )}
              onClick={e => clickContact(e, contact)}>
              {contact.name}
              {contact.type && <span className="text-xs font-normal">{contact.type}</span>}
            </button>
          );
        }}
      </Menu.Item>
    ));
  };

  return (
    <Menu>
      <Float
        placement="bottom-start"
        flip
        offset={{ alignmentAxis: 10, mainAxis: 4 }}
        transform={false}
        floatingAs={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-75 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        tailwindcssOriginClass>
        <Menu.Button as={Fragment} disabled={disabled}>
          {children}
        </Menu.Button>

        <Menu.Items className="w-56 space-y-1 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {renderContacts()}
        </Menu.Items>
      </Float>
    </Menu>
  );
};

export default CallContacts;
