// @ts-ignore
import ls from 'store'
const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return ls.get(TokenKey)
}

export function setToken(token:string) {
  // return Cookies.set(TokenKey, token)
  return ls.set(TokenKey, token, 7 * 24 * 60 * 60 * 1000)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return ls.remove (TokenKey)
}
