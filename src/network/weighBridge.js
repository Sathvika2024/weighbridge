

import ApiCallerInstance from "../utils/AxiosConfig";
import { API_ENDPOINTS } from "../URLConstants";

export const SendCapturedPhoto = async(formData)=>{
    const response = await ApiCallerInstance.post(
        API_ENDPOINTS?.SEND_PHOTO,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
    return response;
}
export const triggerCamera = async (deviceId) => {
      const response = await ApiCallerInstance.post(
        `${API_ENDPOINTS?.SIGNED_URL}${deviceId}`, // Add the deviceId to the URL
        {}, // Assuming no body is needed for the request
      );
      return response; // Return the response if successful
  };

 
export const addVehicle = async(organizationId, numberPlate, type, driverName, driverImage, drivingLicenseNumber)=> {
    const response = await ApiCallerInstance.post(API_ENDPOINTS?.ADD_VEHICLE, {
        'organizationId': organizationId,
        'numberPlate': numberPlate,
        'type': type,
        'driverName': driverName,
        'driverImage': driverImage,
        'drivingLicenseNumber': drivingLicenseNumber        
    })
    return response;
}



