import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { AuthContex } from "contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { api } from "service/api";

interface ModalProps {
    onClose: () => void
    handleGetTransactions: () => void
}

type MsgFrom = {
    username?: string,
    value?: string
}

export function ModalSend({ onClose, handleGetTransactions }: ModalProps) {
    const [username, setUsername] = useState<string>("")
    const [value, setValue] = useState<string>("")
    const [msg, setMsg] = useState<string>()
    const [msgForm, setMsgForm] = useState<MsgFrom>()
    const { userLocal } = useContext(AuthContex)

    useEffect(() => {
        setUsername("")
        setValue("")
    }, [msg])

    function handleSetValue(value: string) {
        value.replace(',', '.')
        setValue(value)
    }

    function handleCheckUsername(): boolean {
        if (username == "") {
            setMsgForm({ ...msgForm, username: "Informe o nome do usuário" })
            return false
        }
        if (username==userLocal?.username ) {
            setMsgForm({ ...msgForm, username: "Não pode  fazer transferência para si mesmo" })
            return false
        }
        return true
    }

    function handleCheckValue(): boolean {

        if (value == "") {
            setMsgForm({ ...msgForm, value: "Informe o valor" })
            return false
        }
        if (Math.sign(parseFloat(value)) == -1) {
            setMsgForm({ ...msgForm, value: "O valor não pode ser negativo" })
            return false
        }
        if (Math.sign(parseFloat(value)) == -1 || Math.sign(parseFloat(value)) == -0 || Math.sign(parseFloat(value)) == 0) {
            setMsgForm({ ...msgForm, value: "O valor tem que ser maior que 0" })
            return false
        }
        setMsgForm(undefined)
        return true
    }

    function handleSend() {

        if (handleCheckUsername() && handleCheckValue()) {
            api.post('/transfer', {
                usernameCred: username,
                value: parseFloat(value)
            }).then(() => {
                setMsg("Transferência Enviada")
                handleGetTransactions()
                setMsgForm({})

            }).catch((error) => {
                console.log(error)
                const msg = error.response.data.error
                if (msg == 'insufficient balance') setMsg("Saldo insuficiente")
                else if (msg == 'Creator user does not exist') setMsg("Usuário inexistente!")
                else setMsg("Erro entre em contato com o suporte")
                setMsgForm({})
            })
        }
    }
    return (
        <>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Transferência</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    {msg ? <>
                        <Heading fontSize='2xl'>{msg}</Heading>
                        <ModalFooter>
                            <Button onClick={() => { setUsername(""), setMsg(undefined), setValue("") }} colorScheme='blue' mr={3}>
                             {msg=="Transferência Enviada" ?<>Nova Transferência</> : <>Tentar novamente</>}
                            </Button>
                            <Button onClick={onClose}>Sair</Button>
                        </ModalFooter>
                    </>
                        :
                        <>
                            <FormControl isInvalid={msgForm?.username ? true : false} mt={4}>

                                <FormLabel>Nome de Usuário</FormLabel>
                                <Input
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                    placeholder='@usuário' />
                                <FormErrorMessage colorScheme="red">{msgForm?.username}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={msgForm?.value ? true : false} mt={4}>
                                <FormLabel>Valor</FormLabel>
                                <Input type='number' onChange={e => handleSetValue(e.target.value)} value={value} />
                                <FormErrorMessage colorScheme="red">{msgForm?.value}</FormErrorMessage>
                            </FormControl>
                        </>
                    }

                </ModalBody>
                {!msg && <ModalFooter>
                    <Button onClick={handleSend} colorScheme='blue' mr={3}>
                        Enviar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                </ModalFooter>}

            </ModalContent>
        </>
    )
}