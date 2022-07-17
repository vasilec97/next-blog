import Link from 'next/link'

export default function Custom404() {
  return (
    <main>
      <h1>404 - That page does not seem to exist...</h1>
      <iframe
        src="https://giphy.com/embed/jkZtSdwKOx05BOlapR" width="480" 
        height="307" 
        frameBorder="0" 
        className="giphy-embed" 
        allowFullScreen>
      </iframe>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  )
}