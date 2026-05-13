const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.VITE_ENCRYPTION_KEY || 'contentflow-default-key-32-chars-long-!!!';

const decrypt = (cipherText) => {
  if (!cipherText) return '';
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { decrypt };
