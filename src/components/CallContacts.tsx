import { callsState } from '@/state/callsState';
import { Contact } from '@/types/events';
import { Call } from '@/types/phone';
import { c } from '@/utils/html-class';
import { logger } from '@/utils/logger';
import { Menu, Transition } from '@headlessui/react';
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
    return contacts
      .map(contact => (
        <Menu.Item key={contact.id}>
          {({ active }) => {
            const s = selected?.id === contact.id;
            return (
              <button
                className={c('font-medium flex flex-col w-full items-start rounded-md px-2 py-2 text-sm overflow-ellipsis whitespace-nowrap truncate transition-all', { 'bg-app text-white': active || s })}
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
      <Menu.Button as={Fragment} disabled={disabled}>{children}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="px-1 py-1 absolute z-50 right-2 mt-2 w-56 origin-top-right space-y-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {renderContacts()}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default CallContacts;
