import Auth from '@/components/Auth';
import Main from '@/components/Main';
import { authState } from '@/state/authState';
import '@/widget.css';
import { isDev, isProd } from '@/utils/app';
import { c } from '@/utils/html-class';
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
      <div className={c('relative flex flex-col bg-gray-100/75', {'h-screen': isProd()}, {'w-[400px] h-[500px] border rounded shadow m-2': isDev()})}>
        <div id="webphone_embed" style={{ display: 'none' }} />
        {renderView()}
      </div>
    </RecoilRoot>
  );
};

export default Widget;
