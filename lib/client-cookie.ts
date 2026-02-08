"use client"

import Cookies from "js-cookie"

export const storeCookie = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes
) => {
  Cookies.set(key, value, {
    expires: 1,
    secure: true,
    sameSite: "strict",
    ...options,
  })
}

export const getCookie = (key: string) => {
  return Cookies.get(key)
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}
