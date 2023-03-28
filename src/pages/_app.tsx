import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";

import theme from "../theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
