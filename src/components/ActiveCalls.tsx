import { callsActiveState } from "@/state/atoms/call";
import { FC } from 'react';
import { useRecoilValue } from "recoil";
import { observer, useObserver } from 'mobx-react';
import CallItem from "./CallItem";
import { CallsState, callsState } from '@/state/callsState';

interface Props {
  state: CallsState;
}

const ActiveCalls: FC<Props> = observer(({ state }) => {
  // const calls = useRecoilValue(callsActiveState);
  // const calls = useObserver(() => callsState.activeCalls);

  return (
    <>
      {state.activeCalls.map(call => <CallItem key={call.id} call={call} />)}
    </>
  );
});

export default ActiveCalls;
