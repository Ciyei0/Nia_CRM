import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SyncIcon from "@material-ui/icons/Sync";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import ErrorIcon from "@material-ui/icons/Error";
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Chip,
    Tooltip,
    CircularProgress,
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import WhatsappTemplateDialog from "../../components/WhatsappTemplateDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { isArray } from "lodash";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";

const reducer = (state, action) => {
    if (action.type === "LOAD_TEMPLATES") {
        const templates = action.payload;
        const newTemplates = [];

        if (isArray(templates)) {
            templates.forEach((template) => {
                const templateIndex = state.findIndex((t) => t.id === template.id);
                if (templateIndex !== -1) {
                    state[templateIndex] = template;
                } else {
                    newTemplates.push(template);
                }
            });
        }

        return [...state, ...newTemplates];
    }

    if (action.type === "UPDATE_TEMPLATE") {
        const template = action.payload;
        const templateIndex = state.findIndex((t) => t.id === template.id);

        if (templateIndex !== -1) {
            state[templateIndex] = template;
            return [...state];
        } else {
            return [template, ...state];
        }
    }

    if (action.type === "DELETE_TEMPLATE") {
        const templateId = action.payload;
        const templateIndex = state.findIndex((t) => t.id === templateId);
        if (templateIndex !== -1) {
            state.splice(templateIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }

    return state;
};

const useStyles = makeStyles((theme) => ({
    mainPaper: {
        flex: 1,
        padding: theme.spacing(1),
        overflowY: "scroll",
        ...theme.scrollbarStyles,
    },
    statusChip: {
        marginLeft: 8,
    },
    approvedChip: {
        backgroundColor: "#4caf50",
        color: "#fff",
    },
    pendingChip: {
        backgroundColor: "#ff9800",
        color: "#fff",
    },
    rejectedChip: {
        backgroundColor: "#f44336",
        color: "#fff",
    },
    pausedChip: {
        backgroundColor: "#9e9e9e",
        color: "#fff",
    },
    syncButton: {
        marginLeft: theme.spacing(1),
    },
    categoryChip: {
        fontSize: "0.75rem",
    },
}));

const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
        case "APPROVED":
            return <CheckCircleIcon style={{ color: "#4caf50" }} />;
        case "PENDING":
            return <HourglassEmptyIcon style={{ color: "#ff9800" }} />;
        case "REJECTED":
        case "FAILED":
            return <ErrorIcon style={{ color: "#f44336" }} />;
        case "PAUSED":
            return <WarningIcon style={{ color: "#9e9e9e" }} />;
        default:
            return <HourglassEmptyIcon style={{ color: "#ff9800" }} />;
    }
};

const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
        case "APPROVED":
            return "Aprobada";
        case "PENDING":
            return "Pendiente";
        case "REJECTED":
            return "Rechazada";
        case "FAILED":
            return "Error";
        case "PAUSED":
            return "Pausada";
        default:
            return status || "Pendiente";
    }
};

const getCategoryLabel = (category) => {
    switch (category?.toUpperCase()) {
        case "MARKETING":
            return "Marketing";
        case "UTILITY":
            return "Utilidad";
        case "AUTHENTICATION":
            return "Autenticación";
        default:
            return category || "";
    }
};

const WhatsappTemplates = () => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [deletingTemplate, setDeletingTemplate] = useState(null);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [selectedWhatsappId, setSelectedWhatsappId] = useState("");
    const [templates, dispatch] = useReducer(reducer, []);
    const [cloudWhatsapps, setCloudWhatsapps] = useState([]);

    const { user } = useContext(AuthContext);
    const { whatsApps } = useContext(WhatsAppsContext);
    const socketManager = useContext(SocketContext);

    // Filter to only show Cloud API connections
    useEffect(() => {
        const filtered = whatsApps.filter(
            (w) => w.facebookAccessToken && w.whatsappAccountId
        );
        setCloudWhatsapps(filtered);
    }, [whatsApps]);

    useEffect(() => {
        dispatch({ type: "RESET" });
    }, [searchParam, selectedWhatsappId]);

    useEffect(() => {
        setLoading(true);
        fetchTemplates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam, selectedWhatsappId]);

    useEffect(() => {
        const companyId = user.companyId;
        const socket = socketManager.getSocket(companyId);

        socket.on(`company${companyId}-whatsapptemplate`, (data) => {
            if (data.action === "create" || data.action === "update") {
                dispatch({ type: "UPDATE_TEMPLATE", payload: data.template });
            }
            if (data.action === "delete") {
                dispatch({ type: "DELETE_TEMPLATE", payload: +data.id });
            }
            if (data.action === "sync") {
                fetchTemplates();
            }
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketManager, user.companyId]);

    const fetchTemplates = async () => {
        try {
            const params = {};
            if (selectedWhatsappId) {
                params.whatsappId = selectedWhatsappId;
            }

            const { data } = await api.get("/whatsapp-templates", { params });
            dispatch({ type: "LOAD_TEMPLATES", payload: data.templates });
            setLoading(false);
        } catch (err) {
            toastError(err);
            setLoading(false);
        }
    };

    const handleOpenTemplateDialog = () => {
        setSelectedTemplate(null);
        setTemplateModalOpen(true);
    };

    const handleCloseTemplateDialog = () => {
        setSelectedTemplate(null);
        setTemplateModalOpen(false);
        fetchTemplates();
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
            await api.delete(`/whatsapp-templates/${templateId}`);
            toast.success("Plantilla eliminada");
            dispatch({ type: "RESET" });
            fetchTemplates();
        } catch (err) {
            toastError(err);
        }
        setDeletingTemplate(null);
    };

    const handleSync = async () => {
        if (!selectedWhatsappId) {
            toast.warning("Selecciona una conexión para sincronizar");
            return;
        }

        setSyncing(true);
        try {
            const { data } = await api.post("/whatsapp-templates/sync", {
                whatsappId: selectedWhatsappId,
            });
            toast.success(
                `Sincronizado: ${data.synced} actualizadas, ${data.created} nuevas`
            );
            dispatch({ type: "RESET" });
            fetchTemplates();
        } catch (err) {
            toastError(err);
        }
        setSyncing(false);
    };

    const filteredTemplates = templates.filter((t) =>
        t.name?.toLowerCase().includes(searchParam.toLowerCase())
    );

    return (
        <MainContainer>
            <ConfirmationModal
                title={
                    deletingTemplate &&
                    `¿Eliminar plantilla "${deletingTemplate.name}"?`
                }
                open={confirmModalOpen}
                onClose={setConfirmModalOpen}
                onConfirm={() => handleDeleteTemplate(deletingTemplate.id)}
            >
                Esta acción eliminará la plantilla tanto localmente como en Meta.
            </ConfirmationModal>

            <WhatsappTemplateDialog
                open={templateModalOpen}
                onClose={handleCloseTemplateDialog}
                templateId={selectedTemplate?.id}
                whatsapps={cloudWhatsapps}
            />

            <MainHeader>
                <Grid style={{ width: "99.6%" }} container spacing={2}>
                    <Grid xs={12} sm={4} item>
                        <Title>Plantillas de WhatsApp</Title>
                    </Grid>
                    <Grid xs={12} sm={8} item>
                        <Grid spacing={2} container justifyContent="flex-end">
                            <Grid xs={12} sm={3} item>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>Conexión</InputLabel>
                                    <Select
                                        value={selectedWhatsappId}
                                        onChange={(e) => setSelectedWhatsappId(e.target.value)}
                                        label="Conexión"
                                    >
                                        <MenuItem value="">Todas</MenuItem>
                                        {cloudWhatsapps.map((w) => (
                                            <MenuItem key={w.id} value={w.id}>
                                                {w.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} sm={3} item>
                                <TextField
                                    fullWidth
                                    placeholder="Buscar..."
                                    size="small"
                                    variant="outlined"
                                    value={searchParam}
                                    onChange={handleSearch}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon style={{ color: "gray" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid xs={6} sm={2} item>
                                <Tooltip title="Sincronizar con Meta">
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleSync}
                                        disabled={syncing || !selectedWhatsappId}
                                        startIcon={
                                            syncing ? <CircularProgress size={20} /> : <SyncIcon />
                                        }
                                    >
                                        Sync
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid xs={6} sm={2} item>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenTemplateDialog}
                                    disabled={cloudWhatsapps.length === 0}
                                >
                                    Nueva
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MainHeader>

            {cloudWhatsapps.length === 0 && (
                <Paper style={{ padding: 16, marginBottom: 16 }}>
                    <strong>⚠️ No tienes conexiones Cloud API configuradas.</strong>
                    <p>
                        Para usar plantillas oficiales de WhatsApp necesitas configurar una
                        conexión con Facebook Access Token y WhatsApp Business Account ID.
                    </p>
                </Paper>
            )}

            <Paper className={classes.mainPaper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="center">Categoría</TableCell>
                            <TableCell align="center">Idioma</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Conexión</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTemplates.map((template) => (
                            <TableRow key={template.id}>
                                <TableCell>{template.name}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        size="small"
                                        label={getCategoryLabel(template.category)}
                                        className={classes.categoryChip}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {template.language?.toUpperCase()}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        size="small"
                                        label={getStatusLabel(template.status)}
                                        style={{
                                            backgroundColor:
                                                template.status?.toUpperCase() === "APPROVED"
                                                    ? "#4caf50"
                                                    : template.status?.toUpperCase() === "PENDING"
                                                        ? "#ff9800"
                                                        : template.status?.toUpperCase() === "REJECTED"
                                                            ? "#f44336"
                                                            : "#9e9e9e",
                                            color: "#fff",
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {template.whatsapp?.name || "-"}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setSelectedTemplate(template);
                                            setTemplateModalOpen(true);
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setConfirmModalOpen(true);
                                            setDeletingTemplate(template);
                                        }}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {loading && <TableRowSkeleton columns={6} />}
                    </TableBody>
                </Table>
            </Paper>
        </MainContainer>
    );
};

export default WhatsappTemplates;
