import { useState, useContext } from 'react'
import PostFeed from '../../components/PostFeed'
import AuthCheck from '../../components/AuthCheck'
import kebabcase from 'lodash.kebabcase'
import { getPostsForCurrentUser, auth, setNewPost } from '../../lib/firebase'
import { useRouter } from 'next/router'
import { UserContext } from '../../lib/context'
import toast from 'react-hot-toast'

export default function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostsList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostsList() {
  const posts = getPostsForCurrentUser() || []

  return (
    <>
      <h1>You can edit posts here!</h1>
      <PostFeed posts={posts} admin={true} />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabcase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  const createPost = async (e) => {
    e.preventDefault()
    const data = {
      title,
      slug,
      uid: auth.currentUser.uid,
      username,
      published: false,
      content: '# hello world!',
      heartCount: 0
    }

    setNewPost(data)
    toast.success('Post created')

    setTimeout(() => {
      router.push(`admin/${slug}`)
    }, 500)
  }

  return (
    <form onSubmit={createPost}>
      <h2>Create new Post</h2>
      <input
        type="text"
        value={title}
        onChange={({target}) => setTitle(target.value)}
        placeholder="The Most Awesome Article!"
      />
      <p><strong>Slug: </strong> {slug}</p>

      <button type="submit" className="btn-green" disabled={!isValid}>
        Create new post
      </button>
    </form>
  )
}