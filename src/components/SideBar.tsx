import { Button, Flex, Icon } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { BiHomeAlt2, BiUser } from "react-icons/bi";

const SideBar = (user: {username: string}) => {
    const router = useRouter();
    console.log(user.username)

  return (
    <Flex flexDir="column" w="200px" position="absolute" gap="4" left={{md: "32", "2xl": "72"}} top="20">
        <Button onClick={() => void router.push("/")} color="primary" size="sm" variant="ghost" fontSize="2xl" w="130px" h="40px" display="flex" _hover={{bg: "gray.700"}} borderRadius="2xl">
          <Icon as={BiHomeAlt2} mr="2" />
          Inicio
        </Button>
        <Button onClick={() => void router.push(`/${user.username}`)} color="primary" size="sm" variant="ghost" fontSize="2xl" w="130px" h="40px" display="flex" _hover={{bg: "gray.700"}} borderRadius="2xl">
        <Icon as={BiUser} mr="3" />
          Perfil 
        </Button>
      </Flex>
  )
}

export default SideBar