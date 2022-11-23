
import { Flex, HStack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Tag, TagRightIcon, TagLabel, Heading, useDisclosure, Button, Modal, Select, Box, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItemOption } from "@chakra-ui/react"
import { MdAdd } from 'react-icons/md'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { AuthContex } from 'contexts/AuthContext'
import { api } from 'service/api'
import { Pagination } from '@/components/Pagination'
import { ModalSend } from '@/components/ModalSend'


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
    const [autorizationTable, setAutorizationTable] = useState(false)
    const [type, setType] = useState<'cash-out' | 'cash-in'>()
    const [balance, setBalance] = useState(userLocal?.balance)
    const { singnLogout } = useContext(AuthContex)
    useEffect(() => { setBalance(userLocal?.balance) }, [userLocal])
    useEffect(() => { routerMe() }, [])
    useEffect(() => { handleGetTransactions() }, [page, type])


    async function handleGetTransactions() {

        await api.get<[list: Table, cont: number, balance?: number]>(`search?page=${page}&type=${type}`).catch((e) => {
            console.log(e)
        }).then((response) => {
            if (response) {
                console.log(response)
                const [list, cont, balance] = response.data
                if (balance) setBalance(balance)
                if (list.length > 0) {

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
                    setAutorizationTable(true)
                } else {
                    setAutorizationTable(false)
                }
                setLoadin(false)
            }
        })
    }
    return (

        <Flex w='100vw' minH='100vh' bg='blackAlpha.900' color='white' direction='column' alignItems='center'>
            {loading ? <></>
                : <>
                    <Flex mb='5' p='5' bg='blackAlpha.600' w='100%' justifyContent='space-between' >
                        <Heading fontSize='2xl'>{userLocal?.username}</Heading>
                        <Button colorScheme='purple' onClick={() => { singnLogout() }}>Sair</Button>
                    </Flex >


                    <Box
                        py={{ base: '0', sm: '8' }}
                        px={{ base: '4', sm: '10' }}
                        bg='blackAlpha.600'
                        boxShadow={{ base: 'none', sm: 'md' }}
                        borderRadius={{ base: 'none', sm: 'xl' }}

                    >
                        <HStack spacing={4} >
                            <Heading fontSize='3xl' >Saldo:</Heading>
                            <Tag size='lg' variant='subtle' colorScheme='green'>
                                <TagLabel>{balance}</TagLabel>
                                <TagRightIcon boxSize='12px' as={MdAdd} />
                            </Tag>

                        </HStack>
                        <Button mt='14' colorScheme='purple' onClick={onOpen}>Nova Transferência </Button>
                    </Box>


                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalSend handleGetTransactions={handleGetTransactions} onClose={onClose} />
                    </Modal>
                    {(autorizationTable || !autorizationTable && type) &&
                        <Flex w='80%' align='center' justifyContent='end'>
                            <Heading mr='2' h='33px' fontSize='2xl'>Tipo:</Heading>


                            <Menu >
                                <MenuButton h='33px' fontSize='15px' mr='10px' bg='black' color='white' as={Button}
                                    _hover={{
                                        bg: '#888B91'
                                    }}
                                >
                                    {type ? type : <>Todas</>}
                                </MenuButton>
                                <MenuList bg='black' h='auto'>
                                    <MenuItemOption bg='black' onClick={() => setType(undefined)} color="white">Todas</MenuItemOption>
                                    <MenuItemOption bg='black' onClick={() => setType('cash-in')} color="white">cash-in</MenuItemOption>
                                    <MenuItemOption bg='black' onClick={() => setType('cash-out')} color="white">cash-out</MenuItemOption>
                                </MenuList>
                            </Menu>

                        </Flex>
                    }
                    {autorizationTable &&
                        <>
                            <TableContainer h='40vh' w='80%'>
                                <Table size='sm'>
                                    <Thead>
                                        <Tr >
                                            <Th>Usuário</Th>
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




                            </TableContainer>
                            <Flex w='100%' justifyContent='center' alignItems='center' flexDirection='column'>
                                <Pagination totalCountOfRegisters={totalTransaction}
                                    onPageChange={setPage}
                                    currentPage={page} />
                            </Flex>
                        </>
                    }



                </>
            }

        </Flex>
    )
}