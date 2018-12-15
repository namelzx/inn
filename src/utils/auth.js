import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const ToAdminID = 'Admin-ID'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getAdmin() {
  return Cookies.get(ToAdminID)
}

export function setAdmin(token) {
  return Cookies.set(ToAdminID, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
