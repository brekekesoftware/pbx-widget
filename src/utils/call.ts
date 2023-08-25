import { Call } from '@/types/phone';

export const id = (call: Call) => `${call.id}-${call.pbxRoomId}`;
