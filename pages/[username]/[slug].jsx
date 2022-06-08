import PostContent from '../../components/PostContent'
import { getUserWithUsername, getPaths, getPostWithPath } from "../../lib/firebase"
import { doc } from 'firebase/firestore'
import { firestore } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import s from '../../styles/Home.module.css'

export async function getStaticProps(params) {
  const {params: {username, slug}} = params

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
  const postRef = doc(firestore, props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  return (
    <main className={s.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p><strong>{post.heartCount || 0} 🤍</strong></p>
      </aside>
    </main>
  )
}