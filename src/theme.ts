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
      html: {
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
    primary: "#0a0c09",
    secondary: "#EE6021",
  },
  components: {
    Button: {
      baseStyle: {
        _focus: "",
      },
    },
  },
});