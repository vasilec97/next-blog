import UserProvider from '../components/UserProvider'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>  
  )
}

export default MyApp
