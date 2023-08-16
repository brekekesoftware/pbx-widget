import { ReactComponent as NoteIcon } from '@/assets/icons/note.svg';
import { ReactComponent as NoteSubmittedIcon } from '@/assets/icons/note-submitted.svg';
import CallContacts from '@/components/CallContacts';
import Duration from '@/components/Duration';
import { pbx } from '@/services/pbx';
import { callsState } from '@/state/callsState';
import { configState } from '@/state/configState';
import { logState } from '@/state/logState';
import { Call } from '@/types/phone';
import { c } from '@/utils/html-class';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { useObserver } from 'mobx-react';
import { FC } from 'react';

const CallLog = () => {
  const calls = useObserver(() => callsState.inactiveCalls);

  return (
    <div className='overflow-auto mb-12'>
      <p className='p-2 font-bold text-sm border-b sticky top-0 bg-gray-100'>
        Calls ({calls.length})
      </p>
      <div className='divide-y'>
        {calls.map(call => <EndedCall call={call} key={call.pbxRoomId} />)}
      </div>
    </div>
  );
}

interface EndedCallProps {
  call: Call;
}

const EndedCall: FC<EndedCallProps> = ({ call }) => {
  const logEnabled = useObserver(() => configState.logEnabled);
  const logButtonTitle = useObserver(() => configState.logButtonTitle);

  const displayName = useObserver(() => callsState.displayName(call));
  const hasMultipleContacts = useObserver(() => callsState.callHasMultipleContacts(call));
  const saved = useObserver(() => logState.callLogSaved(call));

  const renderDuration = (call: Call) => {
    if (!call.answered) return null;

    return (
      <span className="ml-2">
        <Duration getDuration={() => callsState.endedCallDuration(call)} stop={true} />
      </span>
    );
  }

  const renderLogIcon = () => {
    if (saved) {
      return <NoteSubmittedIcon className='h-5 w-5 fill-green-400' />;
    }

    return <NoteIcon className='h-5 w-5' title={logButtonTitle} />;
  };

  return (
    <div className='bg-white p-1.5 flex justify-between'>
      <div className='truncate mr-1.5'>
        <CallContacts call={call} disabled={!hasMultipleContacts || saved}>
          {({ open }) => (
            <div className={c('font-bold flex items-center text-sm truncate', { 'transition-all cursor-pointer rounded hover:bg-app/20 hover:p-1': hasMultipleContacts && !saved, 'rounded bg-app/20 p-1': open })}>
              <p className='truncate'>{displayName ?? call.getDisplayName()}</p>
              {displayName && <span className='font-normal text-xs ml-2 shrink-0'>({call.partyNumber})</span>}
            </div>
          )}
        </CallContacts>
        <span className="text-xs">{callStatus(call)}</span>
        {renderDuration(call)}
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <button className='h-6 w-6 p-1 rounded-full' onClick={() => pbx.call(call.partyNumber)} title='Dial'>
          <PhoneIcon className='fill-green-400 h-4 w-4' />
        </button>
        {logEnabled && (
          <button onClick={() => logState.open(call)} title={logButtonTitle}>
            {renderLogIcon()}
          </button>
        )}
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
