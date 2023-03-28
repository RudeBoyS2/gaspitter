import { type NextPage } from "next";
import Head from "next/head";
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

const PostView: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.2xl" h="100%" bg="bg">
        <Flex flexDir="column" maxW="container.sm" h="100%" m="auto">
          <Heading as="h2" color="primary" fontSize="2xl" p="3">
            Perfil
          </Heading>
        </Flex>
      </Container>
    </>
  );
};

export default PostView;