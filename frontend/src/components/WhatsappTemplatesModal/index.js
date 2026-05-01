import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Divider,
    IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 400,
    },
    templateList: {
        maxHeight: 400,
        overflowY: "auto",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
    },
    previewPaper: {
        padding: theme.spacing(2),
        backgroundColor: "#e5ddd5",
        borderRadius: 8,
        minHeight: 150,
    },
    previewBubble: {
        backgroundColor: "#dcf8c6",
        padding: theme.spacing(1.5),
        borderRadius: 8,
        maxWidth: "100%",
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
    },
    previewBody: {
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
    },
    variableInput: {
        marginTop: theme.spacing(2),
    },
    selectedListItem: {
        backgroundColor: theme.palette.action.selected,
    },
}));

const WhatsappTemplatesModal = ({ open, onClose, ticketId, whatsappId }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [variables, setVariables] = useState([]);

    useEffect(() => {
        if (open) {
            fetchTemplates();
        } else {
            setSelectedTemplate(null);
            setVariables([]);
            setSearchParam("");
        }
    }, [open, whatsappId]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/whatsapp-templates", {
                params: { whatsappId }
            });
            // Only show approved templates
            const approvedTemplates = data.templates.filter(t => t.status === "APPROVED");
            setTemplates(approvedTemplates);
        } catch (err) {
            toastError(err);
        }
        setLoading(false);
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        // Find variables {{1}}, {{2}}... in bodyText
        const variableMatches = template.bodyText.match(/\{\{\d+\}\}/g) || [];
        const uniqueVariables = [...new Set(variableMatches)];
        setVariables(new Array(uniqueVariables.length).fill(""));
    };

    const handleVariableChange = (index, value) => {
        const newVars = [...variables];
        newVars[index] = value;
        setVariables(newVars);
    };

    const handleSend = async () => {
        if (!selectedTemplate) return;
        setSending(true);
        try {
            await api.post(`/whatsapp-templates/${selectedTemplate.id}/send`, {
                ticketId,
                variables
            });
            toast.success("Plantilla enviada correctamente");
            onClose();
        } catch (err) {
            toastError(err);
        }
        setSending(true); // Wait for feedback before enabling
        setTimeout(() => setSending(false), 500);
    };

    const filteredTemplates = templates.filter(t => 
        t.name.toLowerCase().includes(searchParam.toLowerCase())
    );

    const renderPreview = () => {
        if (!selectedTemplate) return <Typography color="textSecondary">Selecciona una plantilla para ver la vista previa</Typography>;

        let body = selectedTemplate.bodyText;
        variables.forEach((v, i) => {
            const val = v || `{{${i + 1}}}`;
            body = body.replace(`{{${i + 1}}}`, val);
        });

        return (
            <div className={classes.previewBubble}>
                <div className={classes.previewBody}>{body}</div>
            </div>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Enviar Plantilla de WhatsApp</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Buscar plantilla..."
                            value={searchParam}
                            onChange={(e) => setSearchParam(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" fontSize="small" style={{ marginRight: 8 }} />
                            }}
                            style={{ marginBottom: 12 }}
                        />
                        <Paper className={classes.templateList} variant="outlined">
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                                    <CircularProgress size={24} />
                                </div>
                            ) : (
                                <List dense>
                                    {filteredTemplates.length === 0 ? (
                                        <ListItem><ListItemText primary="No se encontraron plantillas aprobadas" /></ListItem>
                                    ) : (
                                        filteredTemplates.map((t) => (
                                            <ListItem
                                                button
                                                key={t.id}
                                                selected={selectedTemplate?.id === t.id}
                                                onClick={() => handleSelectTemplate(t)}
                                            >
                                                <ListItemText 
                                                    primary={t.name} 
                                                    secondary={`${t.category} - ${t.language}`} 
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="subtitle2" gutterBottom>Vista Previa</Typography>
                        <Paper className={classes.previewPaper} variant="outlined">
                            {renderPreview()}
                        </Paper>

                        {selectedTemplate && variables.length > 0 && (
                            <div className={classes.variableInput}>
                                <Typography variant="subtitle2" gutterBottom>Variables</Typography>
                                <Grid container spacing={1}>
                                    {variables.map((v, i) => (
                                        <Grid item xs={12} key={i}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                label={`Variable {{${i + 1}}}`}
                                                value={v}
                                                onChange={(e) => handleVariableChange(i, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button
                    onClick={handleSend}
                    color="primary"
                    variant="contained"
                    disabled={!selectedTemplate || sending}
                    startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                >
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WhatsappTemplatesModal;
