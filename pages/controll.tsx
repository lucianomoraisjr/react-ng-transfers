
import { Flex, HStack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Tag, TagRightIcon, TagLabel, Heading, useDisclosure, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { MdAdd } from 'react-icons/md'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { AuthContex } from 'contexts/AuthContext'
import { api } from 'service/api'
import { Pagination } from '@/components/Pagination'


type Table = {
    type: string,
    username: string,
    value: number
    date: string
}[]

export default function Home() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { routerMe, userLocal } = useContext(AuthContex)
    const [table, setTable] = useState<Table>()
    const [page, setPage] = useState<number>(1)
    const [totalTransaction, setTotalTransaction] = useState<number>(1)
    const [loading, setLoadin] = useState(true)
    useEffect(() => { routerMe() }, [])
    useEffect(() => { handleGetTransactions() }, [page])




    async function handleGetTransactions() {
        console.log(page)
        await api.get<[list: Table, cont: number]>(`search?page=${page}`).catch((e) => {
            console.log(e)
        }).then((response) => {
            if (response) {
                const [list, cont] = response.data
                const table = list.map((key) => {
                    let data = new Date(key.date),
                        dia = data.getDate().toString(),
                        diaF = (dia.length == 1) ? '0' + dia : dia,
                        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                        mesF = (mes.length == 1) ? '0' + mes : mes,
                        anoF = data.getFullYear();
                    key.date = diaF + "/" + mesF + "/" + anoF
                    return key
                })
                setTable(table)
                setTotalTransaction(cont)
                setLoadin(false)
            }


        })
    }
    return (

        <Flex direction='column'>
            {loading ? <></>
                : <>
                    <HStack spacing={4}>
                        <Heading fontSize='3xl' >Saldo:</Heading>
                        <Tag size='lg' variant='subtle' colorScheme='green'>
                            <TagLabel>{userLocal?.balance}</TagLabel>
                            <TagRightIcon boxSize='12px' as={MdAdd} />
                        </Tag>

                    </HStack>
                    <Button colorScheme='purple' onClick={onOpen}>Nova Transferência </Button>
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create your account</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>First name</FormLabel>
                                    <Input ref={initialRef} placeholder='First name' />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Last name</FormLabel>
                                    <Input placeholder='Last name' />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3}>
                                    Save
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <TableContainer>
                        <Table size='sm'>
                            <Thead>
                                <Tr >
                                    <Th>Usuario</Th>
                                    <Th>Natureza</Th>
                                    <Th isNumeric>Valor</Th>
                                    <Th isNumeric>Data</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {table?.map((key, index) => (


                                    <Tr key={index}>
                                        <Td>{key.username}</Td>
                                        <Td>{key.type}</Td>
                                        <Td isNumeric>{key.value}</Td>
                                        <Td isNumeric>
                                            {key.date}

                                        </Td>
                                    </Tr>

                                ))}


                            </Tbody>

                            <Tfoot>

                            </Tfoot>

                        </Table>
                        <Pagination totalCountOfRegisters={totalTransaction}
                            onPageChange={setPage}
                            currentPage={page} />
                    </TableContainer>

                </>
            }

        </Flex>
    )
}