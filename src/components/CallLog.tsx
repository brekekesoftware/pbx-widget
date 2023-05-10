import Duration from '@/components/Duration';
import { callsState } from '@/state/callsState';
import { Call } from '@/types/phone';
import { useObserver } from 'mobx-react';

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
    return (
      <div key={call.id} className='bg-white p-1.5'>
        <p className='font-bold text-sm'>{call.getDisplayName()}</p>
        <span className='text-xs'>
          {callStatus(call)}
        </span>
        {renderDuration(call)}
      </div>
    );
  }

  return (
    <div className='overflow-auto'>
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
