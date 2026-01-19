import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";
import { toast } from "react-toastify";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.text.secondary
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    height: "100%",
  },
  settingControl: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  settingDescription: {
    flex: 1,
    marginRight: theme.spacing(2),
  }
}));

const Settings = () => {
  const classes = useStyles();

  const [settings, setSettings] = useState([]);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-settings`, (data) => {
      if (data.action === "update") {
        setSettings((prevState) => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex((s) => s.key === data.setting.key);
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleChangeSetting = async (e) => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = (key) => {
    const { value } = settings.find((s) => s.key === key);
    return value;
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          {i18n.t("settings.title")}
        </Typography>

        {/* Section: General */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Gestión General
        </Typography>

        <Grid container spacing={3}>
          {/* Card: User Register */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <div className={classes.settingControl}>
                <div className={classes.settingDescription}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    {i18n.t("settings.settings.userCreation.name")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Habilitar o deshabilitar el registro de nuevos usuarios en la plataforma.
                  </Typography>
                </div>
                <FormControl variant="outlined" margin="dense">
                  <Select
                    native
                    id="userCreation-setting"
                    name="userCreation"
                    value={
                      settings && settings.length > 0 && getSettingValue("userCreation")
                    }
                    onChange={handleChangeSetting}
                  >
                    <option value="enabled">
                      {i18n.t("settings.settings.userCreation.options.enabled")}
                    </option>
                    <option value="disabled">
                      {i18n.t("settings.settings.userCreation.options.disabled")}
                    </option>
                  </Select>
                </FormControl>
              </div>
            </Paper>
          </Grid>

          {/* Example Card for Future Expansion */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper} style={{ opacity: 0.6 }}>
              <div className={classes.settingControl}>
                <div className={classes.settingDescription}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    Información de la Empresa
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Configurar detalles de la organización (Próximamente)
                  </Typography>
                </div>
                {/* Placeholder control */}
              </div>
            </Paper>
          </Grid>
        </Grid>


        {/* Section: Security (Placeholder for visual structure) */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Seguridad
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{ opacity: 0.6 }}>
              <Typography variant="body2" color="textSecondary">
                Configuraciones de seguridad avanzadas estarán disponibles aquí.
              </Typography>
            </Paper>
          </Grid>
        </Grid>


      </Container>
    </div>
  );
};

export default Settings;
