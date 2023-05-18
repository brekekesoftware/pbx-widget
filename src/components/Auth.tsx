import Logo from '@/assets/images/logo.png';
import { pbx } from '@/services/pbx';
import { AuthData } from '@/types/app';
import { FormEventHandler, useState } from 'react';

const Auth = () => {
  const [data, setData] = useState<AuthData>(getSavedData);
  const [shouldSave, setShouldSave] = useState<boolean>(true);

  const updateData = <K extends keyof AuthData>(key: K, value: AuthData[K]) => {
    setData(prevState => ({ ...prevState, [key]: value }));
  };

  const login: FormEventHandler = (e) => {
    e.preventDefault();
    void pbx.connect(data);
    if (!shouldSave) return;
    saveData(data);
  };

  return (
    <>
      <div className='bg-white h-10 flex items-center p-2.5 border-b'>
        <img className='h-5' src={Logo} alt="" />
      </div>
      <form onSubmit={login} className='space-y-2 p-2 pb-6 bg-gray-100/75'>
        <input
          type="text"
          value={data.user}
          placeholder="Username"
          autoComplete='username'
          className='w-full rounded border border-gray-300 p-2 py-1'
          onChange={event => updateData('user', event.target.value)}
        />
        <input
          className='w-full rounded border border-gray-300 p-2 py-1'
          type="password"
          value={data.password}
          placeholder="Password"
          autoComplete='current-password'
          onChange={event => updateData('password', event.target.value)}
        />
        <input
          className='w-full rounded border border-gray-300 p-2 py-1'
          type="text"
          value={data.tenant}
          placeholder="Tenant"
          onChange={event => updateData('tenant', event.target.value)}
        />
        <input
          className='w-full rounded border border-gray-300 p-2 py-1'
          type="text"
          value={data.host}
          placeholder="Host"
          onChange={event => updateData('host', event.target.value)}
        />
        <input
          className='w-full rounded border border-gray-300 p-2 py-1'
          type="text"
          value={data.port}
          placeholder="Port"
          onChange={event => updateData('port', event.target.value)}
        />
        <label className='flex gap-2 items-center'>
          <input type="checkbox" checked={shouldSave} onChange={() => setShouldSave(s => !s)} />
          Remember me
        </label>
        <button type="submit" className='bg-app py-1 rounded font-bold uppercase text-white w-full'>
          Login
        </button>
      </form>
    </>
  );
};

export default Auth;

const saveData = (data: AuthData) => {
  localStorage.setItem('auth', JSON.stringify({ ...data, password: '' }));
};

const getSavedData = (): AuthData => {
  const saved = localStorage.getItem('auth');

  if (saved) {
    return JSON.parse(saved) as AuthData;
  }

  return {
    host: '',
    port: '',
    tenant: '',
    user: '',
    password: '',
  };
};
