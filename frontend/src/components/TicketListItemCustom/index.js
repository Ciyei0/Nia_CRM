import React, { useContext, useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { format, isSameDay, parseISO } from "date-fns";
import { useHistory, useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { blue, green, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import { i18n } from "../../translate/i18n";

import { Chip, Tooltip } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";

import AndroidIcon from "@material-ui/icons/Android";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ContactTag from "../ContactTag";
import TicketMessagesDialog from "../TicketMessagesDialog";
import TransferTicketModalCustom from "../TransferTicketModalCustom";
import { getInitials } from "../../helpers/getInitials";
import { generateColor } from "../../helpers/colorGenerator";

const useStyles = makeStyles((theme) => ({
  ticket: {
    position: "relative",
    padding: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderBottom: `1px solid ${theme.palette.bordabox}`,
    '&:hover': {
        backgroundColor: "rgba(112, 0, 139, 0.03)",
    },
    '&.Mui-selected': {
        backgroundColor: "rgba(112, 0, 139, 0.05)",
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: "rgba(112, 0, 139, 0.08)",
        }
    }
  },

  pendingTicket: {
    cursor: "unset",
  },
  queueTag: {
    backgroundColor: "rgba(112, 0, 139, 0.08)",
    color: theme.palette.primary.main,
    marginRight: 4,
    padding: "2px 10px",
    fontWeight: 600,
    borderRadius: "12px",
    fontSize: "0.65rem",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  },
  noTicketsDiv: {
    display: "flex",
    height: "100px",
    margin: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  newMessagesCount: {
    alignSelf: "center",
    marginRight: 8,
    marginLeft: "auto",
    '& .MuiBadge-badge': {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        fontWeight: 700,
    }
  },
  noTicketsText: {
    textAlign: "center",
    color: theme.palette.secondary.main,
    fontSize: "14px",
    lineHeight: "1.4",
    fontFamily: "'Inter', sans-serif",
  },
  connectionTag: {
    backgroundColor: "rgba(0, 168, 132, 0.08)",
    color: "#00a884",
    marginRight: 4,
    padding: "2px 10px",
    fontWeight: 600,
    borderRadius: "12px",
    fontSize: "0.65rem",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  },
  noTicketsTitle: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0px",
    color: theme.palette.primary.main,
    fontFamily: "'Inter', sans-serif",
  },

  contactNameWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  lastMessageTime: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    color: theme.palette.secondary.main,
  },

  closedBadge: {
    marginLeft: "8px",
    '& .MuiBadge-badge': {
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        height: "18px",
        minWidth: "60px",
        borderRadius: "9999px",
    }
  },

  contactLastMessage: {
    paddingRight: 20,
    fontSize: "13px",
    color: theme.palette.secondary.main,
    lineHeight: 1.4,
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
  },


  badgeStyle: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },

  acceptButton: {
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: "12px",
    padding: "6px 16px",
    boxShadow: "none",
    '&:hover': {
        boxShadow: "0 4px 12px rgba(112, 0, 139, 0.2)",
    }
  },


  ticketQueueColor: {
    flex: "none",
    width: "4px",
    height: "100%",
    position: "absolute",
    top: "0%",
    left: "0%",
    zIndex: 1,
  },

  ticketInfo: {
    fontSize: "11px",
    color: theme.palette.secondary.main,
    fontWeight: 500,
  },
  secondaryContentSecond: {
    display: 'flex',
    alignItems: "center",
    flexWrap: "nowrap",
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  presence: {
    color: "#00a884",
    fontWeight: 700,
    fontSize: "13px",
    fontStyle: "italic",
    animation: "$pulse 1.5s infinite",
  },
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.5 },
    "100%": { opacity: 1 },
  },
  avatar: {
    width: "48px",
    height: "48px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  nameText: {
    fontWeight: 700,
    fontSize: "14px",
    color: theme.palette.dark.main,
  }
}));
{/*PLW DESIGN INSERIDO O dentro do const handleChangeTab*/ }
const TicketListItemCustom = ({ ticket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [ticketUser, setTicketUser] = useState(null);
  const [ticketQueueName, setTicketQueueName] = useState(null);
  const [ticketQueueColor, setTicketQueueColor] = useState(null);
  const [tag, setTag] = useState([]);
  const [whatsAppName, setWhatsAppName] = useState(null);
  const [lastInteractionLabel, setLastInteractionLabel] = useState('');
  const [openTicketMessageDialog, setOpenTicketMessageDialog] = useState(false);
  const { ticketId } = useParams();
  const isMounted = useRef(true);
  const { setCurrentTicket } = useContext(TicketsContext);
  const { user } = useContext(AuthContext);
  const [verpreview, setverpreview] = useState(false);
  const { profile } = user;
  const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);
  const presenceMessage = { composing: "Digitando...", recording: "Gravando..." };

  useEffect(() => {
    if (ticket.userId && ticket.user) {
      setTicketUser(ticket.user?.name?.toUpperCase());
    }
    setTicketQueueName(ticket.queue?.name?.toUpperCase());
    setTicketQueueColor(ticket.queue?.color);

    if (ticket.whatsappId && ticket.whatsapp) {
      setWhatsAppName(ticket.whatsapp.name?.toUpperCase());
    }

    setTag(ticket?.tags);

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  {/*CÓDIGO NOVO SAUDAÇÃO*/ }
  const handleCloseTicket = async (id) => {
    setTag(ticket?.tags);
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "closed",
        userId: user?.id,
        queueId: ticket?.queue?.id,
        useIntegration: false,
        promptId: null,
        integrationId: null
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/`);
  };

  useEffect(() => {
    const renderLastInteractionLabel = () => {
      let labelColor = '';
      let labelText = '';

      if (!ticket.lastMessage) return '';

      const lastInteractionDate = parseISO(ticket.updatedAt);
      const currentDate = new Date();
      const timeDifference = currentDate - lastInteractionDate;
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));


      if (minutesDifference >= 3 && minutesDifference <= 10) {
        labelText = `(${minutesDifference} m atrás)`;
        labelColor = 'green';
      } else if (minutesDifference >= 30 && minutesDifference < 60) {
        labelText = `(${minutesDifference} m atrás)`;
        labelColor = 'Orange';
      } else if (minutesDifference > 60 && hoursDifference < 24) {
        labelText = `(${hoursDifference} h atrás)`;
        labelColor = 'red';
      } else if (hoursDifference >= 24) {
        labelText = `(${Math.floor(hoursDifference / 24)} dias atrás)`;
        labelColor = 'red';
      }


      return { labelText, labelColor };
    };

    // Função para atualizar o estado do componente
    const updateLastInteractionLabel = () => {
      const { labelText, labelColor } = renderLastInteractionLabel();
      setLastInteractionLabel(
        <Badge
          className={classes.lastInteractionLabel}
          style={{ color: labelColor }}
        >
          {labelText}
        </Badge>
      );
      // Agendando a próxima atualização após 30 segundos
      setTimeout(updateLastInteractionLabel, 30 * 1000);
    };

    // Inicializando a primeira atualização
    updateLastInteractionLabel();

  }, [ticket]); // Executando apenas uma vez ao montar o componente

  const handleReopenTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "open",
        userId: user?.id,
        queueId: ticket?.queue?.id
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${ticket.uuid}`);
  };

  const handleAcepptTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "open",
        userId: user?.id,
      });

      let settingIndex;

      try {
        const { data } = await api.get("/settings/");

        settingIndex = data.filter((s) => s.key === "sendGreetingAccepted");

      } catch (err) {
        toastError(err);

      }

      if (settingIndex[0].value === "enabled" && !ticket.isGroup) {
        handleSendMessage(ticket.id);

      }

    } catch (err) {
      setLoading(false);

      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }

    // handleChangeTab(null, "tickets");
    // handleChangeTab(null, "open");
    history.push(`/tickets/${ticket.uuid}`);
  };

  const handleSendMessage = async (id) => {

    const msg = `{{ms}} *{{name}}*, meu nome é *${user?.name}* e agora vou prosseguir com seu atendimento!`;
    const message = {
      read: 1,
      fromMe: true,
      mediaUrl: "",
      body: `*Mensagem Automática:*\n${msg.trim()}`,
    };
    try {
      await api.post(`/messages/${id}`, message);
    } catch (err) {
      toastError(err);

    }
  };
  {/*CÓDIGO NOVO SAUDAÇÃO*/ }

  const handleSelectTicket = (ticket) => {
    const code = uuidv4();
    const { id, uuid } = ticket;
    setCurrentTicket({ id, uuid, code });
  };


  const renderTicketInfo = () => {
    if (ticketUser) {

      return (
        <>
          {ticket.chatbot && (
            <Tooltip title="Chatbot">
              <AndroidIcon
                fontSize="small"
                style={{ color: grey[700], marginRight: 5 }}
              />
            </Tooltip>
          )}

          {/* </span> */}
        </>
      );
    } else {
      return (
        <>
          {ticket.chatbot && (
            <Tooltip title="Chatbot">
              <AndroidIcon
                fontSize="small"
                style={{ color: grey[700], marginRight: 5 }}
              />
            </Tooltip>
          )}
        </>
      );
    }
  };

  const handleOpenTransferModal = () => {
    setTransferTicketModalOpen(true);
  }

  const handleCloseTransferTicketModal = () => {
    if (isMounted.current) {
      setTransferTicketModalOpen(false);
    }
  };

  return (
    <React.Fragment key={ticket.id}>

      <TransferTicketModalCustom
        modalOpen={transferTicketModalOpen}
        onClose={handleCloseTransferTicketModal}
        ticketid={ticket.id}
      />

      <TicketMessagesDialog
        open={openTicketMessageDialog}
        handleClose={() => setOpenTicketMessageDialog(false)}
        ticketId={ticket.id}
      ></TicketMessagesDialog>
      <ListItem dense button
        onClick={(e) => {
          if (ticket.status === "pending") return;
          handleSelectTicket(ticket);
        }}
        selected={ticketId && +ticketId === ticket.id}
        className={clsx(classes.ticket, {
          [classes.pendingTicket]: ticket.status === "pending",
        })}
      >
        <Tooltip arrow placement="right" title={ticket.queue?.name?.toUpperCase() || "SEM FILA"} >
          <span style={{ backgroundColor: ticket.queue?.color || "#7C7C7C" }} className={classes.ticketQueueColor}></span>
        </Tooltip>
        <ListItemAvatar>
            <Avatar
              className={classes.avatar}
              src={ticket?.contact?.profilePicUrl?.includes("nopicture.png") ? "/nopicture.png" : ticket?.contact?.profilePicUrl}>
              {getInitials(ticket?.contact?.name || "")}
            </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography
          primary={
            <div className={classes.contactNameWrapper}>
                <div>
                  <Typography
                    noWrap
                    variant="body2"
                    className={classes.nameText}
                  >
                    {ticket.contact?.name}
                  </Typography>
                  <Typography className={classes.ticketInfo}>#T-{ticket.id}</Typography>
                </div>

                <Typography className={classes.lastMessageTime}>
                    {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                      <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                    ) : (
                      <>{format(parseISO(ticket.updatedAt), "dd/MM")}</>
                    )}
                </Typography>
            </div>
          }
          secondary={
            <div className={classes.contactNameWrapper}>
              <Typography
                className={classes.contactLastMessage}
                noWrap
                variant="body2"
              >
                {["composing", "recording"].includes(ticket?.presence) ? (
                  <span className={classes.presence}>
                    {presenceMessage[ticket.presence]}
                  </span>
                ) : (
                  <>
                    {ticket.lastMessage.includes('data:image/png;base64') ? "Localización" : <MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>}
                  </>
                )}

                <div className={classes.secondaryContentSecond} >
                  {ticket?.whatsapp?.name && <Badge className={classes.connectionTag}>{ticket?.whatsapp?.name?.toUpperCase()}</Badge>}
                  {ticketUser && <Badge className={classes.queueTag}>{ticketUser}</Badge>}
                  <Badge className={classes.queueTag}>{ticket.queue?.name?.toUpperCase() || "SEM FILA"}</Badge>
                </div>

                <div className={classes.secondaryContentSecond} >
                  {tag?.map((tag) => {
                    return (
                      <ContactTag tag={tag} key={`ticket-contact-tag-${ticket.id}-${tag.id}`} />
                    );
                  })}
                </div>
              </Typography>

              <Badge
                className={classes.newMessagesCount}
                badgeContent={ticket.unreadMessages}
                classes={{
                  badge: classes.badgeStyle,
                }}
              />
            </div>
          }
        />
        
        {ticket.status === "pending" && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {profile === "admin" && (
                    <Tooltip title="Espiar Conversa">
                        <VisibilityIcon
                            onClick={() => setOpenTicketMessageDialog(true)}
                            fontSize="small"
                            style={{
                                color: "rgba(112, 0, 139, 0.5)",
                                cursor: "pointer",
                                marginRight: 4,
                            }}
                        />
                    </Tooltip>
                )}
                <ButtonWithSpinner
                    color="primary"
                    variant="contained"
                    className={classes.acceptButton}
                    size="small"
                    loading={loading}
                    onClick={e => handleAcepptTicket(ticket.id)}
                >
                    {i18n.t("ticketsList.buttons.accept")}
                </ButtonWithSpinner>
                <ButtonWithSpinner
                    variant="contained"
                    size="small"
                    loading={loading}
                    onClick={e => handleCloseTicket(ticket.id)}
                    style={{
                        backgroundColor: '#ea4335',
                        color: 'white',
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "12px",
                        padding: "6px 16px",
                        boxShadow: "none",
                    }}
                >
                    {i18n.t("ticketsList.buttons.closed")}
                </ButtonWithSpinner>
            </div>
        )}
      </ListItem>

      <Divider style={{ display: "none" }} />
    </React.Fragment>
  );
};

export default TicketListItemCustom;
