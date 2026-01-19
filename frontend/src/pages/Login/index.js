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
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { CheckBox, Twitter } from "@material-ui/icons"; // Placeholder import logic, I will do better with full imports
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
	},
	image: {
		backgroundImage: "url(https://source.unsplash.com/random?technology)", // Fallback or use a specific professional image
		backgroundRepeat: "no-repeat",
		backgroundColor:
			theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: "cover",
		backgroundPosition: "center",
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	loginBox: {
		padding: "40px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh"
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
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			{/* Left Side - Image/Branding */}
			<Grid item xs={false} sm={4} md={7} className={classes.image} style={{ background: 'linear-gradient(to right, #0D47A1 , #1976D2 , #0D47A1)' }}>
				<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", color: "white" }}>
					<img src={logoWithRandom} alt="Logo" style={{ width: "200px", marginBottom: "20px" }} />
					<Typography component="h1" variant="h4" style={{ fontWeight: "bold" }}>
						Bienvenido a NIA CRM
					</Typography>
					<Typography variant="h6">
						Gestiona tu negocio de forma inteligente
					</Typography>
				</div>
			</Grid>

			{/* Right Side - Login Form */}
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.loginBox}>
					<img style={{ margin: "0 auto", width: "100%", maxWidth: "150px", marginBottom: "30px" }} src={logoWithRandom} alt={`${process.env.REACT_APP_NAME_SYSTEM}`} />
					<Typography component="h1" variant="h5">
						Iniciar Sesión
					</Typography>
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
						/>

						<Grid container>
							<Grid item xs style={{ textAlign: "right" }}>
								<Link component={RouterLink} to="/forgetpsw" variant="body2">
									¿Olvidaste tu contraseña?
								</Link>
							</Grid>
						</Grid>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{i18n.t("login.buttons.submit")}
						</Button>

						{viewregister === "enabled" && (
							<Grid container>
								<Grid item>
									<Link
										href="#"
										variant="body2"
										component={RouterLink}
										to="/signup"
									>
										{i18n.t("login.buttons.register")}
									</Link>
								</Grid>
							</Grid>
						)}
						<Box mt={5}>
							<Copyright />
						</Box>
					</form>
				</div>
			</Grid>
		</Grid>
	);
};

export default Login;
