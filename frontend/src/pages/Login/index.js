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
		<Typography variant="body2" align="center" style={{ fontWeight: 500, letterSpacing: "0.5px", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
			NiaCrm V1.0.0
		</Typography>
	);
};

// Floating orbs for the animated background
const FloatingOrbs = () => {
	return (
		<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
			{[...Array(6)].map((_, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						borderRadius: "50%",
						background: `radial-gradient(circle, rgba(142, 45, 226, ${0.15 + i * 0.03}), transparent 70%)`,
						width: `${80 + i * 50}px`,
						height: `${80 + i * 50}px`,
						top: `${10 + i * 15}%`,
						left: `${5 + i * 16}%`,
						animation: `floatOrb${i} ${6 + i * 2}s ease-in-out infinite`,
					}}
				/>
			))}
		</div>
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
			"from": { opacity: 0, transform: "scale(0.8)" },
			"to": { opacity: 1, transform: "scale(1)" },
		},
		"@keyframes shimmer": {
			"0%": { backgroundPosition: "-200% center" },
			"100%": { backgroundPosition: "200% center" },
		},
		"@keyframes pulseGlow": {
			"0%, 100%": { boxShadow: "0 4px 14px rgba(142, 45, 226, 0.4)" },
			"50%": { boxShadow: "0 4px 30px rgba(142, 45, 226, 0.7)" },
		},
		"@keyframes gradientShift": {
			"0%": { backgroundPosition: "0% 50%" },
			"50%": { backgroundPosition: "100% 50%" },
			"100%": { backgroundPosition: "0% 50%" },
		},
		"@keyframes floatOrb0": {
			"0%, 100%": { transform: "translate(0px, 0px)" },
			"50%": { transform: "translate(30px, -40px)" },
		},
		"@keyframes floatOrb1": {
			"0%, 100%": { transform: "translate(0px, 0px)" },
			"50%": { transform: "translate(-25px, 35px)" },
		},
		"@keyframes floatOrb2": {
			"0%, 100%": { transform: "translate(0px, 0px)" },
			"50%": { transform: "translate(40px, 20px)" },
		},
		"@keyframes floatOrb3": {
			"0%, 100%": { transform: "translate(0px, 0px)" },
			"50%": { transform: "translate(-35px, -30px)" },
		},
		"@keyframes floatOrb4": {
			"0%, 100%": { transform: "translate(0px, 0px)" },
			"50%": { transform: "translate(20px, 45px)" },
		},
		"@keyframes floatOrb5": {
			"0%, 100%": { transform: "translate(0px, 0px)" },
			"50%": { transform: "translate(-40px, -20px)" },
		},
	},
	root: {
		height: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "linear-gradient(-45deg, #1a0033, #4A00E0, #8E2DE2, #3a0077)",
		backgroundSize: "400% 400%",
		animation: "$gradientShift 15s ease infinite",
		position: "relative",
		fontFamily: "'Poppins', sans-serif",
	},
	paper: {
		padding: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		backdropFilter: "blur(20px)",
		WebkitBackdropFilter: "blur(20px)",
		borderRadius: "28px",
		boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
		border: "1px solid rgba(255, 255, 255, 0.15)",
		width: "100%",
		maxWidth: "420px",
		margin: theme.spacing(2),
		animation: "$fadeInUp 0.8s ease-out",
		position: "relative",
		zIndex: 1,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		padding: "14px",
		fontSize: "1rem",
		fontWeight: 700,
		fontFamily: "'Poppins', sans-serif",
		borderRadius: "14px",
		background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
		color: "white",
		boxShadow: "0 4px 14px rgba(142, 45, 226, 0.4)",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		textTransform: "none",
		letterSpacing: "0.5px",
		animation: "$pulseGlow 3s ease-in-out infinite",
		"&:hover": {
			background: "linear-gradient(135deg, #9f44f0, #5a10f0)",
			boxShadow: "0 8px 25px rgba(142, 45, 226, 0.6)",
			transform: "translateY(-2px)",
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
		maxWidth: "150px",
		marginBottom: "4px",
		filter: "drop-shadow(0 4px 12px rgba(142, 45, 226, 0.3))",
		transition: "transform 0.4s ease",
		"&:hover": {
			transform: "scale(1.05)",
		},
	},
	logoInfo: {
		marginTop: theme.spacing(1),
		textAlign: "center",
	},
	title: {
		fontWeight: 800,
		fontSize: "1.8rem",
		letterSpacing: "-0.5px",
		fontFamily: "'Poppins', sans-serif",
		color: "#fff",
		marginBottom: "4px",
		textAlign: "center",
		textShadow: "0 2px 10px rgba(142, 45, 226, 0.3)",
	},
	subtitle: {
		fontWeight: 300,
		fontFamily: "'Poppins', sans-serif",
		color: "rgba(255, 255, 255, 0.6)",
		fontSize: "0.9rem",
		letterSpacing: "0.3px",
	},
	textFieldWrapper: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "14px",
			backgroundColor: "rgba(255,255,255,0.06)",
			color: "#fff",
			fontFamily: "'Poppins', sans-serif",
			transition: "all 0.3s ease",
			"&:hover": {
				backgroundColor: "rgba(255,255,255,0.1)",
			},
			"& fieldset": {
				borderColor: "rgba(255,255,255,0.15)",
				transition: "border-color 0.3s ease",
			},
			"&.Mui-focused": {
				backgroundColor: "rgba(255,255,255,0.1)",
				"& fieldset": {
					borderColor: "#8E2DE2",
					borderWidth: "2px",
				},
			},
		},
		"& .MuiInputLabel-outlined": {
			color: "rgba(255,255,255,0.5)",
			fontFamily: "'Poppins', sans-serif",
			fontWeight: 400,
			"&.Mui-focused": {
				color: "#c084fc",
			},
		},
		"& .MuiInputAdornment-root .MuiSvgIcon-root": {
			color: "rgba(255,255,255,0.4)",
			transition: "color 0.3s ease",
		},
		"& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
			color: "#c084fc",
		},
	},
	forgotPasswordLink: {
		color: "rgba(255,255,255,0.5)",
		textDecoration: "none",
		fontFamily: "'Poppins', sans-serif",
		fontSize: "0.8rem",
		fontWeight: 400,
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#c084fc",
			textDecoration: "none",
		}
	},
	registerLink: {
		color: "#c084fc",
		fontWeight: 600,
		fontFamily: "'Poppins', sans-serif",
		textDecoration: "none",
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#e0b0ff",
			textDecoration: "none",
		}
	},
	divider: {
		display: "flex",
		alignItems: "center",
		margin: theme.spacing(2, 0, 1),
		"& span": {
			color: "rgba(255,255,255,0.3)",
			fontSize: "0.75rem",
			fontFamily: "'Poppins', sans-serif",
			padding: "0 12px",
			fontWeight: 400,
		},
		"&::before, &::after": {
			content: '""',
			flex: 1,
			height: "1px",
			background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
		},
	},
	showPasswordBtn: {
		color: "rgba(255,255,255,0.4)",
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#c084fc",
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
			<FloatingOrbs />

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

					{viewregister === "enabled" && (
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
