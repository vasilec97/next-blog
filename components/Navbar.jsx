import Link from "next/link"
import { useContext, useState } from "react"
import { UserContext } from "../lib/context"
import { auth } from "../lib/firebase"

const Navbar = ({ }) => {
  const { user, username } = useContext(UserContext)

  return (
    <div className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {username && (
          <ul className="user-control">
            <li>
              <button onClick={() => auth.signOut()}>Sign Out</button>
            </li>

            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Post</button>
              </Link>
            </li>
            
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </ul>
        )}

        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log In</button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Navbar