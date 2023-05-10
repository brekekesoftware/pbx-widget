import { Call } from '@/types/phone';
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { autorun } from 'mobx';
import { observer, useObserver } from 'mobx-react';
import { FC, useEffect, useState } from 'react';
import Duration from './Duration';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setHolding(call.holding);
      setMuted(call.muted);
      setRecording(call.recording);
      setAnswered(call.answered);
    }, 100);

    return () => clearInterval(interval);
  }, [call]);

  useEffect(() => {
    return autorun(() => {
      console.log('autorun', `call ${call.id} updated`);
    });
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
        <button className='bg-green-400 p-2 rounded-full' onClick={() => call.answer()}>
          <PhoneIcon className='text-white h-4 w-4' />
        </button>
      );
    }

    const renderStatus = () => {
      if (!call.answered) return (
        <span className='text-xs'>
          {call.incoming ? 'Incoming...' : 'Calling...'}
        </span>
      );

      return <Duration getDuration={call.getDuration} />;
    }

    return (
      <div className='flex gap-2 p-2 items-center'>
        <div className='grow'>
          <div className='font-bold'>{call.getDisplayName()}</div>
          {renderStatus()}
        </div>
        {renderAnswer()}
        <button className='bg-red-400 p-2 rounded-full' onClick={() => call.hangupWithUnhold()}>
          <PhoneXMarkIcon className='text-white h-4 w-4' />
        </button>
      </div>
    );
  };

  const renderActionButtons = () => {
    if (!call.answered) return null;

    return (
      <div className="flex gap-2 justify-around">
        <button onClick={() => call.toggleHoldWithCheck()}>
          {call.holding ? 'unhold' : 'hold'}
        </button>
        <button onClick={() => call.toggleMuted()}>
          {call.muted ? 'unmute' : 'mute'}
        </button>
        <button
          onClick={() => call.toggleRecording()}>
          {call.recording ? 'stop recording' : 'record'}
        </button>
      </div>
    );
  };

  // return renderInfo();

  return (
    <div className='z-50 bg-white border-b'>
      {renderInfo()}
      {renderActionButtons()}
    </div>
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
