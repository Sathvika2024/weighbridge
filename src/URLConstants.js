
const API_HOST=process.env.REACT_APP_API_URL;
const API_BASE="/api"
const VERSION_V1="/v1"

const V1ENDPOINT=API_HOST.concat(API_BASE);



export const API_ENDPOINTS={
    'SEND_PHOTO':V1ENDPOINT.concat('/v1/anpr'),
    "ADMIN_SIGN_IN": V1ENDPOINT.concat('/v1/auth/admin/email/login/'),
    "ADMIN_SIGN_OUT": V1ENDPOINT.concat('/v1/auth/logout'),
    "SIGNED_URL":V1ENDPOINT.concat('/v1/mqtt/trigger/'),
    "ADD_VEHICLE":V1ENDPOINT.concat('/v1/vehicles')

}


export const APP_CONSTANTS={
    L_KEY_OF_USER_DATA : "puad",
    L_KEY_OF_USER_IOT_CLIENT_ID : "padiotc",
    L_KEY_OF_USER_LOGGEDIN_STATUS : "isLoggedin",
    L_KEY_OF_USER_ADMIN_SSOTOKEN : "sso-token",
    L_KEY_OF_USER_ADMIN_COGNIO_CRED : "cgntCred",
    MQTT_BROKER_URL: 'ws://192.168.1.17:9002/mqtt',
    PORT_NUMBER: '1883'

}
