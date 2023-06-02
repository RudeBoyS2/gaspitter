import { Button, Flex, Input, Spinner, useToast } from "@chakra-ui/react";

import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

import ChakraNextImage from "~/components/ChakraNextImage";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
  const toast = useToast();
  const [input, setInput] = useState("");
  const [image, setImage] = useState("");
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      setImage("");
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
              height="20"
              width="20"
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
          fontSize="2xl"
          _focusVisible={{ border: "none" }}
          w="90%"
          ml="6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />

      </Flex>
      <Flex justify="flex-end" gap="4">
        <ImageUpload onChange={(value) => setImage(value)} value={image} />
        <Button
          alignSelf="flex-end"
          bg="secondary"
          color="primary"
          borderRadius="2xl"
          _hover={{ bg: "secondary", color: "primary" }}
          _active={{ bg: "secondary", color: "primary" }}
          onClick={() => mutate({ content: input, image })}
          disabled={isPosting}
          minW="90px"
          fontSize="xl"
        >
          {isPosting ? <Spinner size="sm" color="primary" /> : "Twittear"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreatePost;
