import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import niaLogo from "../../assets/nia-logo.png";

const Copyright = () => {
	return (
		<Typography variant="body2" align="center" style={{ fontWeight: 400, letterSpacing: "0.5px", color: "#999", fontSize: "0.75rem" }}>
			NiaCrm V1.0.0
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	"@global": {
		"@import": "url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap')",
		"@keyframes fadeInUp": {
			"from": { opacity: 0, transform: "translateY(30px)" },
			"to": { opacity: 1, transform: "translateY(0)" },
		},
		"@keyframes fadeInScale": {
			"from": { opacity: 0, transform: "scale(0.85)" },
			"to": { opacity: 1, transform: "scale(1)" },
		},
		"@keyframes subtleFloat": {
			"0%, 100%": { transform: "translateY(0px)" },
			"50%": { transform: "translateY(-8px)" },
		},
	},
	root: {
		height: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "#0f0b1a",
		position: "relative",
		fontFamily: "'Poppins', sans-serif",
		overflow: "hidden",
		// Subtle purple glow in the background
		"&::before": {
			content: '""',
			position: "absolute",
			top: "-30%",
			right: "-10%",
			width: "500px",
			height: "500px",
			borderRadius: "50%",
			background: "radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%)",
			pointerEvents: "none",
		},
		"&::after": {
			content: '""',
			position: "absolute",
			bottom: "-20%",
			left: "-10%",
			width: "400px",
			height: "400px",
			borderRadius: "50%",
			background: "radial-gradient(circle, rgba(142, 45, 226, 0.1), transparent 70%)",
			pointerEvents: "none",
		},
	},
	paper: {
		padding: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: "24px",
		boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
		width: "100%",
		maxWidth: "400px",
		margin: theme.spacing(2),
		animation: "$fadeInUp 0.7s ease-out",
		position: "relative",
		zIndex: 1,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		padding: "13px",
		fontSize: "0.95rem",
		fontWeight: 600,
		fontFamily: "'Poppins', sans-serif",
		borderRadius: "12px",
		background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
		color: "white",
		boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		textTransform: "none",
		letterSpacing: "0.3px",
		"&:hover": {
			background: "linear-gradient(135deg, #6d28d9, #5b21b6)",
			boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5)",
			transform: "translateY(-1px)",
		},
		"&:active": {
			transform: "translateY(0px)",
		}
	},
	logoContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginBottom: theme.spacing(1),
		animation: "$fadeInScale 0.6s ease-out",
	},
	logoImg: {
		width: "100%",
		maxWidth: "120px",
		marginBottom: "8px",
		animation: "$subtleFloat 4s ease-in-out infinite",
	},
	logoInfo: {
		marginTop: theme.spacing(0.5),
		textAlign: "center",
	},
	title: {
		fontWeight: 700,
		fontSize: "1.6rem",
		letterSpacing: "-0.3px",
		fontFamily: "'Poppins', sans-serif",
		color: "#1a1a2e",
		marginBottom: "2px",
		textAlign: "center",
	},
	subtitle: {
		fontWeight: 400,
		fontFamily: "'Poppins', sans-serif",
		color: "#888",
		fontSize: "0.85rem",
		letterSpacing: "0.2px",
	},
	textFieldWrapper: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "12px",
			backgroundColor: "#f8f7fc",
			color: "#1a1a2e",
			fontFamily: "'Poppins', sans-serif",
			transition: "all 0.3s ease",
			"&:hover": {
				backgroundColor: "#f0eef5",
			},
			"& fieldset": {
				borderColor: "#e8e5f0",
				transition: "border-color 0.3s ease",
			},
			"&.Mui-focused": {
				backgroundColor: "#f0eef5",
				"& fieldset": {
					borderColor: "#7c3aed",
					borderWidth: "2px",
				},
			},
		},
		"& .MuiInputLabel-outlined": {
			color: "#999",
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 400,
			"&.Mui-focused": {
				color: "#7c3aed",
			},
		},
		"& .MuiInputAdornment-root .MuiSvgIcon-root": {
			color: "#bbb",
			fontSize: "1.2rem",
			transition: "color 0.3s ease",
		},
		"& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
			color: "#7c3aed",
		},
	},
	forgotPasswordLink: {
		color: "#999",
		textDecoration: "none",
		fontFamily: "'Poppins', sans-serif",
		fontSize: "0.8rem",
		fontWeight: 400,
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#7c3aed",
			textDecoration: "none",
		}
	},
	registerLink: {
		color: "#7c3aed",
		fontWeight: 600,
		fontFamily: "'Poppins', sans-serif",
		textDecoration: "none",
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#5b21b6",
			textDecoration: "none",
		}
	},
	divider: {
		display: "flex",
		alignItems: "center",
		margin: theme.spacing(2, 0, 1),
		"& span": {
			color: "#ccc",
			fontSize: "0.75rem",
			fontFamily: "'Poppins', sans-serif",
			padding: "0 12px",
			fontWeight: 400,
		},
		"&::before, &::after": {
			content: '""',
			flex: 1,
			height: "1px",
			background: "#eee",
		},
	},
	showPasswordBtn: {
		color: "#bbb",
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#7c3aed",
			backgroundColor: "transparent",
		},
	},
}));

const Login = () => {
	const classes = useStyles();
	const [user, setUser] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
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

	return (
		<div className={classes.root}>
			<CssBaseline />

			<div className={classes.paper}>
				<div className={classes.logoContainer}>
					<img className={classes.logoImg} src={niaLogo} alt="Nia CRM Logo" />
					<div className={classes.logoInfo}>
						<Typography component="h1" variant="h5" className={classes.title}>
							Bienvenido
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
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<EmailOutlinedIcon />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						type={showPassword ? "text" : "password"}
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
						className={classes.textFieldWrapper}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockOutlinedIcon />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										className={classes.showPasswordBtn}
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
										size="small"
									>
										{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<Box display="flex" justifyContent="flex-end" mt={0.5}>
						<Link component={RouterLink} to="/forgetpsw" variant="body2" className={classes.forgotPasswordLink}>
							¿Olvidaste tu contraseña?
						</Link>
					</Box>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						className={classes.submit}
						endIcon={<ArrowForwardIcon />}
					>
						Iniciar Sesión
					</Button>

					{true && (
						<>
							<div className={classes.divider}>
								<span>o</span>
							</div>
							<Box display="flex" justifyContent="center" mt={1}>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/signup"
									className={classes.registerLink}
								>
									Crear una cuenta nueva
								</Link>
							</Box>
						</>
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
