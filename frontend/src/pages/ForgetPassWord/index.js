import React, { useState } from "react";
import qs from "query-string";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import { toast } from 'react-toastify';
import toastError from '../../errors/toastError';
import 'react-toastify/dist/ReactToastify.css';

import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";
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

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  let companyId = null;
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    if (showAdditionalFields) {
      setShowResetPasswordButton(false);
    } else {
      setShowResetPasswordButton(true);
    }
  };

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { email: "" };
  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();

  const handleSendEmail = async (values) => {
    const email = values.email;
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${email}`
      );
      if (response.data.status === 404) {
        toast.error("Correo no encontrado");
      } else {
        toast.success(i18n.t("¡Correo enviado con éxito!"));
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleResetPassword = async (values) => {
    const email = values.email;
    const token = values.token;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;

    if (newPassword === confirmPassword) {
      try {
        await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${email}/${token}/${newPassword}`
        );
        setError("");
        toast.success(i18n.t("Contraseña restablecida con éxito."));
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isResetPasswordButtonClicked = showResetPasswordButton;

  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Correo inválido").required("Campo requerido"),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
        .required("Campo requerido")
        .matches(
          passwordRegex,
          "Tu contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número."
        )
      : Yup.string(),
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Las contraseñas no coinciden")
        .required("Campo requerido"),
      otherwise: Yup.string(),
    }),
  });

  return (
    <div className={classes.root}>
      <CssBaseline />

      <div className={classes.paper}>
        <div className={classes.logoContainer}>
          <img className={classes.logoImg} src={niaLogo} alt="Nia CRM Logo" />
          <div className={classes.logoInfo}>
            <Typography component="h1" variant="h5" className={classes.title}>
              {i18n.t("Restablecer")}
            </Typography>
            <Typography variant="body2" className={classes.subtitle}>
              Ingresa los datos para recuperar tu cuenta
            </Typography>
          </div>
        </div>

        <Formik
          initialValues={{
            email: "",
            token: "",
            newPassword: "",
            confirmPassword: "",
          }}
          enableReinitialize={true}
          validationSchema={UserSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              if (showResetPasswordButton) {
                handleResetPassword(values);
              } else {
                handleSendEmail(values);
              }
              actions.setSubmitting(false);
              toggleAdditionalFields();
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label={i18n.t("signup.form.email")}
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                autoComplete="email"
                className={classes.textFieldWrapper}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {showAdditionalFields && (
                <>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="token"
                    label="Código de Verificación"
                    name="token"
                    error={touched.token && Boolean(errors.token)}
                    helperText={touched.token && errors.token}
                    autoComplete="off"
                    className={classes.textFieldWrapper}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    label="Nueva contraseña"
                    name="newPassword"
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                    autoComplete="off"
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
                            onClick={togglePasswordVisibility}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    autoComplete="off"
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
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              {showResetPasswordButton ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                  endIcon={<ArrowForwardIcon />}
                >
                  Restablecer Contraseña
                </Button>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                  endIcon={<ArrowForwardIcon />}
                >
                  Enviar Correo
                </Button>
              )}

              <Box display="flex" justifyContent="center" mt={1} mb={2}>
                <Link
                  href="#"
                  variant="body2"
                  component={RouterLink}
                  to="/login"
                  className={classes.registerLink}
                  style={{ color: "#999", fontWeight: 400 }}
                >
                  ¿Ya tienes cuenta? Iniciar Sesión
                </Link>
              </Box>

              <Box display="flex" justifyContent="center">
                <Link
                  href="#"
                  variant="body2"
                  component={RouterLink}
                  to="/signup"
                  className={classes.registerLink}
                >
                  {i18n.t("¿No tienes cuenta? ¡Regístrate!")}
                </Link>
              </Box>

              {error && (
                <Typography variant="body2" color="error" style={{ marginTop: '10px', textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;
