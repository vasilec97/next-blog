import Link from 'next/link'

export default function PostFeed({ posts, admin = false }) {
  return posts
    ? posts.map(post => <PostItem key={post.slug} post={post} admin={admin} />)
    : null
}

function PostItem({ post, admin }) {
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>❤️ {post.heartCount} Hearts</span>
      </footer>

      {admin && (
        <Link href={`/admin/${post.slug}`}>
          <a><button style={{marginTop: 15, marginBottom: 0}} className="btn btn-red">Edit Post</button></a>
        </Link>
      )}
    </div>
  )
}