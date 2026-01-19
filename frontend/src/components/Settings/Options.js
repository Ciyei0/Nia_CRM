import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Title from "../Title";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import useSettings from "../../hooks/useSettings";
import { ToastContainer, toast } from 'react-toastify';
import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { Tabs, Tab, Divider } from "@material-ui/core";
import OnlyForSuperUser from '../../components/OnlyForSuperUser';
import useAuth from '../../hooks/useAuth.js';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  sectionTitle: {
    color: theme.palette.text.secondary,
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  cardPaper: {
    padding: theme.spacing(3),
    height: '100%',
    transition: "box-shadow 0.3s",
    "&:hover": {
      boxShadow: theme.shadows[4],
    }
  },
  fieldContainer: {
    marginBottom: theme.spacing(3),
    "&:last-child": {
      marginBottom: 0,
    }
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
}));

export default function Options(props) {
  const { settings, scheduleTypeChanged } = props;
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState({});
  const { getCurrentUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function findData() {
      setLoading(true);
      try {
        const user = await getCurrentUserInfo();
        setCurrentUser(user);
      } catch (e) {
        toast.error(e);
      }
      setLoading(false);
    }
    findData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSuper = () => {
    return currentUser.super;
  };

  const [userRating, setUserRating] = useState("disabled");
  const [scheduleType, setScheduleType] = useState("disabled");
  const [callType, setCallType] = useState("enabled");
  const [chatbotType, setChatbotType] = useState("");
  const [CheckMsgIsGroup, setCheckMsgIsGroupType] = useState("enabled");

  const [loadingUserRating, setLoadingUserRating] = useState(false);
  const [loadingScheduleType, setLoadingScheduleType] = useState(false);
  const [loadingCallType, setLoadingCallType] = useState(false);
  const [loadingChatbotType, setLoadingChatbotType] = useState(false);
  const [loadingCheckMsgIsGroup, setCheckMsgIsGroup] = useState(false);


  const [ipixcType, setIpIxcType] = useState("");
  const [loadingIpIxcType, setLoadingIpIxcType] = useState(false);
  const [tokenixcType, setTokenIxcType] = useState("");
  const [loadingTokenIxcType, setLoadingTokenIxcType] = useState(false);

  const [ipmkauthType, setIpMkauthType] = useState("");
  const [loadingIpMkauthType, setLoadingIpMkauthType] = useState(false);
  const [clientidmkauthType, setClientIdMkauthType] = useState("");
  const [loadingClientIdMkauthType, setLoadingClientIdMkauthType] = useState(false);
  const [clientsecretmkauthType, setClientSecrectMkauthType] = useState("");
  const [loadingClientSecrectMkauthType, setLoadingClientSecrectMkauthType] = useState(false);

  const [asaasType, setAsaasType] = useState("");
  const [loadingAsaasType, setLoadingAsaasType] = useState(false);

  const [trial, settrial] = useState('3');
  const [loadingtrial, setLoadingtrial] = useState(false);

  const [viewregister, setviewregister] = useState('disabled');
  const [loadingviewregister, setLoadingviewregister] = useState(false);

  const [allowregister, setallowregister] = useState('disabled');
  const [loadingallowregister, setLoadingallowregister] = useState(false);

  const [SendGreetingAccepted, setSendGreetingAccepted] = useState("disabled");
  const [loadingSendGreetingAccepted, setLoadingSendGreetingAccepted] = useState(false);

  const [SettingsTransfTicket, setSettingsTransfTicket] = useState("disabled");
  const [loadingSettingsTransfTicket, setLoadingSettingsTransfTicket] = useState(false);

  const [sendGreetingMessageOneQueues, setSendGreetingMessageOneQueues] = useState("disabled");
  const [loadingSendGreetingMessageOneQueues, setLoadingSendGreetingMessageOneQueues] = useState(false);

  const { update } = useSettings();

  useEffect(() => {
    if (Array.isArray(settings) && settings.length) {
      const userRating = settings.find((s) => s.key === "userRating");
      if (userRating) {
        setUserRating(userRating.value);
      }
      const scheduleType = settings.find((s) => s.key === "scheduleType");
      if (scheduleType) {
        setScheduleType(scheduleType.value);
      }
      const callType = settings.find((s) => s.key === "call");
      if (callType) {
        setCallType(callType.value);
      }
      const CheckMsgIsGroup = settings.find((s) => s.key === "CheckMsgIsGroup");
      if (CheckMsgIsGroup) {
        setCheckMsgIsGroupType(CheckMsgIsGroup.value);
      }

      const allowregister = settings.find((s) => s.key === 'allowregister');
      if (allowregister) {
        setallowregister(allowregister.value);
      }

      const SendGreetingAccepted = settings.find((s) => s.key === "sendGreetingAccepted");
      if (SendGreetingAccepted) {
        setSendGreetingAccepted(SendGreetingAccepted.value);
      }

      const SettingsTransfTicket = settings.find((s) => s.key === "sendMsgTransfTicket");
      if (SettingsTransfTicket) {
        setSettingsTransfTicket(SettingsTransfTicket.value);
      }

      const viewregister = settings.find((s) => s.key === 'viewregister');
      if (viewregister) {
        setviewregister(viewregister.value);
      }

      const sendGreetingMessageOneQueues = settings.find((s) => s.key === "sendGreetingMessageOneQueues");
      if (sendGreetingMessageOneQueues) {
        setSendGreetingMessageOneQueues(sendGreetingMessageOneQueues.value)
      }

      const chatbotType = settings.find((s) => s.key === "chatBotType");
      if (chatbotType) {
        setChatbotType(chatbotType.value);
      }

      const trial = settings.find((s) => s.key === 'trial');
      if (trial) {
        settrial(trial.value);
      }

      const ipixcType = settings.find((s) => s.key === "ipixc");
      if (ipixcType) {
        setIpIxcType(ipixcType.value);
      }

      const tokenixcType = settings.find((s) => s.key === "tokenixc");
      if (tokenixcType) {
        setTokenIxcType(tokenixcType.value);
      }

      const ipmkauthType = settings.find((s) => s.key === "ipmkauth");
      if (ipmkauthType) {
        setIpMkauthType(ipmkauthType.value);
      }

      const clientidmkauthType = settings.find((s) => s.key === "clientidmkauth");
      if (clientidmkauthType) {
        setClientIdMkauthType(clientidmkauthType.value);
      }

      const clientsecretmkauthType = settings.find((s) => s.key === "clientsecretmkauth");
      if (clientsecretmkauthType) {
        setClientSecrectMkauthType(clientsecretmkauthType.value);
      }

      const asaasType = settings.find((s) => s.key === "asaas");
      if (asaasType) {
        setAsaasType(asaasType.value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  async function handleChangeUserRating(value) {
    setUserRating(value);
    setLoadingUserRating(true);
    await update({
      key: "userRating",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingUserRating(false);
  }

  async function handleallowregister(value) {
    setallowregister(value);
    setLoadingallowregister(true);
    await update({
      key: 'allowregister',
      value,
    });
    toast.success('Operação atualizada com sucesso.');
    setLoadingallowregister(false);
  }

  async function handleSendGreetingMessageOneQueues(value) {
    setSendGreetingMessageOneQueues(value);
    setLoadingSendGreetingMessageOneQueues(true);
    await update({
      key: "sendGreetingMessageOneQueues",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingSendGreetingMessageOneQueues(false);
  }

  async function handleviewregister(value) {
    setviewregister(value);
    setLoadingviewregister(true);
    await update({
      key: 'viewregister',
      value,
    });
    toast.success('Operação atualizada com sucesso.');
    setLoadingviewregister(false);
  }

  async function handletrial(value) {
    settrial(value);
    setLoadingtrial(true);
    await update({
      key: 'trial',
      value,
    });
    toast.success('Operação atualizada com sucesso.');
    setLoadingtrial(false);
  }


  async function handleScheduleType(value) {
    setScheduleType(value);
    setLoadingScheduleType(true);
    await update({
      key: "scheduleType",
      value,
    });
    toast.success('Operação atualizada com sucesso.');
    setLoadingScheduleType(false);
    if (typeof scheduleTypeChanged === "function") {
      scheduleTypeChanged(value);
    }
  }

  async function handleCallType(value) {
    setCallType(value);
    setLoadingCallType(true);
    await update({
      key: "call",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingCallType(false);
  }

  async function handleChatbotType(value) {
    setChatbotType(value);
    setLoadingChatbotType(true);
    await update({
      key: "chatBotType",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingChatbotType(false);
  }

  async function handleGroupType(value) {
    setCheckMsgIsGroupType(value);
    setCheckMsgIsGroup(true);
    await update({
      key: "CheckMsgIsGroup",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setCheckMsgIsGroupType(false);
  }

  async function handleSendGreetingAccepted(value) {
    setSendGreetingAccepted(value);
    setLoadingSendGreetingAccepted(true);
    await update({
      key: "sendGreetingAccepted",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingSendGreetingAccepted(false);
  }

  async function handleSettingsTransfTicket(value) {
    setSettingsTransfTicket(value);
    setLoadingSettingsTransfTicket(true);
    await update({
      key: "sendMsgTransfTicket",
      value,
    });

    toast.success("Operação atualizada com sucesso.");
    setLoadingSettingsTransfTicket(false);
  }

  async function handleChangeIPIxc(value) {
    setIpIxcType(value);
    setLoadingIpIxcType(true);
    await update({
      key: "ipixc",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingIpIxcType(false);
  }

  async function handleChangeTokenIxc(value) {
    setTokenIxcType(value);
    setLoadingTokenIxcType(true);
    await update({
      key: "tokenixc",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingTokenIxcType(false);
  }

  async function handleChangeIpMkauth(value) {
    setIpMkauthType(value);
    setLoadingIpMkauthType(true);
    await update({
      key: "ipmkauth",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingIpMkauthType(false);
  }

  async function handleChangeClientIdMkauth(value) {
    setClientIdMkauthType(value);
    setLoadingClientIdMkauthType(true);
    await update({
      key: "clientidmkauth",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingClientIdMkauthType(false);
  }

  async function handleChangeClientSecrectMkauth(value) {
    setClientSecrectMkauthType(value);
    setLoadingClientSecrectMkauthType(true);
    await update({
      key: "clientsecretmkauth",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingClientSecrectMkauthType(false);
  }

  async function handleChangeAsaas(value) {
    setAsaasType(value);
    setLoadingAsaasType(true);
    await update({
      key: "asaas",
      value,
    });
    toast.success("Operação atualizada com sucesso.");
    setLoadingAsaasType(false);
  }

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Gestión de Atención
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper className={classes.cardPaper}>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="ratings-label">Evaluaciones de Usuarios</InputLabel>
                <Select
                  labelId="ratings-label"
                  value={userRating}
                  onChange={async (e) => {
                    handleChangeUserRating(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>Deshabilitadas</MenuItem>
                  <MenuItem value={"enabled"}>Habilitadas</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingUserRating && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>

            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="schedule-type-label">
                  Gestión de Expediente
                </InputLabel>
                <Select
                  labelId="schedule-type-label"
                  value={scheduleType}
                  onChange={async (e) => {
                    handleScheduleType(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>Deshabilitado</MenuItem>
                  <MenuItem value={"queue"}>Fila (Departamento)</MenuItem>
                  <MenuItem value={"company"}>Empresa</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingScheduleType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper className={classes.cardPaper}>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="group-type-label">
                  Ignorar Mensajes de Grupo
                </InputLabel>
                <Select
                  labelId="group-type-label"
                  value={CheckMsgIsGroup}
                  onChange={async (e) => {
                    handleGroupType(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>No</MenuItem>
                  <MenuItem value={"enabled"}>Sí</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingScheduleType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>

            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="call-type-label">
                  Aceptar Llamadas
                </InputLabel>
                <Select
                  labelId="call-type-label"
                  value={callType}
                  onChange={async (e) => {
                    handleCallType(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>No Aceptar</MenuItem>
                  <MenuItem value={"enabled"}>Aceptar</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingCallType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper className={classes.cardPaper}>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="chatbot-type-label">
                  Tipo de Chatbot
                </InputLabel>
                <Select
                  labelId="chatbot-type-label"
                  value={chatbotType}
                  onChange={async (e) => {
                    handleChatbotType(e.target.value);
                  }}
                >
                  <MenuItem value={"text"}>Texto</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingChatbotType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" className={classes.sectionTitle}>
        Mensajes y Saludos
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.cardPaper}>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="sendGreetingAccepted-label">Enviar saludo al aceptar ticket</InputLabel>
                <Select
                  labelId="sendGreetingAccepted-label"
                  value={SendGreetingAccepted}
                  onChange={async (e) => {
                    handleSendGreetingAccepted(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>Deshabilitado</MenuItem>
                  <MenuItem value={"enabled"}>Habilitado</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingSendGreetingAccepted && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>

            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="sendMsgTransfTicket-label">Mensaje de transferencia (Fila/Agente)</InputLabel>
                <Select
                  labelId="sendMsgTransfTicket-label"
                  value={SettingsTransfTicket}
                  onChange={async (e) => {
                    handleSettingsTransfTicket(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>Deshabilitado</MenuItem>
                  <MenuItem value={"enabled"}>Habilitado</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingSettingsTransfTicket && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.cardPaper}>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <InputLabel id="sendGreetingMessageOneQueues-label">Enviar saludo si solo hay 1 fila</InputLabel>
                <Select
                  labelId="sendGreetingMessageOneQueues-label"
                  value={sendGreetingMessageOneQueues}
                  onChange={async (e) => {
                    handleSendGreetingMessageOneQueues(e.target.value);
                  }}
                >
                  <MenuItem value={"disabled"}>Deshabilitado</MenuItem>
                  <MenuItem value={"enabled"}>Habilitado</MenuItem>
                </Select>
                <FormHelperText>
                  {loadingSendGreetingMessageOneQueues && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>
      </Grid>

      <OnlyForSuperUser
        user={currentUser}
        yes={() => (
          <>
            <Typography variant="h6" className={classes.sectionTitle}>
              Configuración Global (Super Admin)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <Paper className={classes.cardPaper}>
                  <div className={classes.fieldContainer}>
                    <FormControl className={classes.selectContainer}>
                      <InputLabel id='allowregister-label'>
                        Registro Permitido (Signup)
                      </InputLabel>
                      <Select
                        labelId='allowregister-label'
                        value={allowregister}
                        onChange={async (e) => {
                          handleallowregister(e.target.value);
                        }}
                      >
                        <MenuItem value={'disabled'}>No</MenuItem>
                        <MenuItem value={'enabled'}>Sí</MenuItem>
                      </Select>
                      <FormHelperText>
                        {loadingallowregister && 'Atualizando...'}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Paper className={classes.cardPaper}>
                  <div className={classes.fieldContainer}>
                    <FormControl className={classes.selectContainer}>
                      <InputLabel id='viewregister-label'>
                        Botón de Registro Visible
                      </InputLabel>
                      <Select
                        labelId='viewregister-label'
                        value={viewregister}
                        onChange={async (e) => {
                          handleviewregister(e.target.value);
                        }}
                      >
                        <MenuItem value={'disabled'}>No</MenuItem>
                        <MenuItem value={'enabled'}>Sí</MenuItem>
                      </Select>
                      <FormHelperText>
                        {loadingviewregister && 'Atualizando...'}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Paper className={classes.cardPaper}>
                  <div className={classes.fieldContainer}>
                    <FormControl className={classes.selectContainer}>
                      <InputLabel id='trial-label'>Días de Prueba (Trial)</InputLabel>
                      <Select
                        labelId='trial-label'
                        value={trial}
                        onChange={async (e) => {
                          handletrial(e.target.value);
                        }}
                      >
                        <MenuItem value={'1'}>1</MenuItem>
                        <MenuItem value={'2'}>2</MenuItem>
                        <MenuItem value={'3'}>3</MenuItem>
                        <MenuItem value={'4'}>4</MenuItem>
                        <MenuItem value={'5'}>5</MenuItem>
                        <MenuItem value={'6'}>6</MenuItem>
                        <MenuItem value={'7'}>7</MenuItem>
                      </Select>
                      <FormHelperText>
                        {loadingtrial && 'Atualizando...'}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      />

      <Typography variant="h6" className={classes.sectionTitle}>
        Integraciones
      </Typography>
      <Grid container spacing={3}>
        {/* IXC Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper className={classes.cardPaper}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>IXC Soft</Typography>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <TextField
                  id="ipixc"
                  name="ipixc"
                  margin="dense"
                  label="IP del IXC"
                  variant="outlined"
                  value={ipixcType}
                  onChange={async (e) => {
                    handleChangeIPIxc(e.target.value);
                  }}
                  fullWidth
                />
                <FormHelperText>
                  {loadingIpIxcType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <TextField
                  id="tokenixc"
                  name="tokenixc"
                  margin="dense"
                  label="Token del IXC"
                  variant="outlined"
                  value={tokenixcType}
                  onChange={async (e) => {
                    handleChangeTokenIxc(e.target.value);
                  }}
                  fullWidth
                />
                <FormHelperText>
                  {loadingTokenIxcType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>

        {/* MK-AUTH Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper className={classes.cardPaper}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>MK-AUTH</Typography>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <TextField
                  id="ipmkauth"
                  name="ipmkauth"
                  margin="dense"
                  label="IP MK-AUTH"
                  variant="outlined"
                  value={ipmkauthType}
                  onChange={async (e) => {
                    handleChangeIpMkauth(e.target.value);
                  }}
                  fullWidth
                />
              </FormControl>
            </div>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <TextField
                  id="clientidmkauth"
                  name="clientidmkauth"
                  margin="dense"
                  label="Client ID"
                  variant="outlined"
                  value={clientidmkauthType}
                  onChange={async (e) => {
                    handleChangeClientIdMkauth(e.target.value);
                  }}
                  fullWidth
                />
              </FormControl>
            </div>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <TextField
                  id="clientsecretmkauth"
                  name="clientsecretmkauth"
                  margin="dense"
                  label="Client Secret"
                  variant="outlined"
                  value={clientsecretmkauthType}
                  onChange={async (e) => {
                    handleChangeClientSecrectMkauth(e.target.value);
                  }}
                  fullWidth
                />
              </FormControl>
            </div>
          </Paper>
        </Grid>

        {/* ASAAS Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper className={classes.cardPaper}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>ASAAS</Typography>
            <div className={classes.fieldContainer}>
              <FormControl className={classes.selectContainer}>
                <TextField
                  id="asaas"
                  name="asaas"
                  margin="dense"
                  label="Token ASAAS"
                  variant="outlined"
                  value={asaasType}
                  onChange={async (e) => {
                    handleChangeAsaas(e.target.value);
                  }}
                  fullWidth
                />
                <FormHelperText>
                  {loadingAsaasType && "Atualizando..."}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
        </Grid>
      </Grid>

    </>
  );
}