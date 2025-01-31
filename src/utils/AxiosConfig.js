import axios from 'axios';
import { clearLocalDataOfUserLogins } from './Utilities';
import { APP_CONSTANTS } from '../URLConstants'
import { encryptStorage } from '../CustomStorage';



const ApiCallerInstance = axios.create({
    // .. where we make our configurations
    baseURL: process.env.REACT_APP_API_URL,
});


ApiCallerInstance.defaults.headers.common['Content-Type'] = 'application/json';
// ApiCallerInstance.defaults.withCredentials = true

// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === "sandbox")
//     ApiCallerInstance.defaults.headers.common['developer-token'] = "768BE6FC-3A53-4CB7-8382-0A96CB883E85-1447F685-18BB-43CD-91ED-E4F843F09F37";;



ApiCallerInstance.interceptors.request.use(request => {
// request.headers["ngrok-skip-browser-warning"] = "69420"
if(encryptStorage.getItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN)!==null && encryptStorage.getItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN)!==undefined)
    request.headers.Authorization= `Bearer ${encryptStorage.getItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN)}`

    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

ApiCallerInstance.interceptors.response.use(response => {
    console.log(response);
    return response;
}, error => {
    console.log(error);
    if (error?.response?.status === 401)
        clearLocalDataOfUserLogins();

    return Promise.reject(error);
});

export default ApiCallerInstance;