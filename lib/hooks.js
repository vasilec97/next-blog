import { useAuthState } from "react-firebase-hooks/auth"
import { useState, useEffect, useRef, useCallback } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { auth, firestore } from './firebase' 

export const useUserData = () => {
  const [user, userLoading] = useAuthState(auth)
  const [username, setUsername] = useState(null)
  const [usernameLoading, setUsernameLoading] = useState(false)

  useEffect(() => {
    let unsubscribe

    if (user) {
      setUsernameLoading(true)
      unsubscribe = onSnapshot(
        doc(firestore, 'users', user.uid),
        doc => {
          setUsername(doc.data()?.username)
          setUsernameLoading(false)
        }
      )
    } else {
      setUsername(null)
    }
    
    return unsubscribe
  }, [user])

  return [user, username, userLoading, usernameLoading]
}

export const useDebounce = (cb, delay) => {
  const timer = useRef(null)

  const debouncedCb = useCallback((...args) => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      cb(...args)
    }, delay)
  }, [cb, delay])

  return debouncedCb
}