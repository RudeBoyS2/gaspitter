import {extendTheme} from "@chakra-ui/react";

export default extendTheme({
  fonts: {
    primary: "Bebas Neue",
    secondary: "Epilogue"
  },
  styles: {
    global: {
      body: {
        bg: "#f5f2f2",
        height: "100%",
        width: "100%",
      },
      "#__next": {
        height: "100%",
        width: "100%",
      },
    },
  },
  colors: {
    primary: "#E7E9EA",
    secondary: "#1d9bf0",
    bg: "#000",
    border: "#2F3336"
  },
  components: {
    Button: {
      baseStyle: {
        _focus: "",
      },
    },
  },
});