import Auth from '@/components/Auth';
import Main from '@/components/Main';
import '@/widget.css';
import { authState } from '@/state/authState';
import { configure } from 'mobx';
import { useObserver } from 'mobx-react';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

configure({ isolateGlobalState: true });

const Widget = () => {
  const [_, setLoggedIn] = useState(false);
  const loggedIn = useObserver(() => authState.loggedIn);

  return (
    <RecoilRoot>
      <div className='w-widget border rounded shadow m-2'>
        <div id="webphone_embed" style={{ display: 'none' }} />
        {!loggedIn && <Auth callback={setLoggedIn} />}
        {loggedIn && <Main />}
      </div>
    </RecoilRoot>
  );
};

export default Widget;
