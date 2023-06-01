import Keypad from '@/components/Keypad';
import { pbx } from '@/services/pbx';
import { logState } from '@/state/atoms/logState';
import { callsState } from '@/state/callsState';
import { Call } from '@/types/phone';
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { autorun } from 'mobx';
import { observer, useObserver } from 'mobx-react';
import { FC, useEffect, useState } from 'react';
import Duration from './Duration';
import AttendedTransferIcon from '@/assets/icons/attended-transfer.svg';
import BlindTransferIcon from '@/assets/icons/blind-transfer.svg';
import MicIcon from '@/assets/icons/mic.svg';
import MicOffIcon from '@/assets/icons/mic-off.svg';
import PauseIcon from '@/assets/icons/pause.svg';
import PlayIcon from '@/assets/icons/play.svg';
import NoteIcon from '@/assets/icons/note.svg';

interface Props {
  call: Call;
}

const CallItem: FC<Props> = observer(({ call }) => {
  // const holding = useObserver(() => call.holding);
  // const muted = useObserver(() => call.muted);
  // const recording = useObserver(() => call.recording);
  // const answered = useObserver(() => call.answered);
  const [holding, setHolding] = useState(call.holding);
  const [muted, setMuted] = useState(call.muted);
  const [recording, setRecording] = useState(call.recording);
  const [answered, setAnswered] = useState(call.answered);
  const [transferNumber, setTransferNumber] = useState(call.transferring);

  const isTransferring = holding && transferNumber.length > 0;

  const displayName = useObserver(() => callsState.displayName(call));

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

  const toggleHold = () => {
    new Promise((resolve) => {
      call.toggleHoldWithCheck();
      setTimeout(resolve, 1000);
    }).then(() => setHolding(call.holding));
  };

  const toggleMuted = () => {
    call.toggleMuted();
    setMuted(() => call.muted)
  };

  const toggleRecording = () => {
    call.toggleRecording().then(() => setRecording(call.recording));
  }

  const answer = () => {
    new Promise((resolve) => {
      call.answer();
      setTimeout(resolve, 1000);
    }).then(() => setAnswered(call.answered));
  }

  const renderInfo = () => {
    const renderAnswer = () => {
      if (!call.incoming || call.answered) return null;

      return (
        <button className='bg-green-400 p-2 rounded-full' onClick={() => call.answer()} title='Answer'>
          <PhoneIcon className='text-white h-4 w-4' />
        </button>
      );
    }

    const renderDisconnectButton = () => {
      if (isTransferring || holding) return null;

      return (
        <button className='bg-red-400 p-2 rounded-full' onClick={call.hangupWithUnhold} title='Disconnect'>
          <PhoneXMarkIcon className='text-white h-4 w-4' />
        </button>
      );
    }

    const renderTransferButtons = () => {
      if (!isTransferring) return null;

      return (
        <>
          <button className='bg-yellow-400 p-2 rounded-full' onClick={call.stopTransferring} title='Stop Transfer'>
            <PhoneXMarkIcon className='text-white h-4 w-4' />
          </button>
          <button className='bg-red-400 p-2 rounded-full' onClick={() => call.rawSession?.rtcSession.terminate()} title='Transfer'>
            <PhoneXMarkIcon className='text-white h-4 w-4' />
          </button>
          <button className='bg-green-400 p-2 rounded-full' onClick={call.conferenceTransferring} title='Conference Transfer'>
            <PhoneXMarkIcon className='text-white h-4 w-4' />
          </button>
        </>
      );
    }

    const renderStatus = () => {
      if (!call.answered) return (
        <span className='text-xs'>
          {call.incoming ? 'Incoming...' : 'Calling...'}
        </span>
      );

      return (
        <span className='text-xs'>
          <Duration getDuration={call.getDuration} />
          {!isTransferring && call.holding && <span className='ml-2 font-bold'>On Hold</span>}
          {isTransferring && <span className='ml-2 font-bold'>Transferring to {transferNumber}</span>}
          {call.muted && <span className='ml-2 font-bold'>Muted</span>}
        </span>
      );
    }

    return (
      <div className='flex gap-2 p-2 items-center'>
        <div className='grow'>
          <div className='font-bold'>
            {displayName ?? call.getDisplayName()}
            {displayName && <span className='ml-2 text-xs font-normal'>({call.partyNumber})</span>}
          </div>
          {renderStatus()}
        </div>
        {renderAnswer()}
        {renderDisconnectButton()}
        {renderTransferButtons()}
      </div>
    );
  };

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
  }

  const renderActionButtons = () => {
    if (!call.answered) return null;

    return (
      <div className="flex gap-2 justify-around px-4 pb-1">
        <button onClick={() => call.toggleHoldWithCheck()} title={holding ? 'unhold' : 'hold'}>
          <img className='h-5 w-5' src={holding ? PlayIcon : PauseIcon} alt={holding ? 'unhold' : 'hold'} />
        </button>
        <button className='h-6 w-6' onClick={() => call.toggleMuted()} title={muted ? 'unmute' : 'mute'}>
          <img className='h-5 w-5' src={muted ? MicIcon : MicOffIcon} alt={muted ? 'unmute' : 'mute'} />
        </button>
        {/*<button onClick={() => call.toggleRecording()}>*/}
        {/*  {recording ? 'stop recording' : 'record'}*/}
        {/*</button>*/}
        <button onClick={() => open()} title='Attended transfer'>
          <img src={AttendedTransferIcon} alt="attended transfer" />
        </button>
        <button onClick={() => open(true)} title='Blind transfer'>
          <img className='h-6 w-6' src={BlindTransferIcon} alt="blind transfer" />
        </button>
        <button onClick={() => logState.open(call)} title='Note'>
          <img className='h-6 w-6' src={NoteIcon} alt="note" />
        </button>
      </div>
    );
  };

  // return renderInfo();

  return (
    <>
      <div className='z-50 bg-white border-b'>
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
}
