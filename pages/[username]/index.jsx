import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { getPostsForUser, getUserWithUsername } from '../../lib/firebase'

export async function getServerSideProps(props) {
  const { username } = props.query

  const userDoc = await getUserWithUsername(username)

  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    posts = await getPostsForUser(userDoc, {
      _where: ['published', '==', true],
      _orderBy: ['createdAt', 'desc'],
      _limit: 5
    })
  }

  return {
    props: {user, posts}
  }
}
 
export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  )
}