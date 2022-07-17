import { useState } from 'react'
import Loader from '../components/Loader'
import PostFeed from '../components/PostFeed'
// import toast from 'react-hot-toast'
import { getAllPostsWithQuery, getNextPosts } from '../lib/firebase'

const LIMIT = 1

export async function getServerSideProps(context) {
  const posts = await getAllPostsWithQuery({
    _where: ['published', '==', true],
    _orderBy: ['createdAt', 'desc'],
    _limit: LIMIT,
  })

  return {
    props: { posts } // will be passed to the page component as props
  }
}

const Home = props => {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)
  
  const getMorePosts = async () => {
    setLoading(true)

    const newPosts = await getNextPosts(posts, {
      _where: ['published', '==', true],
      _orderBy: ['createdAt', 'desc'],
      _limit: LIMIT,
    })

    setPosts([...posts, ...newPosts])
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      {postsEnd && <p>You have reached the end!</p>}

      <Loader show={loading} />
    </main>
  )
}

export default Home
