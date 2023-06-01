import { type NextPage } from "next";

import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import SideBar from "~/components/SideBar";
import Feed from "~/components/Feed";
import CreatePost from "~/components/CreatePost";

const Home: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { user } = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (!isLoaded)
    return (
      <Flex h="100vh" w="100vw" align="center" justify="center" bg="bg">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  return (
    <>
      <Container
        maxW="container.2xl"
        h="100%"
        bg="bg"
        position="relative"
        p="0"
      >
        {user?.username && <SideBar username={user?.username} />}
        <Flex
          flexDir="column"
          maxW="container.sm"
          h="100%"
          m="auto"
          position="relative"
          borderX="1px solid"
          borderColor="border"
        >
          <Flex
            align="center"
            justify="space-between"
            p="4"
            borderBottom="1px solid"
            borderColor="border"
          >
            <Heading as="h2" color="primary" fontSize="2xl">
              Inicio
            </Heading>
            <Flex cursor="pointer">
              {!isSignedIn ? (
                <SignInButton>
                  <Button
                    bg="secondary"
                    color="primary"
                    size="sm"
                    _hover={{ bg: "secondary", color: "primary" }}
                    _active={{ bg: "secondary", color: "primary" }}
                  >
                    Ingresa a tu cuenta
                  </Button>
                </SignInButton>
              ) : (
                <SignOutButton>
                  <Icon as={BiLogOut} w="6" h="6" color="primary" />
                </SignOutButton>
              )}
            </Flex>
          </Flex>
          {isSignedIn && <CreatePost />}
          <Feed data={data} isLoading={isLoading} />
        </Flex>
      </Container>
    </>
  );
};

export default Home;
