
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
import * as React from 'react'
import { useState } from 'react'


import { PasswordField } from '../components/PasswordField'


export default function Home() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    function handleCheckPassword() {

    }

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
            <Stack spacing="8">
                <Stack spacing="6" textAlign='center'>
                    <Heading>N.G Cash</Heading>
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                        <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
                            Create an account
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
                    <Stack spacing="6">
                        <Stack spacing="5">
                            <FormControl>
                                <FormLabel htmlFor="text">User Name</FormLabel>
                                <Input id="username"  onChange={(e=>setUsername(username))} value={username} type="text" />
                            </FormControl>
                            <PasswordField   onChange={(e=>setUsername(password))} value={password}/>
                            <PasswordField   onChange={(e=>setUsername(passwordConfirmation))} value={passwordConfirmation}/>
                        </Stack>
                        <Stack spacing="6">
                            <Button colorScheme='blackAlpha' bg='black'>Create account</Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    )
}
