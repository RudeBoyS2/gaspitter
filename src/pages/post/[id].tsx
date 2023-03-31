import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { generateSSGHelper } from "~/utils/ssgHelper";
import { api } from "~/utils/api";
import PostView from "~/components/PostView";
import SideBar from "~/components/SideBar";
import { useRouter } from "next/router";

const SinglePost: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();
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
        {data.author.username && <SideBar username={data.author.username} />}
        <Flex
          flexDir="column"
          maxW="container.sm"
          h="100%"
          m="auto"
          borderX="1px solid"
          borderColor="border"
        >
          <Flex align="center" borderBottom="1px solid" borderColor="border">
            <Button
              onClick={() => router.back()}
              bg="transparent"
              color="primary"
              w={12}
              h={12}
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
            >
              <Icon as={BiArrowBack} color="primary" p="3" w={12} h={12} />
            </Button>
            <Heading as="h2" color="primary" fontSize="2xl" p="3">
              Tweet
            </Heading>
          </Flex>
          <Flex flexDir="column">
            <PostView {...data} />
          </Flex>
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
