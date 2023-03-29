import { type NextPage } from "next";
import Head from "next/head";
import {
  Container,
  Flex,
  Heading, 
} from "@chakra-ui/react";

const SinglePost: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tweet de</title>
      </Head>
      <Container maxW="container.2xl" h="100%" bg="bg">
        <Flex flexDir="column" maxW="container.sm" h="100%" m="auto">
          <Heading as="h2" color="primary" fontSize="2xl" p="3">
            Tweet
          </Heading>
        </Flex>
      </Container>
    </>
  );
};

export default SinglePost;
