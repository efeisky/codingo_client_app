import CryptoJS from 'crypto-js'
export const decrypt = (cipherText,key) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}