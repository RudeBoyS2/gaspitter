import type { Post } from "@prisma/client";
import { Flex, Spinner } from "@chakra-ui/react";
import PostView from "./PostView";

interface FeedProps {
    data: {
        post: Post;
        author: {
            username: string;
            id: string;
            profileImageUrl: string;
        };
    }[] | undefined,
    isLoading: boolean;
}

const Feed: React.FC<FeedProps> = ({ data, isLoading }) => {
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

  export default Feed;