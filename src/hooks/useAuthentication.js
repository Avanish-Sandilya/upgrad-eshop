import { createContext, useState } from "react";
import { doLogin } from "../api/userAuthAPIs";

const AuthCtx = createContext();

const useAuthentication = () => {
  const initialState = JSON.parse(localStorage.getItem("ecommerce_upgrad_logged_in_user_details")) || {
    user: null,
    userId: null,
    roles: null,
    accessToken: null,
    accessTokenTimeout: null,
  };

  const [loggedInUser, setLoggedInUser] = useState(initialState.user);
  const [loggedInUserId, setLoggedInUserId] = useState(initialState.userId);
  const [roles, setRoles] = useState(initialState.roles);
  const [accessToken, setAccessToken] = useState(initialState.accessToken);
  const [accessTokenTimeout, setAccessTokenTimeout] = useState(initialState.accessTokenTimeout);
  const [loginError, setLoginError] = useState(null);

  const persistInCache = (json) => {
    localStorage.setItem("ecommerce_upgrad_logged_in_user_details", JSON.stringify(json));
  };

  const clearCache = () => {
    localStorage.removeItem("ecommerce_upgrad_logged_in_user_details");
  };

  const login = async (email, password) => {
    try {
      const json = await doLogin(email, password);
      setLoggedInUser(json.username);
      setLoggedInUserId(json.userId);
      setRoles(json.roles);
      setAccessToken(json.accessToken);
      setAccessTokenTimeout(json.accessTokenTimeout);
      setLoginError(null);
      persistInCache(json);
      return json;
    } catch (error) {
      setLoggedInUser(null);
      setLoggedInUserId(null);
      setRoles(null);
      setAccessToken(null);
      setAccessTokenTimeout(null);
      setLoginError(error.reason);
      throw error;
    }
  };

  const logout = () => {
    setLoggedInUser(null);
    setLoggedInUserId(null);
    setRoles(null);
    setAccessToken(null);
    setAccessTokenTimeout(null);
    setLoginError(null);
    clearCache();
  };

  const hasRole = (roleArray) => {
    if (!roleArray) {
      return true;
    }
    return roles && roleArray.some(role => roles.includes(role));
  };

  const isAccessTokenValid = () => {
    return !(accessTokenTimeout && accessTokenTimeout < Date.now());
  };

  const AuthProvider = ({ children }) => (
    <AuthCtx.Provider
      value={{
        loginError,
        loggedInUser,
        loggedInUserId,
        accessToken,
        accessTokenTimeout,
        roles,
        login,
        logout,
        hasRole,
        isAccessTokenValid
      }}
    >
      {children}
    </AuthCtx.Provider>
  );

  return { AuthCtx, AuthProvider };
};

export default useAuthentication;
