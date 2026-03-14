import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, Container, Grid, Box } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import niaLogo from "../../assets/nia-logo.png";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: "100vh",
        backgroundColor: "#0f0b1a",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        overflow: "hidden",
    },
    glowTop: {
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent 70%)",
        pointerEvents: "none",
    },
    glowBottom: {
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(142, 45, 226, 0.15), transparent 70%)",
        pointerEvents: "none",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(3, 0),
        position: "relative",
        zIndex: 10,
    },
    logo: {
        height: "100%",
        maxHeight: "45px",
        objectFit: "contain",
    },
    navButton: {
        color: "#fff",
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: "20px",
        padding: "6px 20px",
        textTransform: "none",
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        "&:hover": {
            borderColor: "#fff",
            backgroundColor: "rgba(255,255,255,0.05)",
        },
    },
    heroSection: {
        padding: theme.spacing(12, 0, 8),
        textAlign: "center",
        position: "relative",
        zIndex: 10,
    },
    heroTitle: {
        fontWeight: 800,
        fontSize: "3.5rem",
        lineHeight: 1.2,
        marginBottom: theme.spacing(3),
        fontFamily: "'Poppins', sans-serif",
        "& span": {
            background: "linear-gradient(135deg, #a78bfa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        },
        [theme.breakpoints.down("sm")]: {
            fontSize: "2.5rem",
        },
    },
    heroSubtitle: {
        color: "#bbb",
        fontSize: "1.2rem",
        maxWidth: "800px",
        margin: "0 auto",
        marginBottom: theme.spacing(6),
        fontFamily: "'Poppins', sans-serif",
        lineHeight: 1.6,
    },
    primaryButton: {
        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        color: "white",
        padding: "14px 36px",
        borderRadius: "30px",
        fontSize: "1.1rem",
        fontWeight: 700,
        textTransform: "none",
        boxShadow: "0 10px 25px rgba(124, 58, 237, 0.4)",
        fontFamily: "'Poppins', sans-serif",
        "&:hover": {
            background: "linear-gradient(135deg, #6d28d9, #5b21b6)",
            transform: "translateY(-2px)",
            boxShadow: "0 15px 35px rgba(124, 58, 237, 0.5)",
        },
        transition: "all 0.3s ease",
    },
    featuresSection: {
        padding: theme.spacing(8, 0),
        position: "relative",
        zIndex: 10,
    },
    featureBox: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "20px",
        padding: theme.spacing(4),
        height: "100%",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "translateY(-5px)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
    },
    featureTitle: {
        fontWeight: 600,
        fontSize: "1.3rem",
        marginBottom: theme.spacing(2),
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        "& svg": {
            color: "#a78bfa",
        },
    },
    featureDesc: {
        color: "#999",
        fontFamily: "'Poppins', sans-serif",
        lineHeight: 1.6,
    },
    footer: {
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: theme.spacing(4, 0),
        marginTop: theme.spacing(8),
        textAlign: "center",
        color: "#666",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        zIndex: 10,
    }
}));

const LandingPage = () => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <div className={classes.glowTop} />
            <div className={classes.glowBottom} />

            <Container maxWidth="lg">
                {/* Navigation */}
                <Box className={classes.navbar}>
                    <img src={niaLogo} alt="Nia CRM" className={classes.logo} />
                    <Button
                        variant="outlined"
                        className={classes.navButton}
                        onClick={() => history.push("/login")}
                    >
                        Iniciar Sesión
                    </Button>
                </Box>

                {/* Hero Section */}
                <Box className={classes.heroSection}>
                    <Typography variant="h1" className={classes.heroTitle}>
                        El CRM perfecto para <br /><span>tu negocio en WhatsApp</span>
                    </Typography>
                    <Typography className={classes.heroSubtitle}>
                        Centraliza la comunicación con tus clientes, organiza a tu equipo de ventas y automatiza tus respuestas. Todo desde una plataforma moderna, rápida y diseñada para vender más.
                    </Typography>

                    <Button
                        className={classes.primaryButton}
                        onClick={() => history.push("/signup")}
                    >
                        Empieza tus 15 días gratis
                    </Button>
                    <Typography style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
                        Sin tarjeta de crédito • Fácil configuración
                    </Typography>
                </Box>

                {/* Features Section */}
                <Box className={classes.featuresSection}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box className={classes.featureBox}>
                                <Typography className={classes.featureTitle}>
                                    <CheckCircleOutlineIcon /> Multi-agente
                                </Typography>
                                <Typography className={classes.featureDesc}>
                                    Conecta un solo número de WhatsApp y permite que todo tu equipo atienda clientes simultáneamente. Asigna chats y mantén el control.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className={classes.featureBox}>
                                <Typography className={classes.featureTitle}>
                                    <CheckCircleOutlineIcon /> Automatización
                                </Typography>
                                <Typography className={classes.featureDesc}>
                                    Configura respuestas rápidas, flujos de integración y chatbots para atender a tus clientes 24/7 sin intervención manual.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className={classes.featureBox}>
                                <Typography className={classes.featureTitle}>
                                    <CheckCircleOutlineIcon /> Kanban y Embudos
                                </Typography>
                                <Typography className={classes.featureDesc}>
                                    Visualiza tus ventas en formato Kanban. Organiza clientes por etapas, añade etiquetas y no pierdas ninguna oportunidad de cierre.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Footer */}
                <Box className={classes.footer}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Nia CRM. Todos los derechos reservados.
                    </Typography>
                </Box>

            </Container>
        </div>
    );
};

export default LandingPage;
