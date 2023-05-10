import { Account } from '@/types/phone';
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

  login = (account: Account) => {
    this.account = account;
  }

  logout = () => {
    this.account = undefined;
  }
}

export const authState = new AuthState();
