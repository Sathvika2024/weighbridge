import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptStorage } from '../../CustomStorage';
import { APP_CONSTANTS } from '../../URLConstants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [sessionUserData, setSessionUserData] = useState(encryptStorage?.getItem(APP_CONSTANTS?.L_KEY_OF_USER_DATA));
  const [organzationClientId, setOrganzationClientId] = useState('');

  const navigate = useNavigate();
  

  const authenticateSession = (adminData) => {
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, true);
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN, adminData?.token);
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, adminData);
    setSessionUserData(adminData) 

  };
  

  const logoutSession = async () => {
    try {
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, false);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN, null);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, null);
      setSessionUserData(null);
      setOrganzationClientId(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Failed to logout session:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        sessionUserData,
        organzationClientId,
        authenticateSession,
        logoutSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
