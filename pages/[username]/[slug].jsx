import { useContext } from 'react'
import Link from 'next/link'
import PostContent from '../../components/PostContent'
import MetaTags from '../../components/MetaTags'
import { UserContext } from '../../lib/context'
import { getUserWithUsername, getPaths, getPostWithPath } from "../../lib/firebase"
import { doc } from 'firebase/firestore'
import { firestore } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import s from '../../styles/Home.module.css'

export async function getStaticProps({ params }) {
  const {username, slug} = params

  const userDoc = await getUserWithUsername(username)

  const { post, path } = await getPostWithPath(userDoc, slug)

  return {
    props: { post, path },
    revalidate: 5000
  }
}

export async function getStaticPaths() {
  const paths = await getPaths()

  return { paths, fallback: 'blocking' }
}

export default function PostPage(props) {
  const { username, user } = useContext(UserContext)
  const postRef = doc(firestore, props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  return (
    <main className={s.container}>
      <MetaTags title={post.title} description={post.content} image={user?.photoURL} />
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card aside">
        <p><strong>{post.heartCount || 0} 🤍</strong></p>

        {post.username === username && (
          <Link href={`/admin/${post.slug}`}>
            <button type="link" className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  )
}