import MD5 from 'md5';

window.CryptoJS = window.CryptoJS || { MD5 };

declare global {
  interface Window {
    CryptoJS: {
      MD5: typeof MD5;
    }
  }
}
