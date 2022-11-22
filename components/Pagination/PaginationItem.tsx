import { Button } from "@chakra-ui/react"

interface PaginationItemProps {
    
    number:number
    isCuttent?: boolean
    onPageChange:(page:number)=>void
}

export function PaginationItem({isCuttent,number,onPageChange}:PaginationItemProps){
    if(isCuttent){
        return(
            <Button size="sm"
            fontSize="xs"
            width="4"
            colorScheme="red"
            disabled
            _disabled={{
                bgColor: "red.600",
                cursor: 'default'
            }}
        >{number}</Button>
        )
    }
    return(
        <Button size="sm"
        fontSize="xs"
        width="4"
        colorScheme="red"
        bgColor="gray.700"
        _hover={{
            bg:'gray.500'
        }}
        onClick={()=>onPageChange(number)}
    >{number}</Button>
    )
}