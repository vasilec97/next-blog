import { useRouter } from "next/router"

export default function AdminPostEdit({  }) {
  const router = useRouter()

  return (
    <main>
      <h1>{router.query.slug}</h1>
    </main>
  )
}