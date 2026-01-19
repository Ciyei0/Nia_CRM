import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Box } from "@material-ui/core";
import { toast } from "react-toastify";

const FacebookCallback = () => {
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
            setStatus("error");
            toast.error("Error al conectar con Facebook: " + error);
            // Close popup after showing error
            setTimeout(() => {
                if (window.opener) {
                    window.opener.postMessage({ type: "FB_AUTH_ERROR", error }, "*");
                    window.close();
                }
            }, 2000);
            return;
        }

        if (code) {
            // Send code back to parent window
            setStatus("success");
            if (window.opener) {
                window.opener.postMessage({ type: "FB_AUTH_SUCCESS", code }, "*");
                window.close();
            } else {
                // If popup was blocked, show instructions
                setStatus("manual");
            }
        } else {
            setStatus("error");
            toast.error("No se recibió código de autorización");
        }
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            {status === "processing" && (
                <>
                    <CircularProgress size={60} />
                    <Typography variant="h6" style={{ marginTop: 20 }}>
                        Procesando autorización...
                    </Typography>
                </>
            )}

            {status === "success" && (
                <Typography variant="h6" color="primary">
                    ¡Autorización exitosa! Esta ventana se cerrará automáticamente.
                </Typography>
            )}

            {status === "error" && (
                <Typography variant="h6" color="error">
                    Error en la autorización. Puedes cerrar esta ventana.
                </Typography>
            )}

            {status === "manual" && (
                <Box textAlign="center" p={3}>
                    <Typography variant="h6" color="primary">
                        ¡Autorización recibida!
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: 10 }}>
                        Por favor, cierra esta ventana y regresa a la página de Conexiones.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default FacebookCallback;
