import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import niaLogo from "../../assets/nia-logo.png";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0b1a",
        fontFamily: "'Poppins', sans-serif",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
    },
    container: {
        backgroundColor: "#fff",
        padding: theme.spacing(6),
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
        maxWidth: "500px",
        textAlign: "center",
    },
    logo: {
        width: "150px",
        marginBottom: theme.spacing(4),
    },
    title: {
        fontWeight: 700,
        color: "#1a1a2e",
        marginBottom: theme.spacing(2),
        fontSize: "1.8rem",
    },
    subtitle: {
        color: "#666",
        marginBottom: theme.spacing(4),
        fontSize: "1rem",
        lineHeight: 1.5,
    },
    whatsappBtn: {
        backgroundColor: "#25D366",
        color: "white",
        fontWeight: "bold",
        padding: "12px 24px",
        borderRadius: "30px",
        fontSize: "1rem",
        textTransform: "none",
        "&:hover": {
            backgroundColor: "#1ebe57",
        },
        marginBottom: theme.spacing(2),
    },
    logoutBtn: {
        color: "#888",
        textTransform: "none",
    }
}));

const ExpiredSubscription = () => {
    const classes = useStyles();
    const { handleLogout } = useContext(AuthContext);

    const handleContactWhatsApp = () => {
        // Reemplaza esto con tu número de WhatsApp real de Nia CRM
        const phoneNumber = "YOUR_PHONE_NUMBER_HERE";
        const message = encodeURIComponent("¡Hola! Mi suscripción en Nia CRM se ha vencido y me gustaría renovarla para seguir usando mi cuenta.");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <img src={niaLogo} alt="Nia CRM" className={classes.logo} />

                <Typography variant="h4" className={classes.title}>
                    Suscripción Vencida
                </Typography>

                <Typography className={classes.subtitle}>
                    Si quieres seguir usando tu cuenta y recuperar el acceso a todos tus chats, contáctanos para procesar tu pago por transferencia.
                </Typography>

                <Button
                    variant="contained"
                    className={classes.whatsappBtn}
                    startIcon={<WhatsAppIcon />}
                    onClick={handleContactWhatsApp}
                >
                    Contactar por WhatsApp
                </Button>

                <Button
                    className={classes.logoutBtn}
                    startIcon={<ExitToAppIcon />}
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
};

export default ExpiredSubscription;
