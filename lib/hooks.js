import { useAuthState } from "react-firebase-hooks/auth"
import { useState, useEffect, useRef, useCallback } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { auth, firestore } from './firebase' 

export const useUserData = () => {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    let unsubscribe

    if (user) {
      unsubscribe = onSnapshot(
        doc(firestore, 'users', user.uid),
        doc => setUsername(doc.data()?.username)
      )
    } else {
      setUsername(null)
    }
    
    return unsubscribe
  }, [user])

  return [user, username]
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