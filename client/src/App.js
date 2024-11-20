import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AppRouter from "./router/AppRouter";
import './App.css';


const App = () => {
  const theme = createTheme({
      palette: {
          primary: {
              main: "#FED84C",
          },
          secondary: {
              main: "#FFFFFF",
          },
          text: {
              main: "#000000",
          },
      },
      
      breakpoints: {
          values: {
              xs: 0,
              sm: 320,
              md: 768,
              lg: 1200,
              xl: 1536,
          },
      },
  });

  return (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <ThemeProvider theme={theme}>
              <BrowserRouter>
                  <AppRouter />
              </BrowserRouter>
          </ThemeProvider>
      </LocalizationProvider>
  );
};

export default App;
