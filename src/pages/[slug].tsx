import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Container, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { useUser } from "@clerk/nextjs";
import ChakraNextImage from "~/components/ChakraNextImage";
import SideBar from "~/components/SideBar";
import PostView from "~/components/PostView";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });
  console.log(data);
  if (isLoading) return <Spinner color="primary" size="sm" />;

  if (!data || data.length === 0)
    return <Text>El usuario no tiene tweets</Text>;

  return (
    <Flex flexDir="column">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </Flex>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });
  const { isLoaded, isSignedIn } = useUser();

  if (isLoading)
    return (
      <Flex h="100%" w="100%" align="center" justify="center" bg="bg">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  if (!data) return <Text>404</Text>;

  if (!isLoaded || !isSignedIn)
    return (
      <Flex h="100%" w="100%" align="center" justify="center" bg="bg">
        <Spinner color="primary" size="sm" />
      </Flex>
    );

  return (
    <>
      <Head>
        <title>Perfil de {data.username}</title>
      </Head>
      <Container
        maxW="container.2xl"
        h="100%"
        bg="bg"
        display="flex"
        position="relative"
      >
        {data.username && <SideBar username={data.username} />}
        <Flex
          flexDir="column"
          maxW="container.sm"
          minW="container.sm"
          h="100%"
          m="auto"
        >
          <Flex
            borderX="1px solid"
            borderColor="border"
            w="100%"
            flexDir="column"
          >
            <Flex minH="190px" color="white" bg="secondary" position="relative">
              <ChakraNextImage
                borderRadius="100px"
                height="28"
                width="28"
                src={data.profileImageUrl}
                alt="profileImage"
                sizes="(max-width: 60px) 100vw"
                position="absolute"
                bottom="-50"
                left="3"
                border="3px solid black"
              />
            </Flex>
            <Flex
              flexDir="column"
              gap="2"
              px="1"
              mt="12"
              borderBottom="1px solid"
              borderColor="border"
            >
              <Heading as="h2" color="primary" fontSize="2xl" ml="4" mt="4">
                {data.username}
              </Heading>
              <Heading
                as="h3"
                color="grey"
                fontSize="md"
                ml="4"
                fontWeight="normal"
                mb="4"
              >
                @{data.username}
              </Heading>
            </Flex>
            <ProfileFeed userId={data.id} />
          </Flex>
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

export default ProfilePage;
