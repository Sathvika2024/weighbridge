import ApiCallerInstance from './AxiosConfig';
import {encryptStorage} from '../CustomStorage';

import { API_ENDPOINTS,APP_CONSTANTS } from '../URLConstants';



export function toLowerCase(str){
    if(str!==undefined && str!==null)
return str.toLowerCase();
}

export function awsRekoPPeBodyTypes(bodyParts){
    if(bodyParts!==null && bodyParts!==undefined){
        switch(bodyParts.toUpperCase()){
            case "LEFT_HAND": return "Left Hand"
            case "RIGHT_HAND": return "Right Hand"
            case "HEAD": return "Head"
            case "FACE": return "Face"
            case "FACE_COVER": return "Face Cover"
            case "HEAD_COVER": return "Head Cover"
            case "HAND_COVER": return "Hand Cover"
            default : return bodyParts
        }
    }
    
}




export function Signout(){

   // const navigate=useNavigate()

   console.log("calling","signout_api")

   ApiCallerInstance({
    method: 'put',
    url: API_ENDPOINTS.ADMIN_SIGNOUT,
    
  }).then(res => {

    clearLocalDataOfUserLogins()

   // navigate('/login', { replace: true });

  }).catch(err => {
    console.log("failed",err);

  });
}

export function clearLocalDataOfUserLogins(){

  encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, false);
  encryptStorage.removeItem(APP_CONSTANTS.L_KEY_OF_USER_DATA);
  encryptStorage.removeItem(APP_CONSTANTS.L_KEY_OF_USER_IOT_CLIENT_ID);
  encryptStorage.removeItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN);


  // window.location.reload();

}

export function clearLoginSession(){

  encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, false);
  encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN, null);
  encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, null);

}




/* eslint-disable */
export function parseJwt (token) {
  if(token!==undefined && token!==null){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

  return null
  
}

/* eslint-enable */

export  function  isValidURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

export function replaceClientId(topic,replaceWith){
  return topic.replace("<client_id>",encryptStorage.getItem(APP_CONSTANTS.L_KEY_OF_USER_IOT_CLIENT_ID))
}

export function getRandomColorVariant(){

  const colorVariants = ["primary", "secondary",
  "error", "danger"];

  return colorVariants[Math.floor(Math.random() * colorVariants.length)];
}


export function showFieldValueWithCheck(value){
   return value !==undefined && value!=="" && value !==null ? value :"---"
}




export function showTextOnUIwithDash(value) {

  if(value==='' || value===undefined || value===null || value==='Null' || value==='null' || value==='Not Available')
    return '---'

    return value
}

  

export function getIdTextWidthDots(idStr){

  // if (idStr === null || idStr === undefined)
  // return ''

  //   return idStr.substring(idStr.length-5,idStr.length)

  if (idStr === null || idStr === undefined || idStr==='' )
  return ''

if (idStr.length > 5) {
  const lastFiveChars = idStr.slice(-5);
  return 'X'.repeat(idStr.length/3) + lastFiveChars;
}

return idStr

}

export function crossMarkString(inputString) {

  if (inputString === null || inputString === undefined)
    return ''

  if (inputString.length > 6) {
    const lastFiveChars = inputString.slice(-6);
    return 'X'.repeat(5) + lastFiveChars;
  }

  return inputString

};

export function crossMarkDeviceIdString(inputString) {

  if (inputString === null || inputString === undefined)
    return ''

  if (inputString.length > 4) {
    const lastFiveChars = inputString.slice(-4);
    return 'X'.repeat(3) + lastFiveChars;
  }

  return inputString

};

export function parseValidationErrorMessage(error){


  if( error?.response?.data!==undefined && error?.response?.data!==null && Object?.keys(error?.response?.data)?.length>0){
    if(error?.response)
    if('validationErrors' in error?.response?.data)
    if("message" in error?.response?.data?.validationErrors)
      return error?.response?.data?.validationErrors?.message
      else if("errors" in error?.response?.data?.validationErrors)
      return error?.response?.data?.validationErrors?.errors
      else if("error" in error?.response?.data?.validationErrors)
      return error?.response?.data?.validationErrors?.error
    
  
  if("message" in error?.response?.data)
    return error?.response?.data?.message
}

return "Bad Request"
    
}

// this is temporary solution , this should be removed as an when the server start handling this
export function getOrgnizationIdentifierBasedonOrgId(orgId){
    switch(orgId){
      case "dcaf2f5c-f829-402e-9051-17357ce03881"  : return "BOB"
      case "8169938d-b4a9-4db5-8d82-1c9fa719e446" : return "BOI"
      case "71ddc111-dc94-41c4-b379-1cbc71f9c76e" : return "MAXIMUS"
      case "3e3656e6-2be0-466b-a76b-87555e68c5ab" : return "GOOGLE_PAY"
      case "a2ecfe05-f4d0-4851-8992-564993132a57" : return "SWINK_PAY"
      case "fb7b1e7a-a300-4c72-bd4e-4402a6697938" : return "AIRTEL"
      case "e97ae200-2c56-4624-932d-c38b8b109083" : return "VODAFONE"
      case "49f0be80-3957-4930-8a18-307c803f7b45" : return "NEPAL"
      default : return "d7f6e9af-7b4d-46fc-89c0-b4e8d21e8e74"
    }
}

export function parseECOMErrorMessage(error){
  if( error!==undefined && error!==null && Object?.keys(error)?.length>0)
  if(error?.response)
  if('response' in error?.response?.data)
    if('description' in error?.response?.data?.response)
      return error?.response?.data?.response?.description
      

      return "Bad Request"
    
}

export function capitalizeFirstLetter(str){
  
  if(str!==undefined && str!==null && str!=='')
  return str.charAt(0).toUpperCase() + str.slice(1);

  return str

}


export function CapitializeText(str){
  
  if(str!==undefined && str!==null && str!=='')
  return str.toUpperCase()

  return str

}

export function getUserAciveInactiveBasedColor(status){

  if(status===null || status===undefined || status==='')
    return "info"

  switch(status.toLowerCase()){
    case "active":{
      return "info"
    }
    case "inactive":{
      return "error"
    }
    default:{
      return "info"
    }
  }
}




export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value?.toString(16)}`?.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name?.split(' ')[0][0]}${name?.split(' ')?.[1]?.[0]}`,
  };
}

export const   isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;


export function getDialogBgColorByType(type){
  switch(type){
    case "SUCCESS":return "#A2E1AC"
    case "FAILURE":return "#E1A2A2"
    case "WARNING":return "#F4DA97"
    default : return "#171D40"
  }
}

export function getColorByDeliveryStatus(status, isRtoOn) {
  if (status === null || status === undefined || status === '') {
    return "info";
  }

  const statusList = !isRtoOn 
    ? APP_CONSTANTS?.DISPATCH_APP_DELIVERY_STATUS 
    : APP_CONSTANTS?.DISPATCH_APP_RTO_STATUS;

  const foundStatus = statusList?.find((s) => s?.status === status);
  return foundStatus ? foundStatus?.color : "#dddddd";
}


export function getDeliveryPackageStatusLabel(status){

  if(status===undefined || status===null  || status==="")
    return "NA"


  switch(status?.toUpperCase()){
    case "PACKED":return "PACKED"
    case "MANIFESTED":return "PICKUP SCHEDULED"
    case "INTRANSIT":return "IN TRANSIT"
    case "DELIVERED":return "DELIVERED"
    default : return status
  }
}

export function removeEndingDot(str) {
  // Check if the string ends with a dot
  if (str.endsWith('.')) {
    // Remove the ending dot
    return str.slice(0, -1);
  }
  // Return the original string if it doesn't end with a dot
  return str;
}

export function getBgColorUsingUserRole(role){

  switch(role){
    case "admin":return "#0080BF"
    case "maker":return "#55D0FF"
    case "checker":return "#CCF9FF"
    default: return "info"
  }

}

export function getTextColorUsingUserRole(role){

  switch(role){
    case "checker":return "#000000"
    default: return "#FFF"
  }

}

export function  parseDeviceDetails(data) {
  const parsedData=  {
      deviceId: data?.device_id || data?.id || null,          // Check for `device_id` in BOB and `id` in BOI
      imei: data?.imei || null,                             // Check for `imei` in both structures
      status: data?.status || null,                         // Check for `status` in both structures
      organizationId: data?.organizationId || null,         // Check for `organizationId` in both structures
      createdAt: data?.createdAt || null,                   // Check for `createdAt` in both structures
      updatedAt: data?.updatedAt || null,                   // Check for `updatedAt` in both structures
      deviceType: data?.type || null ,
      isCwdDevice:data?.iscwdDevice || null,
      CSQ: data?.csQ || data?.CSQ || null,
      charger: data?.CHARGER || data?.charger || null

  };


  return parsedData
}

export function parseMerchantData(data) {
  let parsedData={
  }

  if(data!==undefined && data!==null){


   parsedData = {
    id: data?.id || null,
    key: data?.key || data?.mid || null,
    organizationId: data?.organizationId || null,
    name: data?.name || null,
    phone: data?.phone || null,
    branch: data?.branch || (data?.merchantbranch ? data?.merchantbranch.zone : null), // Fallback for BOB schema
    region: data?.region || (data?.merchantbranch ? data?.merchantbranch.region : null), // Fallback for BOB schema
    address: data?.address || null,
    state: data?.state || null,
    city: data?.city || null,
    pincode: data?.pincode || null,
    image: data?.image || null,
    activated: data?.activated || false,
    qrString: data?.qrString || data?.qr_string || null, // Handle different field names
    vpa: data?.vpa || data?.merchant_upi_id || null, // Handle different field names
    deviceId: data?.deviceId || data?.device_id || null, // Handle different field names
    role: data?.role || null,
    details: {
        nbg: (data?.details && data?.details.nbg) || null, // Handle details for BOI schema
        uniqueRef: (data?.details && data?.details.uniqueRef) || data?.unique_ref || data?.self_unique_ref || null // Handle unique_ref in both schemas
    },
    createdAt: data?.createdAt || null,
    updatedAt: data?.updatedAt || null,
    merchantbranch: {
        region: data?.merchantbranch ? data?.merchantbranch.region : null, // Handle merchantbranch for BOB schema
        zone: data?.merchantbranch ? data?.merchantbranch.zone : null // Handle merchantbranch for BOB schema
    }
};
}

  return parsedData;
}


// export function getBatteryPerceByVBAT(VBAT) {
//   if (VBAT === null || VBAT === undefined || VBAT === '') {
//     return '---';
//   }

//   const voltage = Math.min(4.15, Math.max(VBAT, 3.4));
//   const percentage = ((voltage - 3.4) * 100) / (4.15 - 3.4);

//   return Math.round(percentage); // Rounded to nearest integer
// }


export function getBatteryPerceByVBAT(VBAT) {
  if (VBAT === null || VBAT === undefined || VBAT === '') {
    return '---';
  }

  const minVoltage = 3.2;
  const maxVoltage = 4.2;
  const voltage = Math.min(maxVoltage, Math.max(VBAT, minVoltage));
  const percentage = ((voltage - minVoltage) * 100) / (maxVoltage - minVoltage);

  return Math.round(percentage); // Rounded to nearest integer
}




export function getMappedOrganizations (organizations = []) {
  const organizationIdentifierMapping = {
    "bob_bank": APP_CONSTANTS?.BOB_ORGANIZATION_IDENTIFIER,
    "maximus": APP_CONSTANTS?.MAXIMUS_ORGANIZATION_IDENTIFIER,
    "proxgy.boi": APP_CONSTANTS?.BOI_ORGANIZATION_IDENTIFIER,
    "airtle_bank": APP_CONSTANTS?.AIRTEL_ORGANIZATION_IDENTIFIER,
    "swink_pay": APP_CONSTANTS?.SWINKPAY_ORGANIZATION_IDENTIFIER,
  };

  return organizations.map((organization) => ({
      ...organization,
      identifier: organizationIdentifierMapping[organization?.slug] || null,
    }))
    .filter((organization) => organization?.identifier !== null); // Only include organizations with valid identifiers
};