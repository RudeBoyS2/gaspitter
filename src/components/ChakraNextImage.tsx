/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Box} from "@chakra-ui/react";
import Image from "next/image";

const ChakraNextImage: any = ({src, alt, priority, width, height, borderRadius, ...props}: any) => {
  const isPriority = priority ? true : false;

  return (
    <Box position="relative" width={width} height={height} borderRadius={borderRadius} {...props}>
      <Image alt={alt} priority={isPriority} fill style={{objectFit: "cover", borderRadius: borderRadius}} quality="100" src={src} />
    </Box>
  );
};

export default ChakraNextImage;
