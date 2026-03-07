import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";

const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright "}
			<Link color="inherit" href="#">
				{nomeEmpresa} - v {versionSystem}
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		height: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)", // Modern purple palette
	},
	paper: {
		padding: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: theme.palette.type === "light" ? "#ffffff" : "#1e1e1e",
		borderRadius: "24px",
		boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
		width: "100%",
		maxWidth: "420px",
		margin: theme.spacing(2),
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		padding: "12px",
		fontSize: "1rem",
		fontWeight: 600,
		borderRadius: "12px",
		background: "linear-gradient(to right, #4A00E0, #8E2DE2)",
		color: "white",
		boxShadow: "0 4px 14px rgba(142, 45, 226, 0.4)",
		transition: "transform 0.2s, box-shadow 0.2s",
		"&:hover": {
			background: "linear-gradient(to right, #3A00B0, #7E1DD2)",
			boxShadow: "0 6px 20px rgba(142, 45, 226, 0.6)",
			transform: "translateY(-1px)",
		}
	},
	logoContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginBottom: theme.spacing(3),
	},
	logoInfo: {
		marginTop: theme.spacing(2),
		textAlign: "center",
	},
	title: {
		fontWeight: 700,
		color: theme.palette.type === "light" ? "#333" : "#fff",
		marginBottom: theme.spacing(1),
	},
	subtitle: {
		fontWeight: 400,
		color: theme.palette.type === "light" ? "#666" : "#aaa",
	},
	textFieldWrapper: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "10px",
			"&.Mui-focused fieldset": {
				borderColor: "#8E2DE2",
			},
		},
		"& .MuiInputLabel-outlined.Mui-focused": {
			color: "#8E2DE2",
		}
	},
	forgotPasswordLink: {
		color: theme.palette.type === "light" ? "#666" : "#aaa",
		textDecoration: "none",
		"&:hover": {
			color: "#8E2DE2",
			textDecoration: "underline",
		}
	},
	registerLink: {
		color: "#8E2DE2",
		fontWeight: 600,
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline",
		}
	}
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });

	const { handleLogin } = useContext(AuthContext);
	const [viewregister, setviewregister] = useState('disabled');

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		fetchviewregister();
	}, []);

	const fetchviewregister = async () => {
		try {
			const responsev = await api.get("/settings/viewregister");
			const viewregisterX = responsev?.data?.value;
			setviewregister(viewregisterX);
		} catch (error) {
			console.error('Error retrieving viewregister', error);
		}
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	const logo = `${process.env.REACT_APP_BACKEND_URL}/public/logotipos/login.png`;
	const randomValue = Math.random();
	const logoWithRandom = `${logo}?r=${randomValue}`;

	return (
		<div className={classes.root}>
			<CssBaseline />

			<div className={classes.paper}>
				<div className={classes.logoContainer}>
					<img style={{ width: "100%", maxWidth: "160px" }} src={logoWithRandom} alt={`${process.env.REACT_APP_NAME_SYSTEM}`} />
					<div className={classes.logoInfo}>
						<Typography component="h1" variant="h5" className={classes.title}>
							Bienvenido a NIA CRM PRUEBA
						</Typography>
						<Typography variant="body2" className={classes.subtitle}>
							Gestiona tu negocio de forma inteligente
						</Typography>
					</div>
				</div>

				<form className={classes.form} noValidate onSubmit={handlSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label={i18n.t("login.form.email")}
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
						className={classes.textFieldWrapper}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
						className={classes.textFieldWrapper}
					/>

					<Box display="flex" justifyContent="flex-end" mt={1}>
						<Link component={RouterLink} to="/forgetpsw" variant="body2" className={classes.forgotPasswordLink}>
							¿Olvidaste tu contraseña?
						</Link>
					</Box>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						className={classes.submit}
					>
						Iniciar Sesión
					</Button>

					{viewregister === "enabled" && (
						<Box display="flex" justifyContent="center" mt={2}>
							<Link
								href="#"
								variant="body2"
								component={RouterLink}
								to="/signup"
								className={classes.registerLink}
							>
								{i18n.t("login.buttons.register")}
							</Link>
						</Box>
					)}
					<Box mt={4}>
						<Copyright />
					</Box>
				</form>
			</div>
		</div>
	);
};

export default Login;
