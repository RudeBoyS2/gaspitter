import type { GetStaticProps, NextPage } from "next";
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
import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

const PostView: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  console.log(username);
  if (isLoading)
    return (
      <Flex h="100%" w="100%" align="center" justify="center" bg="bg">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  if (!data) return <Text>404</Text>;

  return (
    <>
      <Head>
        <title>Perfil de {data.username}</title>
      </Head>
      <Container maxW="container.2xl" h="100%" bg="bg">
        <Flex flexDir="column" maxW="container.sm" h="100%" m="auto">
          <Heading as="h2" color="primary" fontSize="2xl" p="3">
            {data.username}
          </Heading>
        </Flex>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("Slug is not a string");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default PostView;
