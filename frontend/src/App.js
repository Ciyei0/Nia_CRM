import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import lightBackground from '../src/assets/wa-background-light.png';
import darkBackground from '../src/assets/wa-background-dark.jpg';
import { esES } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from './context/Socket/SocketContext';

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '6px',
                    height: '6px',
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.1),',
                    backgroundColor: mode === "light" ? "#942cb0" : "#7c3aed",
                    borderRadius: "8px",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "6px",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#eddeea" : "#4c1d95",
                    borderRadius: "8px",
                },
            },
            palette: {
                type: mode,
                primary: { main: mode === "light" ? "#70008b" : "#f3aeff" },
                secondary: { main: "#7c4d86" },
                sair: { main: mode === "light" ? "#ba1a1a" : "#444" },
                vcard: { main: mode === "light" ? "#70008b" : "#888" },
                textPrimary: mode === "light" ? "#70008b" : "#f3aeff",
                borderPrimary: mode === "light" ? "#70008b" : "#70008b",
                dark: { main: mode === "light" ? "#211921" : "#e8e4f0" },
                light: { main: mode === "light" ? "#fff7fb" : "#22222e" },
                tabHeaderBackground: mode === "light" ? "#feeffb" : "#1a1a24",
                optionsBackground: mode === "light" ? "#fff7fb" : "#1a1a24",
                options: mode === "light" ? "#fff7fb" : "#22222e",
                fontecor: mode === "light" ? "#70008b" : "#f3aeff",
                fancyBackground: mode === "light" ? "#fff7fb" : "#121218",
                bordabox: mode === "light" ? "#eddeea" : "#2c2c3a",
                newmessagebox: mode === "light" ? "#eddeea" : "#2c2c3a",
                inputdigita: mode === "light" ? "#fff" : "#1a1a24",
                contactdrawer: mode === "light" ? "#fff" : "#1a1a24",
                announcements: mode === "light" ? "#feeffb" : "#1a1a24",
                login: mode === "light" ? "#fff" : "#121218",
                announcementspopover: mode === "light" ? "#fff" : "#22222e",
                chatlist: mode === "light" ? "#feeffb" : "#1a1a24",
                boxlist: mode === "light" ? "#eddeea" : "#22222e",
                boxchatlist: mode === "light" ? "#feeffb" : "#1a1a24",
                total: mode === "light" ? "#fff" : "#121218",
                messageIcons: mode === "light" ? "#942cb0" : "#8b7faa",
                inputBackground: mode === "light" ? "#FFFFFF" : "#1a1a24",
                barraSuperior: mode === "light"
                    ? "linear-gradient(135deg, #70008b 0%, #8e24aa 50%, #942cb0 100%)"
                    : "linear-gradient(135deg, #22222e 0%, #1a1a24 100%)",
                boxticket: mode === "light" ? "#feeffb" : "#22222e",
                campaigntab: mode === "light" ? "#feeffb" : "#22222e",
                mediainput: mode === "light" ? "#feeffb" : "#121218",
            },
            typography: {
                fontFamily: "'Inter', 'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                h1: { fontWeight: 800 },
                h2: { fontWeight: 700 },
                h3: { fontWeight: 700 },
                h4: { fontWeight: 600 },
                h5: { fontWeight: 600 },
                h6: { fontWeight: 600 },
                button: {
                    textTransform: "none",
                    fontWeight: 600,
                }
            },
            shape: {
                borderRadius: 16,
            },
            mode,
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "esES") {
            setLocale(esES);
        } else {
            setLocale(esES); // Force Spanish
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <SocketContext.Provider value={SocketManager}>
                        <Routes />
                    </SocketContext.Provider>
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
