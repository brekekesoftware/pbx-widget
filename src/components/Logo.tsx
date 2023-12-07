import logo from '@/assets/images/logo.png';
import { configState } from '@/state/configState';
import { useObserver } from 'mobx-react';
import { version } from '../../package.json';

const Logo = () => {
  const build = useObserver(() => configState.version);

  return (
    <div className="flex items-end gap-0.5">
      <img className="h-5" src={logo} alt="brekeke pbx logo" />
      <p className="text-[8px] font-semibold">
        v {version}-{build}
      </p>
    </div>
  );
};

export default Logo;
