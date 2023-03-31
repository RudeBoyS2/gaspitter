import { type NextPage } from "next";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";

import ChakraNextImage from "~/components/ChakraNextImage";
import { useEffect, useState } from "react";
import Link from "next/link";
import SideBar from "~/components/SideBar";
import PostView from "~/components/PostView";

const CreatePost = () => {
  const toast = useToast();
  const [input, setInput] = useState("");
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      const errorTooManyRequests = e.data;
      if (errorMessage && errorMessage[0]) {
        toast({
          title: errorMessage[0],
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } else if (errorTooManyRequests) {
        toast({
          title:
            errorTooManyRequests.code === "TOO_MANY_REQUESTS"
              ? "Solo puedes twittear 3 veces por minuto"
              : "No se pudo twittear",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    },
  });

  if (!user) return null;

  return (
    <Flex
      gap="4"
      borderY="1px solid"
      borderColor="border"
      py="4"
      px="2.5"
      w="100%"
      flexDir="column"
    >
      <Flex>
        <Flex width={{ base: "20%", md: "10%" }}>
          <Link href={`/${user.username || ""}`}>
            <ChakraNextImage
              borderRadius="100px"
              height="14"
              width="14"
              src={user.profileImageUrl}
              alt="profileImage"
              sizes="(max-width: 60px) 100vw"
            />
          </Link>
        </Flex>
        <Input
          placeholder="Tuiteá tus emojis"
          type="text"
          bg="transparent"
          color="primary"
          border="none"
          size="lg"
          _focusVisible={{ border: "none" }}
          w="90%"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
      </Flex>
      <Flex justify="flex-end">
        <Button
          bg="secondary"
          color="primary"
          borderRadius="2xl"
          _hover={{ bg: "secondary", color: "primary" }}
          _active={{ bg: "secondary", color: "primary" }}
          onClick={() => mutate({ content: input })}
          disabled={isPosting}
          minW="90px"
        >
          {isPosting ? <Spinner size="sm" color="primary" /> : "Twittear"}
        </Button>
      </Flex>
    </Flex>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading)
    return (
      <Flex minH="200px" w="100%" justify="center" align="center">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  if (!data)
    return (
      <Flex h="100%" w="100%" justify="center" align="center">
        No se encontraron tweets
      </Flex>
    );

  return (
    <Flex flexDir="column">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </Flex>
  );
};

const Home: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { user } = useUser();
  api.posts.getAll.useQuery();

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
                    _active={{ bg: "secondary", color:"primary" }}
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
          <Feed />
        </Flex>
      </Container>
    </>
  );
};

export default Home;
