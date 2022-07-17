import React from 'react'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'

export default function UserProvider({ children }) {
  const [user, username, userLoading, usernameLoading] = useUserData()

  return (
    <UserContext.Provider value={{user, username, userLoading, usernameLoading}}>
      {children}
    </UserContext.Provider>
  )
}