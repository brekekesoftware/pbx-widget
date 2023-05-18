import Auth from '@/components/Auth';
import Main from '@/components/Main';
import { authState } from '@/state/authState';
import '@/widget.css';
import { configure } from 'mobx';
import { useObserver } from 'mobx-react';
import { RecoilRoot } from 'recoil';

configure({ isolateGlobalState: true });

const Widget = () => {
  const loggedIn = useObserver(() => authState.loggedIn);

  const renderView = () => {
    if (!loggedIn) {
      return <Auth />;
    }

    return <Main />;
  }

  return (
    <RecoilRoot>
      <div className='w-widget border rounded shadow m-2'>
        <div id="webphone_embed" style={{ display: 'none' }} />
        {renderView()}
      </div>
    </RecoilRoot>
  );
};

export default Widget;
