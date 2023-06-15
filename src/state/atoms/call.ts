import { Call } from "@/types/phone";
import { atom, selector, selectorFamily } from "recoil";

export const callsRecordState = atom<Record<string, Call>>({
  key: "callsRecord",
  default: {},
});

export const callsEndedArrayState = atom<string[]>({
  key: "callsEndedArray",
  default: [],
});

export const callEndedState = selectorFamily({
  key: "callEnded",
  get: (id: string) => ({ get }) => {
    const callsEnded = get(callsEndedArrayState);
    return callsEnded.includes(id);
  }
});

export const callsState = selector({
  key: "calls",
  get: ({ get }) => {
    const callRecord = get(callsRecordState);
    return Object.values(callRecord).sort((a, b) => a.createdAt - b.createdAt);
  }
});

export const callsActiveState = selector({
  key: "callsActive",
  get: ({ get }) => {
    const calls = get(callsState);
    const callsEnded = get(callsEndedArrayState);
    return calls.filter((call) => !callsEnded.includes(call.id));
  }
});

export const callsEndedState = selector({
  key: "callsEnded",
  get: ({ get }) => {
    const calls = get(callsState);
    const callsEnded = get(callsEndedArrayState);
    return calls.filter((call) => callsEnded.includes(call.id));
  }
});

export const callsCountState = selector({
  key: "callsCount",
  get: ({ get }) => {
    const calls = get(callsState);
    return calls.length;
  }
});
