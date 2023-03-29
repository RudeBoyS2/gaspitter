import { type NextPage } from "next";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import ChakraNextImage from "~/components/ChakraNextImage";
import { useEffect, useState } from "react";
import Link from "next/link";

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
          {isPosting ? <Spinner size="sm" /> : "Twittear"}
        </Button>
      </Flex>
    </Flex>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const toast = useToast();
  const { user } = useUser();
  const { post, author } = props;
  const ctx = api.useContext();

  const date = new Date(post.createdAt);
  const postDate = date.toLocaleTimeString("es-AR", {
    hour: "numeric",
    minute: "numeric",
  });

  const { mutate, isLoading: isDeleting } = api.posts.delete.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast({
          title: errorMessage[0],
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    },
  });

  if (isDeleting)
    return (
      <Flex
        key={post.id}
        px="3"
        py="6"
        borderBottom="1px solid"
        borderColor="border"
        align="center"
        gap="6"
        position="relative"
        justify="center"
        minH="111px"
      >
        <Spinner />
      </Flex>
    );

  return (
    <Flex
      key={post.id}
      px="3"
      py="6"
      borderBottom="1px solid"
      borderColor="border"
      align="center"
      gap="6"
      position="relative"
    >
      {post.authorId === user?.id && (
        <Button
          position="absolute"
          right="3"
          top="7"
          w="6"
          h="6"
          bg="none"
          _hover={{ bg: "none", color: "red" }}
          _active={{ bg: "none" }}
          color="primary"
          onClick={() => mutate(post.id)}
          disabled={isDeleting}
        >
          X
        </Button>
      )}
      <Link href={`/${author.username}`}>
        <ChakraNextImage
          src={author.profileImageUrl}
          borderRadius="100px"
          height="14"
          width="14"
          alt="Profile image"
          sizes="(max-width: 60px) 100vw"
        />
      </Link>
      <Flex flexDir="column" gap="2">
        <Flex gap="2" align="center">
          <Link href={`/${author.username}`}>
            <Heading as="h4" fontSize="md" color="primary" fontWeight="bold">
              {author.username}
            </Heading>
          </Link>
          <Link href={`/${author.username}`}>
            <Text fontWeight="normal" color="gray">
              @{author.username}
            </Text>
          </Link>
          <Link href={`/post/${post.id}`}>
            <Text fontWeight="normal" color="gray">
              - {postDate}
            </Text>
          </Link>
        </Flex>
        <Text color="primary" fontSize="xl">
          {post.content}
        </Text>
      </Flex>
    </Flex>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading)
    return (
      <Flex minH="200px" w="100%" justify="center" align="center">
        <Spinner />
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
  const { user, isLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  if (!user) return <SignInButton />;

  if (!isLoaded)
    return (
      <Flex h="100%" w="100%" align="center" justify="center" bg="bg">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  return (
    <>
      <Container maxW="container.2xl" h="100%" bg="bg">
        <Flex flexDir="column" maxW="container.sm" h="100%" m="auto">
          <Heading as="h2" color="primary" fontSize="2xl" p="3">
            Inicio
          </Heading>
          {isSignedIn && <CreatePost />}
          <Feed />
        </Flex>
      </Container>
    </>
  );
};

export default Home;
