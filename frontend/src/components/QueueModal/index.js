import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { head } from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { AttachFile, Colorize, DeleteOutline } from "@material-ui/icons";
import { QueueOptions } from "../QueueOptions";
import SchedulesForm from "../SchedulesForm";
import ConfirmationModal from "../ConfirmationModal";
import UserAssignment from "./UserAssignment";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
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
  colorAdorment: {
    width: 20,
    height: 20,
  },
}));

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
  greetingMessage: Yup.string(),
});

const QueueModal = ({ open, onClose, queueId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    color: "",
    greetingMessage: "",
    outOfHoursMessage: "",
    orderQueue: "",
    integrationId: "",
    promptId: ""
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const [tab, setTab] = useState(0);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [autoAssignUsers, setAutoAssignUsers] = useState([]);
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(false);
  const [assignOffline, setAssignOffline] = useState(false);

  const attachmentFile = useRef(null);
  const greetingRef = useRef();

  const [integrations, setIntegrations] = useState([]);
  const [queueEditable, setQueueEditable] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [schedules, setSchedules] = useState([
    { weekday: "Segunda-feira", weekdayEn: "monday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Terça-feira", weekdayEn: "tuesday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Quarta-feira", weekdayEn: "wednesday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Quinta-feira", weekdayEn: "thursday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Sexta-feira", weekdayEn: "friday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Sábado", weekdayEn: "saturday", startTime: "08:00", endTime: "12:00", },
    { weekday: "Domingo", weekdayEn: "sunday", startTime: "00:00", endTime: "00:00", },
  ]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/prompt");
        setPrompts(data.prompts);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    api.get(`/settings`).then(({ data }) => {
      if (Array.isArray(data)) {
        const scheduleType = data.find((d) => d.key === "scheduleType");
        if (scheduleType) {
          setSchedulesEnabled(scheduleType.value === "queue");
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queueIntegration");
        setIntegrations(data.queueIntegrations);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue((prevState) => {
          return { ...prevState, ...data };
        });
        data.promptId ? setSelectedPrompt(data.promptId) : setSelectedPrompt(null);
        setSchedules(data.schedules);

        // Fetch users to see which ones are assigned to this queue
        // As queue return usually doesn't include full user list, we will need to refetch users or rely on a property if backend supports it.
        // For now, let's assume valid API doesn't return user list inside queue easily, we'll fetch all users in the UserAssignment component
        // But we need to know which ones are SELECTED.
        // For now, initialize selectedUsers empty or fetch real data if backend supports.
        // Implementation Note: Since standard Baileys API might not return this, we might need to fetch /users and filter.
        // IMPROVEMENT: Fetch users and filter those who have this queueId in their queue list.
        const usersResponse = await api.get("/users");
        const users = usersResponse.data.users;
        const assignedUserIds = users
          .filter(u => u.queues && u.queues.some(q => q.id === queueId))
          .map(u => u.id);
        setSelectedUsers(assignedUserIds);

      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue(initialState);
      setSelectedUsers([]);
    };
  }, [queueId, open]);

  const handleClose = () => {
    onClose();
    setQueue(initialState);
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (queue.mediaPath) {
      await api.delete(`/queue/${queue.id}/media-upload`);
      setQueue((prev) => ({ ...prev, mediaPath: null, mediaName: null }));
      toast.success(i18n.t("queueModal.toasts.deleted"));
    }
  };

  const handleSaveQueue = async (values) => {
    try {
      let savedQueueId = queueId;

      const queueData = {
        ...values,
        schedules,
        promptId: selectedPrompt ? selectedPrompt : null
      };

      if (queueId) {
        await api.put(`/queue/${queueId}`, queueData);
      } else {
        const { data } = await api.post("/queue", queueData);
        savedQueueId = data.id;
      }

      // Handle Attachment
      if (attachment != null && savedQueueId) {
        const formData = new FormData();
        formData.append("file", attachment);
        await api.post(`/queue/${savedQueueId}/media-upload`, formData);
      }

      // Handle Users Assignment (Iterating over selectedUsers to update backend)
      // NOTE: This logic assumes we can update user queues from here. 
      // This is complex because we need to update each user. 
      // Optimisation: Backend should ideally support bulk update or queue should hold users.
      // But standard Whaticket does it by User -> Queues.

      // We will perform a "Best Effort" update on client side for now:
      // 1. Get all users.
      // 2. For each user:
      //    - If in selectedUsers AND logic says not in queue -> Add queue
      //    - If NOT in selectedUsers AND logic says in queue -> Remove queue
      // This is heavy on API calls (N users). A real backend endpoint /queue/:id/users would be better.
      // Considering constraints, we'll try to do it for ONLY the users changed if possible, or just all.
      // WARNING: This might be slow for many users.

      // Let's implement a safer, albeit slower approach for consistency:
      // Fetch all users first
      if (savedQueueId) {
        const { data } = await api.get("/users");
        const allUsers = data.users;

        for (const user of allUsers) {
          const shouldBeInQueue = selectedUsers.includes(user.id);
          const currentlyInQueue = user.queues && user.queues.some(q => q.id === savedQueueId);

          if (shouldBeInQueue !== currentlyInQueue) {
            // We need to update this user
            const currentQueueIds = user.queues ? user.queues.map(q => q.id) : [];
            let newQueueIds = [];

            if (shouldBeInQueue) {
              newQueueIds = [...currentQueueIds, savedQueueId];
            } else {
              newQueueIds = currentQueueIds.filter(id => id !== savedQueueId);
            }

            // Update User
            await api.put(`/users/${user.id}`, { queueIds: newQueueIds });
          }
        }
      }


      toast.success("Queue saved successfully");
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveSchedules = async (values) => {
    toast.success("Clique em salvar para registar as alterações");
    setSchedules(values);
    setTab(0);
  };

  const handleChangePrompt = (e) => {
    setSelectedPrompt(e.target.value);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("queueModal.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      />
      <Dialog
        maxWidth="md"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>
          {queueId
            ? `${i18n.t("queueModal.title.edit")}`
            : `${i18n.t("queueModal.title.add")}`}
        </DialogTitle>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
        >
          <Tab label="DEPARTAMENTO" />
          <Tab label="USUARIOS Y ASIGNACIÓN" />
          <Tab label="RESOLUCIÓN AUTOMÁTICA" />
          <Tab label="HORARIO DE ATENCIÓN" />
        </Tabs>

        <Formik
          initialValues={queue}
          enableReinitialize={true}
          validationSchema={QueueSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQueue(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers style={{ minHeight: "400px" }}>

                {/* TAB 0: DEPARTAMENTO */}
                {tab === 0 && (
                  <>
                    <Field
                      as={TextField}
                      label="Nombre"
                      autoFocus
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                      fullWidth
                    />
                    <Field
                      as={TextField}
                      label="Color"
                      name="color"
                      id="color"
                      onFocus={() => {
                        setColorPickerModalOpen(true);
                      }}
                      error={touched.color && Boolean(errors.color)}
                      helperText={touched.color && errors.color}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <div
                              style={{ backgroundColor: values.color }}
                              className={classes.colorAdorment}
                            ></div>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => setColorPickerModalOpen(true)}
                          >
                            <Colorize />
                          </IconButton>
                        ),
                      }}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                      fullWidth
                    />
                    <ColorPicker
                      open={colorPickerModalOpen}
                      handleClose={() => setColorPickerModalOpen(false)}
                      onChange={(color) => {
                        values.color = color;
                        setQueue((prev) => ({ ...prev, color }));
                      }}
                    />

                    <div style={{ marginTop: 20 }}>
                      <Field
                        as={TextField}
                        label="Mensaje de saludo del departamento"
                        type="greetingMessage"
                        multiline
                        inputRef={greetingRef}
                        rows={6}
                        fullWidth
                        name="greetingMessage"
                        error={touched.greetingMessage && Boolean(errors.greetingMessage)}
                        helperText={touched.greetingMessage && errors.greetingMessage}
                        variant="outlined"
                        margin="dense"
                      />
                    </div>
                  </>
                )}

                {/* TAB 1: USUARIOS Y ASIGNACIÓN */}
                {tab === 1 && (
                  <UserAssignment
                    queueId={queueId}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    autoAssignUsers={autoAssignUsers}
                    setAutoAssignUsers={setAutoAssignUsers}
                    autoAssignmentEnabled={autoAssignmentEnabled}
                    setAutoAssignmentEnabled={setAutoAssignmentEnabled}
                    assignOffline={assignOffline}
                    setAssignOffline={setAssignOffline}
                  />
                )}

                {/* TAB 2: RESOLUCIÓN AUTOMÁTICA */}
                {tab === 2 && (
                  <div>
                    <FormControl
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    >
                      <InputLabel>
                        {i18n.t("whatsappModal.form.prompt")}
                      </InputLabel>
                      <Select
                        labelId="dialog-select-prompt-label"
                        id="dialog-select-prompt"
                        name="promptId"
                        value={selectedPrompt || ""}
                        onChange={handleChangePrompt}
                        label={i18n.t("whatsappModal.form.prompt")}
                        fullWidth
                      >
                        <MenuItem value={""}>Nenhum</MenuItem>
                        {prompts.map((prompt) => (
                          <MenuItem
                            key={prompt.id}
                            value={prompt.id}
                          >
                            {prompt.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      style={{ marginTop: 15 }}
                    >
                      <InputLabel id="integrationId-selection-label">
                        {i18n.t("queueModal.form.integrationId")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("queueModal.form.integrationId")}
                        name="integrationId"
                        id="integrationId"
                        labelId="integrationId-selection-label"
                        value={values.integrationId || ""}
                      >
                        <MenuItem value={""} >{"Nenhum"}</MenuItem>
                        {integrations.map((integration) => (
                          <MenuItem key={integration.id} value={integration.id}>
                            {integration.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>

                    <div style={{ marginTop: 20 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Opciones del Bot
                      </Typography>
                      <QueueOptions queueId={queueId} />
                    </div>

                    <div style={{ marginTop: 20 }}>
                      {(queue.mediaPath || attachment) && (
                        <Grid xs={12} item>
                          <Button startIcon={<AttachFile />}>
                            {attachment != null
                              ? attachment.name
                              : queue.mediaName}
                          </Button>
                          {queueEditable && (
                            <IconButton
                              onClick={() => setConfirmationOpen(true)}
                              color="secondary"
                            >
                              <DeleteOutline />
                            </IconButton>
                          )}
                        </Grid>
                      )}
                      {!attachment && !queue.mediaPath && queueEditable && (
                        <Button
                          color="primary"
                          onClick={() => attachmentFile.current.click()}
                          disabled={isSubmitting}
                          variant="outlined"
                          startIcon={<AttachFile />}
                        >
                          {i18n.t("queueModal.buttons.attach")}
                        </Button>
                      )}
                      <div style={{ display: "none" }}>
                        <input
                          type="file"
                          ref={attachmentFile}
                          onChange={(e) => handleAttachmentFile(e)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: HORARIO */}
                {tab === 3 && (
                  <SchedulesForm
                    loading={false}
                    onSubmit={handleSaveSchedules}
                    initialValues={schedules}
                    labelSaveButton="Adicionar"
                  />
                )}

              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("queueModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {queueId
                    ? `${i18n.t("queueModal.buttons.okEdit")}`
                    : `${i18n.t("queueModal.buttons.okAdd")}`}
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

export default QueueModal;
