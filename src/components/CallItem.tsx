import AttendedTransferIcon from '@/assets/icons/attended-transfer.svg';
import BlindTransferIcon from '@/assets/icons/blind-transfer.svg';
import MicOffIcon from '@/assets/icons/mic-off.svg';
import MicIcon from '@/assets/icons/mic.svg';
import { ReactComponent as NoteIcon } from '@/assets/icons/note.svg';
import PauseIcon from '@/assets/icons/pause.svg';
import PlayIcon from '@/assets/icons/play.svg';
import CallContacts from '@/components/CallContacts';
import Keypad from '@/components/Keypad';
import { callsState } from '@/state/callsState';
import { configState } from '@/state/configState';
import { logState } from '@/state/logState';
import { Call } from '@/types/phone';
import { onContactSelectedEvent } from '@/utils/events/listeners';
import { fireDuplicateContactCallAnsweredEvent } from '@/utils/events/triggers';
import { c } from '@/utils/html-class';
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { observer, useObserver } from 'mobx-react';
import React, { FC, useEffect, useState } from 'react';
import Duration from './Duration';

interface Props {
  call: Call;
}

const CallItem: FC<Props> = observer(({ call }) => {
  const logEnabled = useObserver(() => configState.logEnabled);
  const logButtonTitle = useObserver(() => configState.logButtonTitle);
  const hasMultipleContacts = useObserver(() => callsState.callHasMultipleContacts(call));
  const selectedContact = useObserver(() => callsState.callContact(call));

  const [showHelp, setShowHelp] = useState(true);

  useEffect(
    () =>
      onContactSelectedEvent(e => {
        if (call.pbxRoomId !== e.call.pbxRoomId) return;
        setShowHelp(false);
      }),
    [],
  );

  const [holding, setHolding] = useState(call.holding);
  const [muted, setMuted] = useState(call.muted);
  const [recording, setRecording] = useState(call.recording);
  const [answered, setAnswered] = useState(call.answered);
  const [transferNumber, setTransferNumber] = useState(call.transferring);

  const isTransferring = holding && transferNumber.length > 0;

  const displayName = useObserver(() => callsState.displayName(call));

  const [isMin, setIsMin] = useState(false);

  const [transferState, setTransferState] = useState({
    show: false,
    blind: false,
  });

  const open = (blind = false) => setTransferState({ show: true, blind });
  const close = () => setTransferState(prevState => ({ ...prevState, show: false }));
  const transfer = (number: string) => {
    if (transferState.blind) {
      void call.transferBlind(number);
    } else {
      void call.transferAttended(number);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHolding(call.holding);
      setMuted(call.muted);
      setRecording(call.recording);
      setAnswered(call.answered);
      setTransferNumber(call.transferring);
    }, 100);

    return () => clearInterval(interval);
  }, [call]);

  const toggleHold: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    call.toggleHoldWithCheck();
  };

  const toggleMuted: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    call.toggleMuted();
  };

  const toggleRecording: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    void call.toggleRecording();
  };

  const openAttendedTransfer: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    open();
  };

  const openBlindTransfer: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    open(true);
  };

  const openLog: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    logState.open(call);
  };

  const answer: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    call.answer();
    if (!hasMultipleContacts) return;
    fireDuplicateContactCallAnsweredEvent(call, selectedContact);
  };

  const disconnect: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    void call.hangupWithUnhold();
  };

  const stopTransfer: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    void call.stopTransferring();
  };

  const connectTransfer: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    call.rawSession?.rtcSession.terminate();
  };

  const conferenceTransfer: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    void call.conferenceTransferring();
  };

  const preventContactClickPropagation: React.MouseEventHandler = e => {
    if (!hasMultipleContacts) return;
    e.stopPropagation();
  };

  const renderAnswer = () => {
    if (!call.incoming || call.answered) return null;

    return (
      <button className="rounded-full bg-green-400 p-2" onClick={answer} title="Answer">
        <PhoneIcon className="h-4 w-4 text-white" />
      </button>
    );
  };

  const renderDisconnectButton = () => {
    if (isTransferring || holding) return null;

    return (
      <button className="rounded-full bg-red-400 p-2" onClick={disconnect} title="Disconnect">
        <PhoneXMarkIcon className="h-4 w-4 text-white" />
      </button>
    );
  };

  const renderTransferButtons = () => {
    if (!isTransferring) return null;

    return (
      <>
        <button
          className="rounded-full bg-yellow-400 p-2"
          onClick={stopTransfer}
          title="Stop Transfer">
          <PhoneXMarkIcon className="h-4 w-4 text-white" />
        </button>
        <button className="rounded-full bg-red-400 p-2" onClick={connectTransfer} title="Transfer">
          <PhoneIcon className="h-4 w-4 text-white" />
        </button>
        <button
          className="rounded-full bg-green-400 p-2"
          onClick={conferenceTransfer}
          title="Conference Transfer">
          <PhoneIcon className="h-4 w-4 text-white" />
        </button>
      </>
    );
  };

  const renderStatus = () => {
    if (!call.answered)
      return <span className="text-xs">{call.incoming ? 'Incoming...' : 'Calling...'}</span>;

    return (
      <span className="whitespace-nowrap text-xs">
        <Duration milliseconds={call.getDuration} />
        {!isTransferring && call.holding && <span className="ml-2 font-bold">On Hold</span>}
        {isTransferring && <span className="ml-2 font-bold">Transferring to {transferNumber}</span>}
        {call.muted && <span className="ml-2 font-bold">Muted</span>}
      </span>
    );
  };

  const renderInfo = () => {
    return (
      <div className="flex items-center gap-2 p-2">
        <div className="grow">
          <CallContacts call={call} disabled={!hasMultipleContacts}>
            {({ open }) => (
              <div
                onClick={preventContactClickPropagation}
                className={c('font-bold', {
                  'cursor-pointer rounded transition-all hover:bg-app/20 hover:p-1':
                    hasMultipleContacts,
                  'rounded bg-app/20 p-1': open,
                })}>
                {displayName ?? call.getDisplayName()}
                {displayName && (
                  <span className="ml-2 text-xs font-normal">({call.partyNumber})</span>
                )}
                {hasMultipleContacts && showHelp && (
                  <p className="text-[10px] font-normal">Click to select contact</p>
                )}
              </div>
            )}
          </CallContacts>
          {renderStatus()}
        </div>
        {renderAnswer()}
        {renderDisconnectButton()}
        {renderTransferButtons()}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (!call.answered) return null;

    return (
      <div className="flex justify-around gap-2 px-4 pb-1">
        <button onClick={toggleHold} title={holding ? 'unhold' : 'hold'}>
          <img
            className="h-5 w-5"
            src={holding ? PlayIcon : PauseIcon}
            alt={holding ? 'unhold' : 'hold'}
          />
        </button>
        <button className="h-6 w-6" onClick={toggleMuted} title={muted ? 'unmute' : 'mute'}>
          <img
            className="h-5 w-5"
            src={muted ? MicIcon : MicOffIcon}
            alt={muted ? 'unmute' : 'mute'}
          />
        </button>
        {/*<button onClick={toggleRecording}>*/}
        {/*  {recording ? 'stop recording' : 'record'}*/}
        {/*</button>*/}
        <button onClick={openAttendedTransfer} title="Attended transfer">
          <img src={AttendedTransferIcon} alt="attended transfer" />
        </button>
        <button onClick={openBlindTransfer} title="Blind transfer">
          <img className="h-6 w-6" src={BlindTransferIcon} alt="blind transfer" />
        </button>
        {logEnabled && (
          <button onClick={openLog} title={logButtonTitle}>
            <NoteIcon className="h-6 w-6" title={logButtonTitle} />
          </button>
        )}
      </div>
    );
  };

  const renderMinimized = () => {
    return (
      <div
        className="z-40 flex items-center justify-between gap-2 border-b bg-white p-2"
        onClick={() => setIsMin(false)}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="truncate whitespace-nowrap font-bold">
            {displayName ?? call.getDisplayName()}
          </div>
          {renderStatus()}
        </div>
        {renderDisconnectButton()}
      </div>
    );
  };

  if (isMin) {
    return renderMinimized();
  }

  return (
    <>
      <div
        className="border-b bg-white"
        onClick={() => {
          if (!call.answered) return;
          setIsMin(true);
        }}>
        {renderInfo()}
        {renderActionButtons()}
      </div>
      <Keypad
        title={transferState.blind ? 'Blind transfer' : 'Attended transfer'}
        close={close}
        show={transferState.show}
        call={transfer}
      />
    </>
  );
});

export default CallItem;

const callStatus = (call: Call) => {
  if (call.answered) {
    return 'Answered';
  }

  if (call.incoming) {
    return 'Incoming';
  }

  return 'Outgoing';
};
