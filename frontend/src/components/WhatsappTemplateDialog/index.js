import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Typography,
    Paper,
    Divider,
    IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    previewPaper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        backgroundColor: "#e5ddd5",
        borderRadius: 8,
    },
    previewBubble: {
        backgroundColor: "#dcf8c6",
        padding: theme.spacing(1.5),
        borderRadius: 8,
        maxWidth: 300,
    },
    previewHeader: {
        fontWeight: "bold",
        marginBottom: 8,
        color: "#075e54",
    },
    previewBody: {
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
    },
    previewFooter: {
        fontSize: "0.75rem",
        color: "#667781",
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: theme.spacing(1),
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
    },
    buttonChip: {
        backgroundColor: "#fff",
        border: "1px solid #25d366",
        color: "#25d366",
        padding: "4px 12px",
        borderRadius: 16,
        fontSize: "0.8rem",
    },
    sectionTitle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        fontWeight: 600,
        color: theme.palette.text.secondary,
    },
    variableHint: {
        fontSize: "0.75rem",
        color: theme.palette.text.secondary,
        marginTop: 4,
    },
}));

const templateSchema = Yup.object().shape({
    name: Yup.string()
        .required("Nombre requerido")
        .matches(/^[a-z0-9_]+$/, "Solo letras minúsculas, números y guiones bajos"),
    category: Yup.string().required("Categoría requerida"),
    language: Yup.string().required("Idioma requerido"),
    bodyText: Yup.string().required("Texto del cuerpo requerido"),
    whatsappId: Yup.number().required("Conexión requerida"),
});

const initialValues = {
    name: "",
    category: "MARKETING",
    language: "es",
    headerType: "NONE",
    headerContent: "",
    bodyText: "",
    footerText: "",
    whatsappId: "",
    buttons: [],
};

const WhatsappTemplateDialog = ({ open, onClose, templateId, whatsapps }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState(initialValues);

    useEffect(() => {
        if (open) {
            setTemplate(initialValues);
        }
    }, [open]);

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!templateId) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/whatsapp-templates/${templateId}`);
                setTemplate({
                    ...data,
                    buttons: data.buttons ? JSON.parse(data.buttons) : [],
                });
            } catch (err) {
                toastError(err);
            }
            setLoading(false);
        };
        fetchTemplate();
    }, [templateId]);

    const handleClose = () => {
        setTemplate(initialValues);
        onClose();
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                ...values,
                buttons: values.buttons.length > 0 ? values.buttons : undefined,
            };

            await api.post("/whatsapp-templates", payload);
            toast.success("Plantilla creada y enviada a Meta para aprobación");
            handleClose();
        } catch (err) {
            toastError(err);
        }
        setSubmitting(false);
    };

    const addButton = (values, setFieldValue) => {
        if (values.buttons.length >= 3) {
            toast.warning("Máximo 3 botones permitidos");
            return;
        }
        setFieldValue("buttons", [
            ...values.buttons,
            { type: "QUICK_REPLY", text: "" },
        ]);
    };

    const removeButton = (index, values, setFieldValue) => {
        const newButtons = values.buttons.filter((_, i) => i !== index);
        setFieldValue("buttons", newButtons);
    };

    const updateButton = (index, field, value, values, setFieldValue) => {
        const newButtons = [...values.buttons];
        newButtons[index] = { ...newButtons[index], [field]: value };
        setFieldValue("buttons", newButtons);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <DialogTitle>
                {templateId ? "Ver Plantilla" : "Nueva Plantilla de WhatsApp"}
            </DialogTitle>
            <Formik
                initialValues={template}
                enableReinitialize
                validationSchema={templateSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                    <Form>
                        <DialogContent dividers>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: 40 }}>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <Grid container spacing={2}>
                                    {/* Left Column - Form */}
                                    <Grid item xs={12} md={7}>
                                        <Grid container spacing={2}>
                                            {/* WhatsApp Connection */}
                                            <Grid item xs={12}>
                                                <FormControl
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    error={touched.whatsappId && !!errors.whatsappId}
                                                >
                                                    <InputLabel>Conexión WhatsApp *</InputLabel>
                                                    <Select
                                                        value={values.whatsappId}
                                                        onChange={(e) =>
                                                            setFieldValue("whatsappId", e.target.value)
                                                        }
                                                        label="Conexión WhatsApp *"
                                                        disabled={!!templateId}
                                                    >
                                                        {whatsapps.map((w) => (
                                                            <MenuItem key={w.id} value={w.id}>
                                                                {w.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Template Name */}
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="name"
                                                    label="Nombre de Plantilla *"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    disabled={!!templateId}
                                                    error={touched.name && !!errors.name}
                                                    helperText={touched.name && errors.name}
                                                />
                                                <Typography className={classes.variableHint}>
                                                    Solo minúsculas, números y _ (ej: saludo_inicial)
                                                </Typography>
                                            </Grid>

                                            {/* Category */}
                                            <Grid item xs={12} sm={3}>
                                                <FormControl fullWidth variant="outlined" size="small">
                                                    <InputLabel>Categoría *</InputLabel>
                                                    <Select
                                                        value={values.category}
                                                        onChange={(e) =>
                                                            setFieldValue("category", e.target.value)
                                                        }
                                                        label="Categoría *"
                                                        disabled={!!templateId}
                                                    >
                                                        <MenuItem value="MARKETING">Marketing</MenuItem>
                                                        <MenuItem value="UTILITY">Utilidad</MenuItem>
                                                        <MenuItem value="AUTHENTICATION">
                                                            Autenticación
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Language */}
                                            <Grid item xs={12} sm={3}>
                                                <FormControl fullWidth variant="outlined" size="small">
                                                    <InputLabel>Idioma *</InputLabel>
                                                    <Select
                                                        value={values.language}
                                                        onChange={(e) =>
                                                            setFieldValue("language", e.target.value)
                                                        }
                                                        label="Idioma *"
                                                        disabled={!!templateId}
                                                    >
                                                        <MenuItem value="es">Español</MenuItem>
                                                        <MenuItem value="en">Inglés</MenuItem>
                                                        <MenuItem value="pt_BR">Portugués</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>

                                            {/* Header Type */}
                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth variant="outlined" size="small">
                                                    <InputLabel>Encabezado</InputLabel>
                                                    <Select
                                                        value={values.headerType}
                                                        onChange={(e) =>
                                                            setFieldValue("headerType", e.target.value)
                                                        }
                                                        label="Encabezado"
                                                        disabled={!!templateId}
                                                    >
                                                        <MenuItem value="NONE">Sin encabezado</MenuItem>
                                                        <MenuItem value="TEXT">Texto</MenuItem>
                                                        <MenuItem value="IMAGE">Imagen</MenuItem>
                                                        <MenuItem value="VIDEO">Video</MenuItem>
                                                        <MenuItem value="DOCUMENT">Documento</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Header Content */}
                                            {values.headerType !== "NONE" && (
                                                <Grid item xs={12} sm={8}>
                                                    <Field
                                                        as={TextField}
                                                        name="headerContent"
                                                        label={
                                                            values.headerType === "TEXT"
                                                                ? "Texto del encabezado"
                                                                : "URL del archivo"
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={!!templateId}
                                                    />
                                                </Grid>
                                            )}

                                            {/* Body Text */}
                                            <Grid item xs={12}>
                                                <Field
                                                    as={TextField}
                                                    name="bodyText"
                                                    label="Texto del cuerpo *"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    disabled={!!templateId}
                                                    error={touched.bodyText && !!errors.bodyText}
                                                    helperText={touched.bodyText && errors.bodyText}
                                                />
                                                <Typography className={classes.variableHint}>
                                                    Usa {"{{1}}"}, {"{{2}}"}, etc. para variables
                                                    dinámicas
                                                </Typography>
                                            </Grid>

                                            {/* Footer */}
                                            <Grid item xs={12}>
                                                <Field
                                                    as={TextField}
                                                    name="footerText"
                                                    label="Pie de página (opcional)"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    disabled={!!templateId}
                                                />
                                            </Grid>

                                            {/* Buttons Section */}
                                            <Grid item xs={12}>
                                                <Typography className={classes.sectionTitle}>
                                                    Botones (opcional, máx. 3)
                                                </Typography>
                                                {values.buttons.map((btn, index) => (
                                                    <Grid
                                                        container
                                                        spacing={1}
                                                        key={index}
                                                        style={{ marginBottom: 8 }}
                                                    >
                                                        <Grid item xs={4}>
                                                            <FormControl
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            >
                                                                <InputLabel>Tipo</InputLabel>
                                                                <Select
                                                                    value={btn.type}
                                                                    onChange={(e) =>
                                                                        updateButton(
                                                                            index,
                                                                            "type",
                                                                            e.target.value,
                                                                            values,
                                                                            setFieldValue
                                                                        )
                                                                    }
                                                                    label="Tipo"
                                                                    disabled={!!templateId}
                                                                >
                                                                    <MenuItem value="QUICK_REPLY">
                                                                        Respuesta rápida
                                                                    </MenuItem>
                                                                    <MenuItem value="URL">URL</MenuItem>
                                                                    <MenuItem value="PHONE_NUMBER">
                                                                        Teléfono
                                                                    </MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={btn.type === "QUICK_REPLY" ? 7 : 4}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                label="Texto"
                                                                value={btn.text || ""}
                                                                onChange={(e) =>
                                                                    updateButton(
                                                                        index,
                                                                        "text",
                                                                        e.target.value,
                                                                        values,
                                                                        setFieldValue
                                                                    )
                                                                }
                                                                disabled={!!templateId}
                                                            />
                                                        </Grid>
                                                        {btn.type === "URL" && (
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    label="URL"
                                                                    value={btn.url || ""}
                                                                    onChange={(e) =>
                                                                        updateButton(
                                                                            index,
                                                                            "url",
                                                                            e.target.value,
                                                                            values,
                                                                            setFieldValue
                                                                        )
                                                                    }
                                                                    disabled={!!templateId}
                                                                />
                                                            </Grid>
                                                        )}
                                                        {btn.type === "PHONE_NUMBER" && (
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    label="Teléfono"
                                                                    value={btn.phone_number || ""}
                                                                    onChange={(e) =>
                                                                        updateButton(
                                                                            index,
                                                                            "phone_number",
                                                                            e.target.value,
                                                                            values,
                                                                            setFieldValue
                                                                        )
                                                                    }
                                                                    disabled={!!templateId}
                                                                />
                                                            </Grid>
                                                        )}
                                                        {!templateId && (
                                                            <Grid item xs={1}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        removeButton(index, values, setFieldValue)
                                                                    }
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                ))}
                                                {!templateId && values.buttons.length < 3 && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<AddIcon />}
                                                        onClick={() => addButton(values, setFieldValue)}
                                                    >
                                                        Agregar botón
                                                    </Button>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Right Column - Preview */}
                                    <Grid item xs={12} md={5}>
                                        <Typography className={classes.sectionTitle}>
                                            Vista previa
                                        </Typography>
                                        <Paper className={classes.previewPaper}>
                                            <div className={classes.previewBubble}>
                                                {values.headerType === "TEXT" &&
                                                    values.headerContent && (
                                                        <div className={classes.previewHeader}>
                                                            {values.headerContent}
                                                        </div>
                                                    )}
                                                {values.headerType === "IMAGE" && (
                                                    <div
                                                        style={{
                                                            backgroundColor: "#ccc",
                                                            height: 100,
                                                            marginBottom: 8,
                                                            borderRadius: 4,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        📷 Imagen
                                                    </div>
                                                )}
                                                {values.headerType === "VIDEO" && (
                                                    <div
                                                        style={{
                                                            backgroundColor: "#ccc",
                                                            height: 100,
                                                            marginBottom: 8,
                                                            borderRadius: 4,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        🎥 Video
                                                    </div>
                                                )}
                                                {values.headerType === "DOCUMENT" && (
                                                    <div
                                                        style={{
                                                            backgroundColor: "#ccc",
                                                            height: 40,
                                                            marginBottom: 8,
                                                            borderRadius: 4,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        📄 Documento
                                                    </div>
                                                )}
                                                <div className={classes.previewBody}>
                                                    {values.bodyText || "El texto del mensaje aparecerá aquí..."}
                                                </div>
                                                {values.footerText && (
                                                    <div className={classes.previewFooter}>
                                                        {values.footerText}
                                                    </div>
                                                )}
                                            </div>
                                            {values.buttons.length > 0 && (
                                                <div className={classes.buttonContainer}>
                                                    {values.buttons.map((btn, i) => (
                                                        <span key={i} className={classes.buttonChip}>
                                                            {btn.text || `Botón ${i + 1}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">
                                Cancelar
                            </Button>
                            {!templateId && (
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <CircularProgress size={24} /> : "Crear Plantilla"}
                                </Button>
                            )}
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default WhatsappTemplateDialog;
