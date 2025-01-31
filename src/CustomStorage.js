import { EncryptStorage } from 'encrypt-storage';


const options={
    storageType:localStorage 
}

export const encryptStorage = new EncryptStorage(process.env.REACT_APP_SECRET, {
    prefix: '@instance1',
  });

  export function setItemInL(key,value){
    encryptStorage.setItem(key, value)
  }
  
  export function getItemFL(key){
    encryptStorage.getItem(key)
  }
