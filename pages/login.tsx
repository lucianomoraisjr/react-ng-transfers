
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Spinner,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react'
import { AuthContex } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useContext, useState } from 'react'
import { PasswordField } from '../components/PasswordField'


export default function Login() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>()
    const router = useRouter()
    const { signIn } = useContext(AuthContex)



    async function handleLogin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        setLoading(true)
        setTimeout(async function () {
            await signIn({ password, username }).catch(function () {
                setMsgError('Usuário ou senha incorreto')
            })
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
                            Faça login na sua conta
                        </Heading>
                        <HStack spacing="1" justify="center">
                            <Text color="muted">Não tem uma conta?</Text>
                            <Button variant="link" onClick={(() => { router.push('createaccount') })} colorScheme="blue">

                                Inscrever-se
                            </Button>
                        </HStack>
                    </Stack>
                    {msgError && <Heading color='red' fontSize='1xs'>{msgError}</Heading>}
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
                                <FormErrorMessage colorScheme="red"></FormErrorMessage>
                                <FormLabel htmlFor="text">Nome de usuário</FormLabel>
                                <Input id="username"
                                    onChange={e => setUsername(e.target.value)}
                                    type="username" />
                            </FormControl>
                            <PasswordField name='Senha' onChange={e => setPassword(e.target.value)} />
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
