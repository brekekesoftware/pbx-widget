import { callsState } from '@/state/callsState';
import { useObserver } from 'mobx-react';
import CallItem from './CallItem';

const ActiveCalls = () => {
  const calls = useObserver(() => callsState.activeCalls);

  return (
    <>
      {calls.map(call => (
        <CallItem key={call.id} call={call} />
      ))}
    </>
  );
};

export default ActiveCalls;
