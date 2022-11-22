import { Button, FormControl, FormLabel, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "service/api";

interface ModalProps {
    onClose: () => void
}


export function ModalSend({ onClose }: ModalProps) {
    const [username, setUsername] = useState<string>()
    const [value, setValue] = useState<string>("")

    function handleSetValue(value: string) {
       value.replace(',','.')
       setValue(value)
    }

    function handleSend(){
        api.post('/transfer',{
            usernameCred:username,
            value
        }).then((response)=>{
            console.log(response)
        }).catch((e)=>{
            console.log(e)
        })
    }
    return (
        <>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Transferencia</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Nome de Usuario</FormLabel>
                        <Input
                            onChange={e => setUsername(e.target.value)}
                            placeholder='@usuario' />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Valor</FormLabel>
                        <Input type='number' onChange={e => handleSetValue(e.target.value)} value={value} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleSend} colorScheme='blue' mr={3}>
                        Enviar
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </>
    )
}