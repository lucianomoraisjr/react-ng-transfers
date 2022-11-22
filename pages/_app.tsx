import { AuthProvider } from '../contexts/AuthContext'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  )
}