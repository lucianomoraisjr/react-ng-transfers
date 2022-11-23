
import {
    Box,
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'
import { useContext, useState } from 'react'
import { api } from 'service/api'
import { AuthContex } from 'contexts/AuthContext'
import { PasswordField } from '../components/PasswordField'
import { useRouter } from 'next/router'

type MsgForm = {
    username?: string
    password?: string

}

export default function Home() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [msgForm, setMsgForm] = useState<MsgForm>()
    const { signIn,singnLogout } = useContext(AuthContex)
    const router = useRouter()


    function handleCheckPassword(): boolean {
        const regex = /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){1})(?!.*\s)[0-9a-zA-Z]*$/
        if (!regex.exec(password) && password.length < 7) {
            setMsgForm({ ...msgForm, password: 'Senha deve conter pelo menos 8 caracteres, um número e uma letra maiúscula' })
            return false
        }

        if (password != passwordConfirmation) {
            setMsgForm({ ...msgForm, password: 'Senhas diferentes' })
            return false
        }
        return true
    }

    function handleCheckUsername(): boolean {
        if (username.length < 2) {
            setMsgForm({ ...msgForm, username: 'Nome de Usuário deve conter pelo menos 3 caracteres' })
            return false
        }
        return true
    }

    async function handleSendRegistration() {
        setLoading(true)
        if (handleCheckUsername() && handleCheckPassword()) {
            api.post('account/create', {
                username,
                password
            }).then(async (response) => {
                
                await signIn({ password, username }).catch(()=>{
                    singnLogout()
                })
                setLoading(false)

            }).catch((e) => {
               setMsgForm({...msgForm,username:'Nome de Usuário já cadastrado'})
                setLoading(false)
            })
        }
    }

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
            <Stack spacing="8">
                <Stack spacing="6" textAlign='center'>
                    <Heading>N.G Cash</Heading>
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                        <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
                            Crie a sua conta aqui
                        </Heading>
                        <HStack spacing="1" justify="center">
                            <Text color="muted">
                                Já tem uma conta?</Text>
                            <Button onClick={()=>{router.push('login')}} variant="link" colorScheme="blue">
                                Login
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
                    <Stack spacing="6">
                        <Stack spacing="5">
                            <FormControl isInvalid={msgForm?.username ? true : false}>
                                <FormLabel htmlFor="text">User Name</FormLabel>
                                <Input id="username" onChange={(e => setUsername(e.target.value))} value={username} type="text" />
                                <FormErrorMessage colorScheme="red">{msgForm?.username}</FormErrorMessage>
                            </FormControl>
                            <FormControl  >
                                <PasswordField name='Senha' onChange={(e => setPassword(e.target.value))} value={password} />
                            </FormControl>
                            <FormControl isInvalid={msgForm?.password ? true : false} >
                                <PasswordField name='Confirmação da Senha' onChange={(e => setPasswordConfirmation(e.target.value))} value={passwordConfirmation} />
                                <FormErrorMessage colorScheme="red">{msgForm?.password}</FormErrorMessage>
                            </FormControl>
                        </Stack>
                        <Stack spacing="6">
                            <Button onClick={handleSendRegistration} colorScheme='blackAlpha' bg='black'>Create account</Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    )
}
