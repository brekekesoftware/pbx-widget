type Callback<T> = (response: T) => void;
type Listener<T> = (payload: T) => void;

interface CallbackResponse<T> {
  success: boolean;
  returnValue?: T;
  errors?: string[];
}

interface CallbackResponses {
  toggleClickToDial: CallbackResponse<null>;
  runApex: CallbackResponse<{ runApex: string }>;
  saveLog: CallbackResponse<string | null>;
}

interface PayloadTypes {
  onClickToDial: {
    number: number;
    recordId: string;
    recordName: string;
    objectType: string;
    accountId?: string;
    contactId?: string;
    personAccount?: boolean;
    params?: string;
  }
}

interface OpenCTI {
  disableClickToDial: (params: { callback: Callback<CallbackResponses['toggleClickToDial']> }) => void;
  enableClickToDial: (params: { callback: Callback<CallbackResponses['toggleClickToDial']> }) => void;
  onClickToDial: (params: { listener: Listener<PayloadTypes['onClickToDial']> }) => void;
  runApex: (params: {
    apexClass: string;
    methodName: string;
    methodParams: string;
    callback: Callback<CallbackResponses['runApex']>
  }) => void;
  saveLog: (params: {
    value: {};
    callback: Callback<CallbackResponses['saveLog']>
  }) => void;
  screenPop: (params: {
    type: keyof OpenCTI['SCREENPOP_TYPE'];
    params: {}; // TODO
  }) => void;
  SCREENPOP_TYPE: {
    SOBJECT: string;
    URL: string;
    OBJECTHOME: string;
    LIST: string;
    SEARCH: string;
    NEW_RECORD_MODAL: string;
    FLOW: string;
  };
}

interface Salesforce {
  opencti: OpenCTI;
}

export declare global {
  const sforce: Salesforce;
  interface Window {
    sforce: Salesforce;
  }
}
