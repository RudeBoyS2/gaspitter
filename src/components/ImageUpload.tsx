import { Flex } from "@chakra-ui/react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  let cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      onChange(result?.info?.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="zhckefs1"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <Flex
            position="relative"
            cursor="pointer"
            _hover={{ opacity: 70 }}
            transition="opacity 0.2s ease-in-out"
            border="dashed 2px"
            borderColor="neutral"
            p="10px"
            flexDir="column"
            justify="center"
            align="center"
            gap="4"
            color="neutral"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
            onClick={open ? () => open() : () => {}}
            // onClick={open?.()}
          >
            <TbPhotoPlus size={30} />
            {value && (
              <Flex position="absolute" inset="0" w="100%" h="100%">
                <Image
                  src={value}
                  alt="Upload image"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Flex>
            )}
          </Flex>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
