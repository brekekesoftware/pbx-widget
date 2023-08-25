import { callsState } from '@/state/callsState';
import { id } from '@/utils/call';
import { useObserver } from 'mobx-react';
import CallItem from './CallItem';

const ActiveCalls = () => {
  const calls = useObserver(() => callsState.activeCalls);

  return (
    <>
      {calls.map(call => (
        <CallItem key={id(call)} call={call} />
      ))}
    </>
  );
};

export default ActiveCalls;
