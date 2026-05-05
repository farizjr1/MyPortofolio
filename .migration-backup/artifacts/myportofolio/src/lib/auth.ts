import { setAuthTokenGetter } from "@workspace/api-client-react";

export function initAuth() {
  setAuthTokenGetter(() => {
    return localStorage.getItem("auth_token");
  });
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

export function getToken() {
  return localStorage.getItem("auth_token");
}
