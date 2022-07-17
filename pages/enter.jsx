import { useContext, useState, useEffect } from "react"
import { googleAuthProvider, auth, firestore } from "../lib/firebase"
import { useDebounce } from '../lib/hooks'
import { signInWithPopup } from "firebase/auth"
import { doc, getDoc, writeBatch } from 'firebase/firestore'
import { UserContext } from "../lib/context"
import Loader from "../components/Loader"

export default function EnterPage() {
  const { user, username, userLoading, usernameLoading } = useContext(UserContext)

  if (userLoading || usernameLoading) return <main><Loader show={true} /></main>
  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, but has username <SignOutButton />
  return (
    <main>
      {user 
        ? !username ? <UsernameForm /> : <SignOutButton />
        : <SignInButton />
      }
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
  }

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <img src={'/google.png'} />Sign in with Google
    </button>
  )
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  const handleChange = ({ target }) => {
    const val = target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  const checkUsername = useDebounce(async (username) => {
    if (username.length >= 3) {
      const docRef = doc(firestore, 'usernames', username)
      const docSnap = await getDoc(docRef)

      setIsValid(!docSnap.exists())
      setLoading(false)
    } 
  }, 500)

  const onSubmit = async e => {
    e.preventDefault()

    const batch = writeBatch(firestore)

    const usersRef = doc(firestore, 'users', user.uid)
    batch.set(usersRef, {
      displayName: user.displayName,
      username: formValue,
      photoURL: user.photoURL,
    })

    const usernamesRef = doc(firestore, 'usernames', formValue)
    batch.set(usernamesRef, {uid: user.uid})

    await batch.commit()
  }

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>

          <input 
            name="username"
            value={formValue} 
            onChange={handleChange} 
            placeholder="username"
          />

          <UsernameStatus username={formValue} loading={loading} isValid={isValid} /> 

          <button type="submit" className="btn-green" disabled={!isValid}>Choose</button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>

        </form>
      </section>
    )
  )
}

function UsernameStatus({ username, loading, isValid }) {
  return loading 
    ? <p>Checking...</p>
    : isValid 
      ? <p className="test-success">{username} is available!</p>
      : username.length > 2 && <p className="text-danger">That username is taken!</p>
}