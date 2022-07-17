import { useContext, useState, useEffect } from 'react'
import AuthCheck from '../../components/AuthCheck'
import MetaTags from "../../components/MetaTags"
import { useRouter } from "next/router"
import { UserContext } from "../../lib/context"
import { getPostWithPath, getUserWithUsername } from "../../lib/firebase"

export default function AdminPostEdit({}) {
  const { username, user } = useContext(UserContext)
  const { query: { slug } } = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')  
  
  useEffect(() => {
    if (!username) return 

    async function getPost() {
      try {
        const userDoc = await getUserWithUsername(username)
  
        const { post } = await getPostWithPath(userDoc, slug)

        setTitle(post?.title)
        setDescription(post?.content)
      } catch(err) {
        console.warn(err.message)
      }
    }

    getPost()
  }, [username])

  return (
    <main>
      <AuthCheck>
        <MetaTags title={title} description={description} image={user?.photoURL} />
        <h1>{slug}</h1>
      </AuthCheck>
    </main>
  )
}