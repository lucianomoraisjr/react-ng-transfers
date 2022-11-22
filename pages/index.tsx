
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { AuthContex } from 'contexts/AuthContext'
import * as React from 'react'
import { FormEvent, useContext, useState } from 'react'
import { PasswordField } from '../components/PasswordField'


export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { signIn } = useContext(AuthContex)



  async function handleLogin(e: FormEvent<HTMLDivElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(async function () {
      await signIn({ password, username })
      setLoading(false)
    }, 700)


  }
  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign='center'>
          <Heading>N.G Cash</Heading>
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Don't have an account?</Text>
              <Button variant="link" colorScheme="blue">
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing="6" >
            
            <Stack spacing="5">
              <FormControl >
                <FormLabel htmlFor="text">username</FormLabel>
                <Input id="username"
                  onChange={e => setUsername(e.target.value)}
                  type="username" />
              </FormControl>
              <PasswordField onChange={e => setPassword(e.target.value)} />
            </Stack>
            <Stack spacing="6">
              <Button
              onClick={e => handleLogin(e)}
               type='submit'
                colorScheme='blackAlpha' bg='black'>Sign in</Button>
                
            </Stack>
          
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
