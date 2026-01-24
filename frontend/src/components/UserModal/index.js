import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	CircularProgress,
	Select,
	InputLabel,
	MenuItem,
	FormControl,
	TextField,
	InputAdornment,
	IconButton,
} from '@material-ui/core';

import { Visibility, VisibilityOff, Person, VpnKey, FileCopy, Refresh } from '@material-ui/icons';

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},
	btnWrapper: {
		position: "relative",
	},
	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	dialogTitle: {
		color: "#2563eb",
		fontWeight: "bold",
		textAlign: "left", // Match screenshot
	},
	avatarContainer: {
		display: "flex",
		justifyContent: "center",
		marginBottom: theme.spacing(2),
	},
	avatarPlaceholder: {
		width: "100px",
		height: "100px",
		borderRadius: "50%",
		backgroundColor: "#bdbdbd",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "white",
	},
	avatarIcon: {
		width: "60px",
		height: "60px",
	},
	cancelButton: {
		color: "#e11d48", // Pink/Red text
		fontWeight: "bold",
	},
	addButton: {
		backgroundColor: "#2563eb",
		color: "white",
		borderRadius: "50px",
		fontWeight: "bold",
		padding: "8px 25px",
		"&:hover": {
			backgroundColor: "#1d4ed8",
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

const UserModal = ({ open, onClose, userId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		email: "",
		password: "",
		profile: "user",
		token: ""
	};

	const { user: loggedInUser } = useContext(AuthContext);

	const [user, setUser] = useState(initialState);
	const [selectedQueueIds, setSelectedQueueIds] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const { loading, whatsApps } = useWhatsApps();


	useEffect(() => {
		const fetchUser = async () => {
			if (!userId) return;
			try {
				const { data } = await api.get(`/users/${userId}`);
				setUser(prevState => {
					return { ...prevState, ...data };
				});
				const userQueueIds = data.queues?.map(queue => queue.id);
				setSelectedQueueIds(userQueueIds);
			} catch (err) {
				toastError(err);
			}
		};

		fetchUser();
	}, [userId, open]);

	const handleClose = () => {
		onClose();
		setUser(initialState);
	};

	const handleSaveUser = async values => {
		const userData = { ...values, queueIds: selectedQueueIds };
		try {
			if (userId) {
				await api.put(`/users/${userId}`, userData);
			} else {
				await api.post("/users", userData);
			}
			toast.success(i18n.t("userModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	const handleGenerateToken = async () => {
		try {
			const { data } = await api.post(`/users/${userId}/token`);
			setUser(prevState => ({ ...prevState, token: data.token }));
			toast.success("Token generado con éxito");
		} catch (err) {
			toastError(err);
		}
	};

	const handleCopyToken = () => {
		navigator.clipboard.writeText(user.token);
		toast.success("Token copiado al portapapeles");
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
				PaperProps={{
					style: { borderRadius: 15 }
				}}
			>
				<DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
					{userId
						? `${i18n.t("userModal.title.edit")}`
						: `${i18n.t("userModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveUser(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<div className={classes.avatarContainer}>
									<div className={classes.avatarPlaceholder}>
										<Person className={classes.avatarIcon} />
									</div>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("userModal.form.name")}
										autoFocus
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										margin="dense"
										fullWidth
										style={{ flex: 2 }} // Give more space to Name
										className={classes.textField}
										InputProps={{ style: { borderRadius: 8 } }}
									/>
									<FormControl
										variant="outlined"
										className={classes.formControl}
										margin="dense"
										style={{ flex: 1, marginTop: 8 }} // Align with text field
									>
										<Can
											role={loggedInUser.profile}
											perform="user-modal:editProfile"
											yes={() => (
												<>
													<InputLabel id="profile-selection-input-label">
														{i18n.t("userModal.form.profile")}
													</InputLabel>

													<Field
														as={Select}
														label={i18n.t("userModal.form.profile")}
														name="profile"
														labelId="profile-selection-label"
														id="profile-selection"
														required
													>
														<MenuItem value="admin">Admin</MenuItem>
														<MenuItem value="user">User</MenuItem>
													</Field>
												</>
											)}
										/>
									</FormControl>
								</div>

								<Field
									as={TextField}
									label={i18n.t("userModal.form.email")}
									name="email"
									error={touched.email && Boolean(errors.email)}
									helperText={touched.email && errors.email}
									variant="outlined"
									margin="dense"
									fullWidth
									InputProps={{ style: { borderRadius: 8 } }}
								/>

								<Field
									as={TextField}
									name="password"
									variant="outlined"
									margin="dense"
									fullWidth
									label={i18n.t("userModal.form.password")}
									error={touched.password && Boolean(errors.password)}
									helperText={touched.password && errors.password}
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										style: { borderRadius: 8 },
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={() => setShowPassword((e) => !e)}
												>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										)
									}}
								/>

								<Can
									role={loggedInUser.profile}
									perform="user-modal:editQueues"
									yes={() => (
										<QueueSelect
											selectedQueueIds={selectedQueueIds}
											onChange={values => setSelectedQueueIds(values)}
											title="Departamentos"
										/>
									)}
								/>

								{userId && (
									<div style={{ marginTop: 20, padding: 15, backgroundColor: "#f5f5f5", borderRadius: 10 }}>
										<div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
											<VpnKey style={{ marginRight: 10, color: "#555" }} />
											<span style={{ fontWeight: "bold", color: "#555" }}>API Token (Permanente)</span>
										</div>

										<div style={{ display: "flex", gap: 10 }}>
											<TextField
												value={user.token || "No generado"}
												variant="outlined"
												margin="dense"
												fullWidth
												disabled
												InputProps={{
													style: { backgroundColor: "#fff" }
												}}
											/>
											{user.token && (
												<Button
													variant="outlined"
													color="primary"
													onClick={handleCopyToken}
													style={{ minWidth: 50 }}
												>
													<FileCopy />
												</Button>
											)}
											<Button
												variant="contained"
												color="primary"
												onClick={handleGenerateToken}
												style={{ minWidth: 50 }}
												title="Generar nuevo token"
											>
												<Refresh />
											</Button>
										</div>
										<div style={{ fontSize: 12, color: "#777", marginTop: 5 }}>
											Usa este token en n8n como: <b>Bearer {user.token ? user.token.substring(0, 10) + "..." : "TOKEN"}</b>
										</div>
									</div>
								)}






							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									className={classes.cancelButton}
									disabled={isSubmitting}
								>
									{i18n.t("userModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}
									variant="contained"
									className={classes.addButton}
								>
									{userId
										? `${i18n.t("userModal.buttons.okEdit")}`
										: `${i18n.t("userModal.buttons.okAdd")}`}
									{isSubmitting && (
										<CircularProgress
											size={24}
											className={classes.buttonProgress}
										/>
									)}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default UserModal;
