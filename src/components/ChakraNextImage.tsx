/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Box} from "@chakra-ui/react";
import Image from "next/image";

const ChakraNextImage: any = ({src, alt, priority, width, height, borderRadius, sizes, ...props}: any) => {
  const isPriority = priority ? true : false;

  return (
    <Box position="relative" width={width} height={height} borderRadius={borderRadius} {...props}>
      <Image alt={alt} priority={isPriority} sizes={sizes} fill={true} style={{objectFit: "cover", borderRadius: borderRadius}} quality="100" src={src} />
    </Box>
  );
};

export default ChakraNextImage;
