import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import StoreIcon from '@material-ui/icons/Store';
import CallIcon from "@material-ui/icons/Call";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';

import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";

import ButtonWithSpinner from "../../components/ButtonWithSpinner";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";
import { AuthContext } from "../../context/Auth/AuthContext";
import { SocketContext } from "../../context/Socket/SocketContext";
import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import { isEmpty } from "lodash";
import moment from "moment";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import { ChatsUser } from "./ChartsUser";
import { ChartsDate } from "./ChartsDate";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  alignRight: {
    textAlign: "right",
  },
  fullWidth: {
    width: "100%",
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();
  const socketManager = useContext(SocketContext);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time Update via Socket
  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-ticket`, (data) => {
      if (data.action === "update" || data.action === "create") {
        fetchData(false); // No loading spinner for background updates
      }
    });

    socket.on(`company-${companyId}-contact`, (data) => {
      if (data.action === "update" || data.action === "create") {
        fetchData(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);


  async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData(showLoading = true) {
    if (showLoading) setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Configure el filtro");
      if (showLoading) setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    if (showLoading) setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };

  function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Fecha Inicial"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Fecha Final"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl className={classes.selectContainer}>
            <InputLabel id="period-selector-label">Período</InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
            >
              <MenuItem value={0}>Ninguno seleccionado</MenuItem>
              <MenuItem value={3}>Últimos 3 días</MenuItem>
              <MenuItem value={7}>Últimos 7 días</MenuItem>
              <MenuItem value={15}>Últimos 15 días</MenuItem>
              <MenuItem value={30}>Últimos 30 días</MenuItem>
              <MenuItem value={60}>Últimos 60 días</MenuItem>
              <MenuItem value={90}>Últimos 90 días</MenuItem>
            </Select>
            <FormHelperText>Seleccione el período deseado</FormHelperText>
          </FormControl>
        </Grid>
      );
    }
  }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justifyContent="flex-end">

          {/* FILTROS */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.selectContainer}>
              <InputLabel id="period-selector-label">Tipo de Filtro</InputLabel>
              <Select
                labelId="period-selector-label"
                value={filterType}
                onChange={(e) => handleChangeFilterType(e.target.value)}
              >
                <MenuItem value={1}>Filtro por Fecha</MenuItem>
                <MenuItem value={2}>Filtro por Período</MenuItem>
              </Select>
              <FormHelperText>Seleccione el filtro deseado</FormHelperText>
            </FormControl>
          </Grid>

          {renderFilters()}

          {/* BOTON FILTRAR */}
          <Grid item xs={12} className={classes.alignRight}>
            <ButtonWithSpinner
              loading={loading}
              onClick={() => fetchData(true)}
              variant="contained"
              color="primary"
            >
              Filtrar
            </ButtonWithSpinner>
          </Grid>

          {/* DASHBOARD CARDS */}

          {/* CONEXIONES */}
          {user.super && (
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Conexiones Activas"
                value={counters.totalWhatsappSessions}
                icon={<MobileFriendlyIcon />}
                loading={loading}
              />
            </Grid>
          )}

          {/* EMPRESAS */}
          {user.super && (
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Empresas"
                value={counters.totalCompanies}
                icon={<StoreIcon />}
                loading={loading}
              />
            </Grid>
          )}

          {/* EM ATENDIMENTO */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="En Conversación"
              value={counters.supportHappening}
              icon={<CallIcon />}
              loading={loading}
            />
          </Grid>

          {/* AGUARDANDO */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Esperando"
              value={counters.supportPending}
              icon={<HourglassEmptyIcon />}
              loading={loading}
            />
          </Grid>

          {/* FINALIZADOS */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Finalizados"
              value={counters.supportFinished}
              icon={<CheckCircleIcon />}
              loading={loading}
            />
          </Grid>

          {/* NOVOS CONTATOS */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Nuevos Contactos"
              value={GetContacts(true)}
              icon={<GroupAddIcon />}
              loading={loading}
            />
          </Grid>

          {/* T.M. DE ATENDIMENTO */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="T.M. de Conversación"
              value={formatTime(counters.avgSupportTime)}
              icon={<AccessAlarmIcon />}
              loading={loading}
            />
          </Grid>

          {/* T.M. DE ESPERA */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="T.M. de Espera"
              value={formatTime(counters.avgWaitTime)}
              icon={<TimerIcon />}
              loading={loading}
            />
          </Grid>

          {/* USUARIOS ONLINE */}
          <Grid item xs={12}>
            {attendants.length ? (
              <TableAttendantsStatus
                attendants={attendants}
                loading={loading}
              />
            ) : null}
          </Grid>

          {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper2}>
              <ChatsUser />
            </Paper>
          </Grid>

          {/* TOTAL DE ATENDIMENTOS */}
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper2}>
              <ChartsDate />
            </Paper>
          </Grid>

        </Grid>
      </Container >
    </div >
  );
};

export default Dashboard;
