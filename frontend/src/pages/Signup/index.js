import React, { useState, useEffect } from "react";
import qs from 'query-string'

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from 'react-input-mask';
import api from "../../services/api";
import {
	MenuItem,
	Select,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";

import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import BusinessOutlinedIcon from "@material-ui/icons/BusinessOutlined";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import niaLogo from "../../assets/nia-logo.png";

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
		minHeight: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "#0f0b1a",
		position: "relative",
		fontFamily: "'Poppins', sans-serif",
		overflow: "hidden",
		padding: theme.spacing(3),
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
		maxWidth: "450px",
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
		marginBottom: theme.spacing(2),
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
	selectFieldWrapper: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "12px",
			backgroundColor: "#f8f7fc",
			color: "#1a1a2e",
			fontFamily: "'Poppins', sans-serif",
			"& fieldset": {
				borderColor: "#e8e5f0",
			},
			"&:hover fieldset": {
				borderColor: "#e8e5f0",
			},
			"&.Mui-focused": {
				backgroundColor: "#f0eef5",
				"& fieldset": {
					borderColor: "#7c3aed",
					borderWidth: "2px",
				},
			},
		},
		"& .MuiSelect-select": {
			paddingTop: "14px",
			paddingBottom: "14px",
			"&:focus": {
				backgroundColor: "transparent",
			}
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
	showPasswordBtn: {
		color: "#bbb",
		transition: "color 0.3s ease",
		"&:hover": {
			color: "#7c3aed",
			backgroundColor: "transparent",
		},
	},
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	const [allowregister, setallowregister] = useState('enabled');
	const [trial, settrial] = useState('3');
	const [showPassword, setShowPassword] = useState(false);
	let companyId = null;

	useEffect(() => {
		fetchallowregister();
		fetchtrial();
	}, []);

	const fetchtrial = async () => {
		try {
			const responsevvv = await api.get("/settings/trial");
			const allowtrialX = responsevvv.data.value;
			settrial(allowtrialX);
		} catch (error) {
			console.error('Error retrieving trial', error);
		}
	};

	const fetchallowregister = async () => {
		try {
			const responsevv = await api.get("/settings/allowregister");
			const allowregisterX = responsevv.data.value;
			setallowregister(allowregisterX);
		} catch (error) {
			console.error('Error retrieving allowregister', error);
		}
	};

	if (allowregister === "disabled") {
		history.push("/login");
	}

	const params = qs.parse(window.location.search)
	if (params.companyId !== undefined) {
		companyId = params.companyId
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "" };

	const [user] = useState(initialState);
	const dueDate = moment().add(trial, "day").format();

	const handleSignUp = async values => {
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [plans, setPlans] = useState([]);
	const { register: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, []);

	return (
		<div className={classes.root}>
			<CssBaseline />

			<div className={classes.paper}>
				<div className={classes.logoContainer}>
					<img className={classes.logoImg} src={niaLogo} alt="Nia CRM Logo" />
					<div className={classes.logoInfo}>
						<Typography component="h1" variant="h5" className={classes.title}>
							Regístrate
						</Typography>
						<Typography variant="body2" className={classes.subtitle}>
							Crea tu cuenta para comenzar
						</Typography>
					</div>
				</div>

				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSignUp(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form className={classes.form}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="name"
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										fullWidth
										id="name"
										label="Nombre de la Empresa"
										className={classes.textFieldWrapper}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<BusinessOutlinedIcon />
												</InputAdornment>
											),
										}}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										id="email"
										label={i18n.t("signup.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										autoComplete="email"
										required
										className={classes.textFieldWrapper}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<EmailOutlinedIcon />
												</InputAdornment>
											),
										}}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={InputMask}
										mask="(99) 99999-9999"
										variant="outlined"
										fullWidth
										id="phone"
										name="phone"
										error={touched.phone && Boolean(errors.phone)}
										helperText={touched.phone && errors.phone}
										autoComplete="phone"
										required
									>
										{({ field }) => (
											<TextField
												{...field}
												variant="outlined"
												fullWidth
												label="WhatsApp"
												inputProps={{ maxLength: 11 }}
												className={classes.textFieldWrapper}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<PhoneOutlinedIcon />
														</InputAdornment>
													),
												}}
											/>
										)}
									</Field>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										name="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										label={i18n.t("signup.form.password")}
										type={showPassword ? "text" : "password"}
										id="password"
										autoComplete="current-password"
										required
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
														{showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={Select}
										variant="outlined"
										fullWidth
										id="plan-selection"
										displayEmpty
										name="planId"
										required
										className={`${classes.textFieldWrapper} ${classes.selectFieldWrapper}`}
									>
										{plans.map((plan, key) => (
											<MenuItem key={key} value={plan.id}>
												{plan.name} - {plan.connections} WhatsApps - {plan.users} Usuarios - R$ {plan.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
											</MenuItem>
										))}
									</Field>
								</Grid>
							</Grid>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								className={classes.submit}
								endIcon={<ArrowForwardIcon />}
							>
								{i18n.t("signup.buttons.submit")}
							</Button>

							<Box display="flex" justifyContent="center" mt={1}>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/login"
									className={classes.registerLink}
									style={{ color: "#999", fontWeight: 400 }}
								>
									¿Ya tienes una cuenta? <span className={classes.registerLink}>¡Inicia sesión!</span>
								</Link>
							</Box>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignUp;
