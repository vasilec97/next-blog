import { useContext } from "react";
import { UserContext } from "../lib/context";
import Loader from './Loader'
import Link from 'next/link'

export default function AuthCheck({ children, fallback = false }) {
  const { username, usernameLoading } = useContext(UserContext)

  if (usernameLoading) return <Loader show={true} />

  return username
    ? children
    : fallback || (
      <Link href="/enter">
        <a>
          <button className="btn btn-blue">Sign Up that edit Posts</button>
        </a>
      </Link>
    )
}