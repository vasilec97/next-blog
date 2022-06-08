import React from 'react'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'

export default function UserProvider({ children }) {
  const [user, username] = useUserData()

  return (
    <UserContext.Provider value={{user, username}}>
      {children}
    </UserContext.Provider>
  )
}