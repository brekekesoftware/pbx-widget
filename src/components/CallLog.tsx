import Duration from '@/components/Duration';
import { logState } from '@/state/atoms/logState';
import { callsState } from '@/state/callsState';
import { Call } from '@/types/phone';
import { useObserver } from 'mobx-react';
import NoteIcon from '@/assets/icons/note.svg';

const CallLog = () => {
  const calls = useObserver(() => callsState.inactiveCalls);

  const renderDuration = (call: Call) => {
    if (!call.answered) return null;

    const endedAt = callsState.callsEndedTime[call.id];

    return (
      <span className="ml-2">
        <Duration getDuration={() => endedAt - call.answeredAt} stop={true} />
      </span>
    );
  }

  const renderCall = (call: Call) => {
    const displayName = callsState.displayName(call);

    return (
      <div key={call.id} className='bg-white p-1.5 flex justify-between'>
        <div>
          <p className='font-bold text-sm'>
            {displayName ?? call.getDisplayName()}
            {displayName && <span className='font-normal text-xs ml-2'>({call.partyNumber})</span>}
          </p>
          <span className='text-xs'>
          {callStatus(call)}
        </span>
          {renderDuration(call)}
        </div>
        <button onClick={() => logState.open(call)} title='Note'>
          <img className='h-6 w-6' src={NoteIcon} alt="note" />
        </button>
      </div>
    );
  }

  return (
    <div className='overflow-auto mb-12'>
      <p className='p-2 font-bold text-sm border-b sticky top-0 bg-gray-100'>
        Calls ({calls.length})
      </p>
      <div className='divide-y'>
        {calls.map(renderCall)}
      </div>
    </div>
  );
}

export default CallLog;

const callStatus = (call: Call) => {
  if (!call.incoming) {
    return 'Outgoing';
  }

  if (call.answered) {
    return 'Incoming';
  }

  return 'Missed';
}
