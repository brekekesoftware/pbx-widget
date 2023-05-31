import { Account } from '@/types/phone';
import { fireLoggedInEvent, fireLoggedOutEvent } from '@/utils/events/triggers';
import { action, computed, makeObservable, observable } from 'mobx';

export class AuthState {
  account?: Account;

  get loggedIn() {
    return this.account !== undefined;
  }

  constructor() {
    makeObservable(this, {
      account: observable,
      loggedIn: computed,
      login: action,
      logout: action,
    });
  }

  login = (account: Account, callback: VoidFunction) => {
    if (this.loggedIn) return;
    this.account = account;
    fireLoggedInEvent();
    callback();
  }

  logout = () => {
    this.account = undefined;
    fireLoggedOutEvent();
  }
}

export const authState = new AuthState();
