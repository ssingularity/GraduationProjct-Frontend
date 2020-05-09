const TOKEN = 'token';

export function getToken() {
  return localStorage[TOKEN];
}

export function setToken(token) {
  localStorage[TOKEN] = token;
}

export function removeToken() {
  localStorage[TOKEN] = null;
}

