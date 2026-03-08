import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import lightBackground from '../src/assets/wa-background-light.png';
import darkBackground from '../src/assets/wa-background-dark.jpg';
import { ptBR } from "@material-ui/core/locale";
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
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.15)',
                    backgroundColor: mode === "light" ? "#c084fc" : "#7c3aed",
                    borderRadius: "8px",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "6px",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#e9d5ff" : "#4c1d95",
                    borderRadius: "8px",
                },
            },
            palette: {
                type: mode,
                primary: { main: mode === "light" ? "#7c3aed" : "#a78bfa" },
                secondary: { main: "#8E2DE2" },
                sair: { main: mode === "light" ? "#d32f2f" : "#444" },
                vcard: { main: mode === "light" ? "#7c3aed" : "#888" },
                textPrimary: mode === "light" ? "#7c3aed" : "#c4b5fd",
                borderPrimary: mode === "light" ? "#7c3aed" : "#7c3aed",
                dark: { main: mode === "light" ? "#1e1b4b" : "#e8e0f5" },
                light: { main: mode === "light" ? "#f5f3ff" : "#252030" },
                tabHeaderBackground: mode === "light" ? "#f5f3ff" : "#2a2535",
                optionsBackground: mode === "light" ? "#faf5ff" : "#1e1a28",
                options: mode === "light" ? "#faf5ff" : "#2a2535",
                fontecor: mode === "light" ? "#7c3aed" : "#c4b5fd",
                fancyBackground: mode === "light" ? "#f8f7fc" : "#16111e",
                bordabox: mode === "light" ? "#ede9fe" : "#2a2535",
                newmessagebox: mode === "light" ? "#ede9fe" : "#2a2535",
                inputdigita: mode === "light" ? "#fff" : "#221d2e",
                contactdrawer: mode === "light" ? "#fff" : "#1e1a28",
                announcements: mode === "light" ? "#f5f3ff" : "#1e1a28",
                login: mode === "light" ? "#fff" : "#16111e",
                announcementspopover: mode === "light" ? "#fff" : "#221d2e",
                chatlist: mode === "light" ? "#f5f3ff" : "#1e1a28",
                boxlist: mode === "light" ? "#ede9fe" : "#2a2535",
                boxchatlist: mode === "light" ? "#f5f3ff" : "#1e1a28",
                total: mode === "light" ? "#fff" : "#16111e",
                messageIcons: mode === "light" ? "#a78bfa" : "#9b8abf",
                inputBackground: mode === "light" ? "#FFFFFF" : "#221d2e",
                barraSuperior: mode === "light"
                    ? "linear-gradient(135deg, #7c3aed 0%, #8E2DE2 50%, #6C3CE1 100%)"
                    : "linear-gradient(135deg, #2a2040 0%, #1e1a28 100%)",
                boxticket: mode === "light" ? "#f5f3ff" : "#2a2535",
                campaigntab: mode === "light" ? "#f5f3ff" : "#2a2535",
                mediainput: mode === "light" ? "#f5f3ff" : "#16111e",
            },
            typography: {
                fontFamily: "'Poppins', 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                button: {
                    textTransform: "none",
                    fontWeight: 600,
                }
            },
            shape: {
                borderRadius: 12,
            },
            mode,
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
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
