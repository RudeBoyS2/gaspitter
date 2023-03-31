import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Container, Flex, Heading, Spinner } from "@chakra-ui/react";
import { generateSSGHelper } from "~/utils/ssgHelper";
import { api } from "~/utils/api";

const SinglePost: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getById.useQuery({ id });

  if (!data) return <div>404</div>;

  if (isLoading)
    return (
      <Flex h="100vh" w="100vw" align="center" justify="center" bg="bg">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  return (
    <>
      <Head>
        <title>{`Tweet de ${data.author.username}: ${data.post.content}`}</title>
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

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("Id is not a string");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePost;
