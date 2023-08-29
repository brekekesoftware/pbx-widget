import { ReactComponent as NoteIcon } from '@/assets/icons/note.svg';
import { ReactComponent as NoteSubmittedIcon } from '@/assets/icons/note-submitted.svg';
import CallContacts from '@/components/CallContacts';
import Duration from '@/components/Duration';
import { pbx } from '@/services/pbx';
import { callsState } from '@/state/callsState';
import { configState } from '@/state/configState';
import { logState } from '@/state/logState';
import { Call } from '@/types/phone';
import { id } from '@/utils/call';
import { c } from '@/utils/html-class';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { useObserver } from 'mobx-react';
import { FC } from 'react';

const CallLog = () => {
  const calls = useObserver(() => callsState.inactiveCalls);

  return (
    <div className="mb-12 overflow-auto">
      <p className="sticky top-0 border-b bg-gray-100 p-2 text-sm font-bold">
        Calls ({calls.length})
      </p>
      <div className="divide-y" key={calls.length}>
        {calls.map(call => (
          <EndedCall call={call} key={id(call)} />
        ))}
      </div>
    </div>
  );
};

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
    const duration = callsState.endedCallDuration(call);

    return (
      <span className="ml-2">
        <Duration milliseconds={duration} stop={true} key={id(call)} />
      </span>
    );
  };

  const renderLogIcon = () => {
    if (saved) {
      return <NoteSubmittedIcon className="h-6 w-6 fill-green-400" />;
    }

    return <NoteIcon className="h-6 w-6" title={logButtonTitle} />;
  };

  return (
    <div className="flex justify-between bg-white p-1.5">
      <div className="mr-1.5 truncate">
        <CallContacts call={call} disabled={!hasMultipleContacts || saved}>
          {({ open }) => (
            <div
              className={c('flex items-center truncate text-sm font-bold', {
                'cursor-pointer rounded transition-all hover:bg-app/20 hover:p-1':
                  hasMultipleContacts && !saved,
                'rounded bg-app/20 p-1': open,
              })}>
              <p className="truncate">{displayName ?? call.getDisplayName()}</p>
              {displayName && (
                <span className="ml-2 shrink-0 text-xs font-normal">({call.partyNumber})</span>
              )}
            </div>
          )}
        </CallContacts>
        <span className="text-xs">{callStatus(call)}</span>
        {renderDuration(call)}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <button
          className="h-6 w-6 rounded-full p-1"
          onClick={() => pbx.call(call.partyNumber)}
          title="Dial">
          <PhoneIcon className="h-4 w-4 fill-green-400" />
        </button>
        {logEnabled && (
          <button onClick={() => logState.open(call)} title={logButtonTitle}>
            {renderLogIcon()}
          </button>
        )}
      </div>
    </div>
  );
};

export default CallLog;

const callStatus = (call: Call) => {
  if (!call.incoming) {
    return 'Outgoing';
  }

  if (call.answered) {
    return 'Incoming';
  }

  return 'Missed';
};
