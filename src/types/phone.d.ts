import { Pbx, Session, SessionStatus } from '@/types/brekekejs';

interface PhoneEvents {
  pal: [pal: Pbx];
  call: [call: Call];
  call_update: [call: Call];
  call_end: [call: Call];
  webrtcclient: [any];
}

type PhoneEventNames = keyof PhoneEvents;

type PhoneEventCallback<Key extends PhoneEventNames> = (...params: PhoneEvents[Key]) => void;

interface Phone {
  on: <Key extends PhoneEventNames>(event: Key, callback: PhoneEventCallback<Key>) => void;
  call: (number: string, options?: object, videoEnabled?: boolean, videoOptions?: object, exInfo?: object) => void;
  getRunningCalls: () => Call[];
  getCurrentAccount: () => Account;
  promptBrowserPermission: () => void;
  cleanup: () => void;
}

interface Call {
  rawSession?: Session;
  sessionStatus: SessionStatus;
  id: string;
  pnId: string;
  partyNumber: string;
  partyImageUrl: string;
  partyImageSize: string;
  talkingImageUrl: string;
  // partyName: string;
  pbxTalkerId: string;
  pbxTenant: string;
  isFrontCamera: boolean;

  getDisplayName: () => string;

  createdAt: number;
  incoming: boolean;
  answered: boolean;
  answeredAt: number;

  getDuration: () => number;

  callkeepUuid: string;
  callkeepAlreadyAnswered: boolean;
  callkeepAlreadyRejected: boolean;

  answer: (options?: { ignoreNav?: boolean; }, videoOptions?: object, exInfo?: object) => void;

  hangupWithUnhold: () => Promise<void>;

  videoSessionId: string;
  localVideoEnabled: boolean;
  remoteVideoEnabled: boolean;

  toggleVideo: () => void;
  toggleSwitchCamera: () => void;
  muted: boolean;
  toggleMuted: () => void | undefined;

  recording: boolean;
  updateRecordingStatus: (status: boolean) => void;
  toggleRecording: () => Promise<void>

  holding: boolean;
  toggleHoldWithCheck: () => void;

  transferring: string;
  transferBlind: (number: string) => Promise<boolean | void>;
  transferAttended: (number: string) => Promise<boolean | void>;
  stopTransferring: () => Promise<boolean | void>;
  conferenceTransferring: () => Promise<boolean | void>;

  park: (number: string) => Promise<boolean | void>;
}

type Account = {
  id: string
  pbxHostname: string
  pbxPort: string
  pbxTenant: string
  pbxUsername: string
  pbxPassword: string
  pbxPhoneIndex: string // '' | '1' | '2' | '3' | '4'
  pbxTurnEnabled: boolean
  pbxLocalAllUsers?: boolean
  pushNotificationEnabled: boolean
  pushNotificationEnabledSynced?: boolean
  parks?: string[]
  parkNames?: string[]
  ucEnabled: boolean
  displayOfflineUsers?: boolean
  navIndex: number
  navSubMenus: string[]
}
