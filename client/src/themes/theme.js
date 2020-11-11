import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "right",
      color: "black",
    },
    subtitle1: {
      fontWeight: "bold",
    },
  },
  palette: {
    primary: { main: "#97A2AF" },
    background: {
      default: "#F8F7F6",
    },
  },
});
