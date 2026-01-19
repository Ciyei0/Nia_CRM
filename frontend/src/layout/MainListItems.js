import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Badge } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import PeopleIcon from "@material-ui/icons/People";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RotateRight from "@material-ui/icons/RotateRight";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import { SocketContext } from "../context/Socket/SocketContext";
import { isArray } from "lodash";
import api from "../services/api";
import toastError from "../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { AllInclusive, AttachFile, DeviceHubOutlined, Schedule } from '@material-ui/icons';
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";
import useVersion from "../hooks/useVersion";

const useStyles = makeStyles((theme) => ({
  sidebarContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  logoutButton: {
    borderRadius: 8,
    margin: '8px 12px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#b71c1c',
    },
  },
  menuItem: {
    borderRadius: 8,
    margin: '2px 12px',
    paddingTop: 8,
    paddingBottom: 8,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.mode === 'light' ? 'rgba(21, 101, 192, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    },
  },
  menuIcon: {
    minWidth: 40,
    color: theme.mode === 'light' ? '#555' : '#90CAF9',
  },
  menuText: {
    '& .MuiListItemText-primary': {
      fontSize: '14px',
      fontWeight: 500,
      color: theme.mode === 'light' ? '#333' : '#fff',
    },
  },
  versionText: {
    fontSize: '11px',
    padding: '12px 24px',
    textAlign: 'center',
    color: theme.mode === 'light' ? '#999' : '#666',
  },
  divider: {
    margin: '8px 16px',
  },
  connectionWarning: {
    color: '#d32f2f',
    fontSize: '8px',
    marginLeft: 4,
  },
}));


function ListItemLink(props) {
  const { icon, primary, to, badge } = props;
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button dense component={renderLink} className={classes.menuItem}>
        <ListItemIcon className={classes.menuIcon}>
          {badge ? badge : icon}
        </ListItemIcon>
        <ListItemText primary={primary} className={classes.menuText} />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, collapsed } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);

  const history = useHistory();

  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const { getPlanCompany } = usePlans();

  const { getVersion } = useVersion();
  const [version, setVersion] = useState(false);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchVersion() {
      const _version = await getVersion();
      setVersion(_version.version);
    }
    fetchVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    handleLogout();
  };

  return (
    <div onClick={drawerClose} className={classes.sidebarContainer}>

      {/* Chats */}
      <ListItemLink
        to="/tickets"
        primary="Chats"
        icon={<WhatsAppIcon />}
      />

      {/* Conexiones */}
      <ListItemLink
        to="/connections"
        primary="Conexiones"
        badge={
          <Badge badgeContent={connectionWarning ? "●" : 0} color="error">
            <SyncAltIcon />
          </Badge>
        }
      />

      {/* Contactos */}
      <ListItemLink
        to="/contacts"
        primary="Contactos"
        icon={<ContactPhoneOutlinedIcon />}
      />

      {/* Etiquetas */}
      <ListItemLink
        to="/tags"
        primary="Etiquetas"
        icon={<LocalOfferIcon />}
      />

      {/* Respuestas Rápidas */}
      <ListItemLink
        to="/quick-messages"
        primary="Respuestas Rápidas"
        icon={<FlashOnIcon />}
      />



      {/* Soporte / Ayuda */}
      <ListItemLink
        to="/helps"
        primary="Soporte"
        icon={<HelpOutlineIcon />}
      />

      {/* OpenAI / IA */}
      {showOpenAi && (
        <ListItemLink
          to="/prompts"
          primary="NIA IA (BETA)"
          icon={<AllInclusive />}
        />
      )}

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            {/* Equipo / Usuarios */}
            <ListItemLink
              to="/users"
              primary="Equipo"
              icon={<PeopleAltOutlinedIcon />}
            />

            {/* Departamentos & Chatbots */}
            {/* Departamentos & Chatbots */}
            <ListItemLink
              to="/queues"
              primary="Departamentos & Chatbots"
              icon={<AccountTreeOutlinedIcon />}
            />

            {/* Integraciones */}
            {showIntegrations && (
              <ListItemLink
                to="/queue-integration"
                primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                icon={<DeviceHubOutlined />}
              />
            )}

            {/* Campañas */}
            {showCampaigns && (
              <ListItemLink
                to="/campaigns"
                primary="Campañas"
                icon={<EventAvailableIcon />}
              />
            )}

            {/* Suscripción / Financiero */}
            <ListItemLink
              to="/financeiro"
              primary="Suscripción"
              icon={<LocalAtmIcon />}
            />

            {/* Informes / Dashboard */}
            <ListItemLink
              to="/"
              primary="Informes"
              icon={<AssessmentIcon />}
            />

            {/* Configuración */}
            <ListItemLink
              to="/settings"
              primary="Configuración"
              icon={<SettingsOutlinedIcon />}
            />
          </>
        )}
      />

      {/* Divider y Logout */}
      <Divider className={classes.divider} />

      {!collapsed && (
        <Typography className={classes.versionText}>
          NIA CRM v{version}
        </Typography>
      )}

      <li>
        <ListItem
          button
          dense
          onClick={handleClickLogout}
          className={classes.logoutButton}
        >
          <ListItemIcon style={{ minWidth: 40, color: '#fff' }}>
            <RotateRight />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </li>
    </div>
  );
};

export default MainListItems;
