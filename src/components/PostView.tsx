import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import ChakraNextImage from "~/components/ChakraNextImage";
import Link from "next/link";

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
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  return (
    <Flex
      key={post.id}
      px="3"
      py="6"
      borderBottom="1px solid"
      borderColor="border"
      gap="6"
      position="relative"
    >
      {post.authorId === user?.id && (
        <Button
          position="absolute"
          right={{ base: "2", md: "3" }}
          top={{ base: "4", md: "6" }}
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
          <Box display={{base: "none", md: "block"}}>
            <Link href={`/${author.username}`}>
              <Text fontWeight="normal" color="gray">
                @{author.username}
              </Text>
            </Link>
          </Box>
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

export default PostView;
