import { callsActiveState } from "@/state/atoms/call";
import { useRecoilValue } from "recoil";
import { useObserver } from 'mobx-react';
import CallItem from "./CallItem";
import { callsState } from "@/state/callsState";

const ActiveCalls = () => {
  // const calls = useRecoilValue(callsActiveState);
  const calls = useObserver(() => callsState.activeCalls);

  return (
    <>
      {calls.map(call => <CallItem key={call.id} call={call} />)}
    </>
  );
};

export default ActiveCalls;
