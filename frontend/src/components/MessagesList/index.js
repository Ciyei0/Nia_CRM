import React, { useState, useEffect, useReducer, useRef, useContext } from "react";

import { isSameDay, parseISO, format } from "date-fns";
import clsx from "clsx";

import { green } from "@material-ui/core/colors";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  makeStyles,
  Badge,
} from "@material-ui/core";

import {
  AccessTime,
  Block,
  Done,
  DoneAll,
  ExpandMore,
  GetApp,
  Reply,
} from "@material-ui/icons";

import MarkdownWrapper from "../MarkdownWrapper";
import ModalImageCors from "../ModalImageCors";
import MessageOptionsMenu from "../MessageOptionsMenu";
import whatsBackground from "../../assets/wa-background.png";
import LocationPreview from "../LocationPreview";
import whatsBackgroundDark from "../../assets/wa-background-dark.png"; //DARK MODE PLW DESIGN//
import VCardPreview from "../VCardPreview";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";
import { ForwardMessageContext } from "../../context/ForwarMessage/ForwardMessageContext";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import SelectMessageCheckbox from "./SelectMessageCheckbox";

const useStyles = makeStyles((theme) => ({
  messagesListWrapper: {
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    minWidth: 300,
    minHeight: 200,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },

  messagesList: {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(${whatsBackground})`,
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: "24px 20px",
    overflowY: "auto",
    ...theme.scrollbarStyles,
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(102, 126, 234, 0.4)",
      borderRadius: "4px",
    },
  },

  circleLoading: {
    color: "#667eea",
    position: "absolute",
    opacity: "85%",
    top: 0,
    left: "50%",
    marginTop: 12,
    filter: "drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))",
  },

  messageLeft: {
    marginRight: 20,
    marginTop: 8,
    marginBottom: 4,
    minWidth: 100,
    maxWidth: 520,
    height: "auto",
    display: "block",
    position: "relative",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateX(4px)",
    },
    "&:hover #messageActionsButton": {
      display: "flex",
      position: "absolute",
      top: 0,
      right: 0,
    },
    whiteSpace: "pre-wrap",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    color: "#2d3748",
    alignSelf: "flex-start",
    borderRadius: "18px",
    borderTopLeftRadius: "4px",
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 6,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(0,0,0,0.04)",
  },

  quotedContainerLeft: {
    margin: "4px -10px 10px -10px",
    overflow: "hidden",
    background: theme.palette.type === 'light'
      ? "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"
      : "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
    borderRadius: "12px",
    display: "flex",
    position: "relative",
  },

  quotedMsg: {
    padding: 12,
    maxWidth: 280,
    height: "auto",
    display: "block",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    fontSize: "0.9rem",
    opacity: 0.85,
  },

  quotedSideColorLeft: {
    flex: "none",
    width: "4px",
    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "4px 0 0 4px",
  },

  messageRight: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 4,
    minWidth: 100,
    maxWidth: 520,
    height: "auto",
    display: "block",
    position: "relative",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateX(-4px)",
    },
    "&:hover #messageActionsButton": {
      display: "flex",
      position: "absolute",
      top: 0,
      right: 0,
    },
    whiteSpace: "pre-wrap",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    alignSelf: "flex-end",
    borderRadius: "18px",
    borderBottomRightRadius: "4px",
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 6,
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.25), 0 2px 6px rgba(118, 75, 162, 0.15)",
  },

  quotedContainerRight: {
    margin: "4px -10px 10px -10px",
    overflowY: "hidden",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
    display: "flex",
    position: "relative",
    backdropFilter: "blur(4px)",
  },

  quotedMsgRight: {
    padding: 12,
    maxWidth: 280,
    height: "auto",
    whiteSpace: "pre-wrap",
    fontSize: "0.9rem",
    opacity: 0.9,
  },

  quotedSideColorRight: {
    flex: "none",
    width: "4px",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "4px 0 0 4px",
  },

  messageActionsButton: {
    display: "none",
    position: "relative",
    color: theme.palette.type === 'light' ? "#6b7280" : "#9ca3af",
    zIndex: 1,
    backgroundColor: "transparent",
    opacity: "90%",
    transition: "all 0.2s ease",
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
    },
  },

  messageContactName: {
    display: "flex",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
    fontSize: "0.85rem",
    marginBottom: 4,
  },

  textContentItem: {
    overflowWrap: "break-word",
    padding: "4px 70px 8px 4px",
    fontSize: "0.95rem",
    lineHeight: 1.45,
  },

  textContentItemEdited: {
    overflowWrap: "break-word",
    padding: "4px 110px 8px 4px",
    fontSize: "0.95rem",
    lineHeight: 1.45,
  },

  textContentItemDeleted: {
    fontStyle: "italic",
    color: theme.palette.type === 'light' ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)",
    overflowWrap: "break-word",
    padding: "4px 70px 8px 4px",
    fontSize: "0.95rem",
  },

  forwardMessage: {
    fontSize: 11,
    fontStyle: "italic",
    position: "absolute",
    top: 2,
    left: 8,
    color: theme.palette.type === 'light' ? "#6b7280" : "#9ca3af",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  messageMedia: {
    objectFit: "cover",
    width: 280,
    height: 220,
    borderRadius: "12px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },

  timestamp: {
    fontSize: 10,
    position: "absolute",
    bottom: 4,
    right: 8,
    color: theme.palette.type === 'light' ? "#9ca3af" : "rgba(255, 255, 255, 0.6)",
    fontWeight: 500,
  },

  dailyTimestamp: {
    alignItems: "center",
    textAlign: "center",
    alignSelf: "center",
    width: "auto",
    minWidth: "100px",
    padding: "6px 16px",
    background: theme.palette.type === 'light'
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)",
    margin: "16px 0",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
  },

  dailyTimestampText: {
    color: "#ffffff",
    padding: 0,
    alignSelf: "center",
    marginLeft: "0px",
    fontWeight: 500,
    fontSize: "0.8rem",
    letterSpacing: "0.3px",
  },

  ackIcons: {
    fontSize: 16,
    verticalAlign: "middle",
    marginLeft: 4,
    opacity: 0.7,
  },

  deletedIcon: {
    fontSize: 16,
    verticalAlign: "middle",
    marginRight: 4,
    opacity: 0.6,
  },

  ackDoneAllIcon: {
    color: "#10b981",
    fontSize: 16,
    verticalAlign: "middle",
    marginLeft: 4,
    filter: "drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))",
  },

  downloadMedia: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 12,
    "& .MuiButton-root": {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 20px",
      textTransform: "none",
      fontWeight: 500,
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
      border: "none",
      "&:hover": {
        background: "linear-gradient(135deg, #5a6fd6 0%, #6a3f91 100%)",
        boxShadow: "0 6px 16px rgba(102, 126, 234, 0.35)",
      },
    },
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_MESSAGES") {
    const messages = action.payload;
    const newMessages = [];

    messages.forEach((message) => {
      const messageIndex = state.findIndex((m) => m.id === message.id);
      if (messageIndex !== -1) {
        state[messageIndex] = message;
      } else {
        newMessages.push(message);
      }
    });

    return [...newMessages, ...state];
  }

  if (action.type === "ADD_MESSAGE") {
    const newMessage = action.payload;
    const messageIndex = state.findIndex((m) => m.id === newMessage.id);

    if (messageIndex !== -1) {
      state[messageIndex] = newMessage;
    } else {
      state.push(newMessage);
    }

    return [...state];
  }

  if (action.type === "UPDATE_MESSAGE") {
    const messageToUpdate = action.payload;
    const messageIndex = state.findIndex((m) => m.id === messageToUpdate.id);

    if (messageIndex !== -1) {
      state[messageIndex] = messageToUpdate;
    }

    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const MessagesList = ({ ticket, ticketId, isGroup }) => {
  const classes = useStyles();

  const [messagesList, dispatch] = useReducer(reducer, []);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  const [selectedMessage, setSelectedMessage] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const messageOptionsMenuOpen = Boolean(anchorEl);
  const currentTicketId = useRef(ticketId);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const socketManager = useContext(SocketContext);
  const { setReplyingMessage } = useContext(ReplyMessageContext);
  const { showSelectMessageCheckbox } = useContext(ForwardMessageContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);

    currentTicketId.current = ticketId;
  }, [ticketId]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchMessages = async () => {
        if (ticketId === undefined) return;
        try {
          const { data } = await api.get("/messages/" + ticketId, {
            params: { pageNumber },
          });

          if (currentTicketId.current === ticketId) {
            dispatch({ type: "LOAD_MESSAGES", payload: data.messages });
            setHasMore(data.hasMore);
            setLoading(false);
          }

          if (pageNumber === 1 && data.messages.length > 1) {
            scrollToBottom();
          }
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchMessages();
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [pageNumber, ticketId]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on("ready", () => socket.emit("joinChatBox", `${ticket.id}`));

    socket.on(`company-${companyId}-appMessage`, (data) => {
      if (data.action === "create" && data.message.ticketId === currentTicketId.current) {
        dispatch({ type: "ADD_MESSAGE", payload: data.message });
        scrollToBottom();
      }

      if (data.action === "update" && data.message.ticketId === currentTicketId.current) {
        dispatch({ type: "UPDATE_MESSAGE", payload: data.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId, ticket, socketManager]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  };

  const handleScroll = (e) => {
    if (!hasMore) return;
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0) {
      document.getElementById("messagesList").scrollTop = 1;
    }

    if (loading) {
      return;
    }

    if (scrollTop < 50) {
      loadMore();
    }
  };

  const hanldeReplyMessage = (e, message) => {
    //if (ticket.status === "open" || ticket.status === "group") {
    setAnchorEl(null);
    setReplyingMessage(message);
    //}
  };

  const handleOpenMessageOptionsMenu = (e, message) => {
    setAnchorEl(e.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMessageOptionsMenu = (e) => {
    setAnchorEl(null);
  };

  const checkMessageMedia = (message) => {
    if (message.mediaType === "locationMessage" && message.body.split('|').length >= 2) {
      let locationParts = message.body.split('|')
      let imageLocation = locationParts[0]
      let linkLocation = locationParts[1]

      let descriptionLocation = null

      if (locationParts.length > 2)
        descriptionLocation = message.body.split('|')[2]

      return <LocationPreview image={imageLocation} link={linkLocation} description={descriptionLocation} />
    }
    else
      if (message.mediaType === "contactMessage") {
        let array = message.body.split("\n");
        let obj = [];
        let contact = "";
        for (let index = 0; index < array.length; index++) {
          const v = array[index];
          let values = v.split(":");
          for (let ind = 0; ind < values.length; ind++) {
            if (values[ind].indexOf("+") !== -1) {
              obj.push({ number: values[ind] });
            }
            if (values[ind].indexOf("FN") !== -1) {
              contact = values[ind + 1];
            }
          }
        }
        //console.log(array);
        //console.log(contact);
        //console.log(obj[0].number);
        return <VCardPreview contact={contact} numbers={obj[0].number} />
      }
      /* else if (message.mediaType === "vcard") {
        let array = message.body.split("\n");
        let obj = [];
        let contact = "";
        for (let index = 0; index < array.length; index++) {
          const v = array[index];
          let values = v.split(":");
          for (let ind = 0; ind < values.length; ind++) {
            if (values[ind].indexOf("+") !== -1) {
              obj.push({ number: values[ind] });
            }
            if (values[ind].indexOf("FN") !== -1) {
              contact = values[ind + 1];
            }
          }
        }
        return <VcardPreview contact={contact} numbers={obj[0].number} />
      } */
      /*else if (message.mediaType === "multi_vcard") {
        console.log("multi_vcard")
        console.log(message)
        
        if(message.body !== null && message.body !== "") {
          let newBody = JSON.parse(message.body)
          return (
            <>
              {
              newBody.map(v => (
                <VcardPreview contact={v.name} numbers={v.number} />
              ))
              }
            </>
          )
        } else return (<></>)
      }*/
      else if (message.mediaType === "image") {
        return <ModalImageCors imageUrl={message.mediaUrl} />;
      } else if (message.mediaType === "audio") {

        //console.log(isIOS);

        if (isIOS) {
          message.mediaUrl = message.mediaUrl.replace("ogg", "mp3");

          return (
            <audio controls>
              <source src={message.mediaUrl} type="audio/mp3"></source>
            </audio>
          );
        } else {

          return (
            <audio controls>
              <source src={message.mediaUrl} type="audio/ogg"></source>
            </audio>
          );
        }
      } else if (message.mediaType === "video") {
        return (
          <video
            className={classes.messageMedia}
            src={message.mediaUrl}
            controls
          />
        );
      } else {
        return (
          <>
            <div className={classes.downloadMedia}>
              <Button
                startIcon={<GetApp />}
                color="primary"
                variant="outlined"
                target="_blank"
                href={message.mediaUrl}
              >
                Download
              </Button>
            </div>
            <Divider />
          </>
        );
      }
  };

  /*
    const renderMessageAck = (message) => {
      if (message.ack === 1) {
        return <AccessTime fontSize="small" className={classes.ackIcons} />;
      }
      if (message.ack === 2) {
        return <Done fontSize="small" className={classes.ackIcons} />;
      }
      if (message.ack === 3) {
        return <DoneAll fontSize="small" className={classes.ackIcons} />;
      }
      if (message.ack === 4 || message.ack === 5) {
        return <DoneAll fontSize="small" className={classes.ackDoneAllIcon} />;
      }
    };
    */

  const renderMessageAck = (message) => {
    if (message.ack === 0) {
      return <AccessTime fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 1) {
      return <Done fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 2) {
      return <Done fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 3) {
      return <DoneAll fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 4 || message.ack === 5) {
      return <DoneAll fontSize="small" className={classes.ackDoneAllIcon} style={{ color: '#0377FC' }} />;
    }
  };

  const renderDailyTimestamps = (message, index) => {
    if (index === 0) {
      return (
        <span
          className={classes.dailyTimestamp}
          key={`timestamp-${message.id}`}
        >
          <div className={classes.dailyTimestampText}>
            {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
          </div>
        </span>
      );
    }
    if (index < messagesList.length - 1) {
      let messageDay = parseISO(messagesList[index].createdAt);
      let previousMessageDay = parseISO(messagesList[index - 1].createdAt);

      if (!isSameDay(messageDay, previousMessageDay)) {
        return (
          <span
            className={classes.dailyTimestamp}
            key={`timestamp-${message.id}`}
          >
            <div className={classes.dailyTimestampText}>
              {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
            </div>
          </span>
        );
      }
    }
    if (index === messagesList.length - 1) {
      return (
        <div
          key={`ref-${message.createdAt}`}
          ref={lastMessageRef}
          style={{ float: "left", clear: "both" }}
        />
      );
    }
  };

  const renderNumberTicket = (message, index) => {
    if (index < messagesList.length && index > 0) {

      let messageTicket = message.ticketId;
      let connectionName = message.ticket?.whatsapp?.name;
      let previousMessageTicket = messagesList[index - 1].ticketId;

      if (messageTicket !== previousMessageTicket) {
        return (
          <center>
            <div className={classes.ticketNunberClosed}>
              Conversa encerrada: {format(parseISO(messagesList[index - 1].createdAt), "dd/MM/yyyy HH:mm:ss")}
            </div>

            <div className={classes.ticketNunberOpen}>
              Conversa iniciada: {format(parseISO(message.createdAt), "dd/MM/yyyy HH:mm:ss")}
            </div>
          </center>
        );
      }
    }
  };

  const renderMessageDivider = (message, index) => {
    if (index < messagesList.length && index > 0) {
      let messageUser = messagesList[index].fromMe;
      let previousMessageUser = messagesList[index - 1].fromMe;

      if (messageUser !== previousMessageUser) {
        return (
          <span style={{ marginTop: 16 }} key={`divider-${message.id}`}></span>
        );
      }
    }
  };

  const renderQuotedMessage = (message) => {
    return (
      <div
        className={clsx(classes.quotedContainerLeft, {
          [classes.quotedContainerRight]: message.fromMe,
        })}
      >
        <span
          className={clsx(classes.quotedSideColorLeft, {
            [classes.quotedSideColorRight]: message.quotedMsg?.fromMe,
          })}
        ></span>
        <div className={classes.quotedMsg}>
          {!message.quotedMsg?.fromMe && (
            <span className={classes.messageContactName}>
              {message.quotedMsg?.contact?.name}
            </span>
          )}

          {message.quotedMsg.mediaType === "audio"
            && (
              <div className={classes.downloadMedia}>
                <audio controls>
                  <source src={message.quotedMsg.mediaUrl} type="audio/ogg"></source>
                </audio>
              </div>
            )
          }
          {message.quotedMsg.mediaType === "video"
            && (
              <video
                className={classes.messageMedia}
                src={message.quotedMsg.mediaUrl}
                controls
              />
            )
          }
          {message.quotedMsg.mediaType === "application"
            && (
              <div className={classes.downloadMedia}>
                <Button
                  startIcon={<GetApp />}
                  color="primary"
                  variant="outlined"
                  target="_blank"
                  href={message.quotedMsg.mediaUrl}
                >
                  Download
                </Button>
              </div>
            )
          }

          {message.quotedMsg.mediaType === "image"
            && (
              <ModalImageCors imageUrl={message.quotedMsg.mediaUrl} />)
            || message.quotedMsg?.body}

        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (messagesList.length > 0) {
      const viewMessagesList = messagesList.map((message, index) => {

        if (message.mediaType === "call_log") {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderNumberTicket(message, index)}
              {renderMessageDivider(message, index)}
              <div className={classes.messageCenter}>
                <IconButton
                  variant="contained"
                  size="small"
                  id="messageActionsButton"
                  disabled={message.isDeleted}
                  className={classes.messageActionsButton}
                  onClick={(e) => handleOpenMessageOptionsMenu(e, message)}
                >
                  <ExpandMore />
                </IconButton>
                {isGroup && (
                  <span className={classes.messageContactName}>
                    {message.contact?.name}
                  </span>
                )}
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17" width="20" height="17">
                    <path fill="#df3333" d="M18.2 12.1c-1.5-1.8-5-2.7-8.2-2.7s-6.7 1-8.2 2.7c-.7.8-.3 2.3.2 2.8.2.2.3.3.5.3 1.4 0 3.6-.7 3.6-.7.5-.2.8-.5.8-1v-1.3c.7-1.2 5.4-1.2 6.4-.1l.1.1v1.3c0 .2.1.4.2.6.1.2.3.3.5.4 0 0 2.2.7 3.6.7.2 0 1.4-2 .5-3.1zM5.4 3.2l4.7 4.6 5.8-5.7-.9-.8L10.1 6 6.4 2.3h2.5V1H4.1v4.8h1.3V3.2z"></path>
                  </svg> <span>Chamada de voz/vídeo perdida às {format(parseISO(message.createdAt), "HH:mm")}</span>
                </div>
              </div>
            </React.Fragment>
          );
        }

        if (!message.fromMe) {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderNumberTicket(message, index)}
              {renderMessageDivider(message, index)}
              <div
                className={classes.messageLeft}
                title={message.queueId && message.queue?.name}
                onDoubleClick={(e) => hanldeReplyMessage(e, message)}
              >
                {showSelectMessageCheckbox && (
                  <SelectMessageCheckbox
                    // showSelectMessageCheckbox={showSelectMessageCheckbox}
                    message={message}
                  // selectedMessagesList={selectedMessagesList}
                  // setSelectedMessagesList={setSelectedMessagesList}
                  />
                )}
                <IconButton
                  variant="contained"
                  size="small"
                  id="messageActionsButton"
                  disabled={message.isDeleted}
                  className={classes.messageActionsButton}
                  onClick={(e) => handleOpenMessageOptionsMenu(e, message)}
                >
                  <ExpandMore />
                </IconButton>
                {message.isForwarded && (
                  <div>
                    <span className={classes.forwardMessage}
                    ><Reply style={{ color: "grey", transform: 'scaleX(-1)' }} /> Encaminhada
                    </span>
                    <br />
                  </div>
                )}
                {isGroup && (
                  <span className={classes.messageContactName}>
                    {message.contact?.name}
                  </span>
                )}

                {/* aviso de mensagem apagado pelo contato */}
                {message.isDeleted && (
                  <div>
                    <span className={"message-deleted"}
                    >Essa mensagem foi apagada pelo contato &nbsp;
                      <Block
                        color="error"
                        fontSize="small"
                        className={classes.deletedIcon}
                      />
                    </span>
                  </div>
                )}

                {(message.mediaUrl || message.mediaType === "locationMessage" || message.mediaType === "vcard" || message.mediaType === "contactMessage"
                  //|| message.mediaType === "multi_vcard" 
                ) && checkMessageMedia(message)}
                <div className={classes.textContentItem}>
                  {message.quotedMsg && renderQuotedMessage(message)}
                  {message.mediaType !== "reactionMessage" && (
                    <MarkdownWrapper>
                      {message.mediaType === "locationMessage" || message.mediaType === "contactMessage"
                        ? null
                        : message.body}
                    </MarkdownWrapper>
                  )}
                  {message.quotedMsg && message.mediaType === "reactionMessage" && message.body && (
                    <>
                      <span style={{ marginLeft: "0px", display: 'flex', alignItems: 'center' }}>
                        <MarkdownWrapper>
                          {"_*" + (message.fromMe ? 'Você' : (message?.contact?.name ?? 'Contato')) + "*_ reagiu... "}
                        </MarkdownWrapper>
                        <Badge
                          className={classes.badge}
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          badgeContent={
                            <span style={{ fontSize: "1.2em", marginTop: "0", marginLeft: "5px" }}>
                              {message.body}
                            </span>
                          }
                        >
                        </Badge>
                      </span>
                    </>
                  )}

                  <span className={classes.timestamp}>
                    {format(parseISO(message.createdAt), "HH:mm")}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderNumberTicket(message, index)}
              {renderMessageDivider(message, index)}
              <div className={classes.messageRight}
                onDoubleClick={(e) => hanldeReplyMessage(e, message)}
              >
                {showSelectMessageCheckbox && (
                  <SelectMessageCheckbox
                    // showSelectMessageCheckbox={showSelectMessageCheckbox}
                    message={message}
                  // selectedMessagesList={selectedMessagesList}
                  // setSelectedMessagesList={setSelectedMessagesList}
                  />
                )}
                <IconButton
                  variant="contained"
                  size="small"
                  id="messageActionsButton"
                  disabled={message.isDeleted}
                  className={classes.messageActionsButton}
                  onClick={(e) => handleOpenMessageOptionsMenu(e, message)}
                >
                  <ExpandMore />
                </IconButton>
                {message.isForwarded && (
                  <div>
                    <span className={classes.forwardMessage}
                    ><Reply style={{ color: "grey", transform: 'scaleX(-1)' }} /> Encaminhada
                    </span>
                    <br />
                  </div>
                )}
                {(message.mediaUrl || message.mediaType === "locationMessage" || message.mediaType === "vcard" || message.mediaType === "contactMessage"
                  //|| message.mediaType === "multi_vcard" 
                ) && checkMessageMedia(message)}
                <div
                  className={clsx(classes.textContentItem, {
                    [classes.textContentItemDeleted]: message.isDeleted,
                  })}
                >
                  {message.isDeleted && (
                    <Block
                      color="disabled"
                      fontSize="small"
                      className={classes.deletedIcon}
                    />
                  )}
                  {message.quotedMsg && renderQuotedMessage(message)}
                  {message.mediaType !== "reactionMessage" && message.mediaType !== "locationMessage" && (
                    <MarkdownWrapper>{message.body}</MarkdownWrapper>
                  )}
                  {message.quotedMsg && message.mediaType === "reactionMessage" && message.body && (
                    <>
                      <span style={{ marginLeft: "0px", display: 'flex', alignItems: 'center' }}>
                        <MarkdownWrapper>
                          {"_*" + (message.fromMe ? 'Você' : (message?.contact?.name ?? 'Contato')) + "*_ reagiu... "}
                        </MarkdownWrapper>
                        <Badge
                          className={classes.badge}
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          badgeContent={
                            <span style={{ fontSize: "1.2em", marginTop: "0", marginLeft: "5px" }}>
                              {message.body}
                            </span>
                          }
                        >
                        </Badge>
                      </span>
                    </>
                  )}


                  <span className={classes.timestamp}>
                    {format(parseISO(message.createdAt), "HH:mm")}
                    {renderMessageAck(message)}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        }
      });
      return viewMessagesList;
    } else {
      return <div>Diga olá para seu novo contato!</div>;
    }
  };

  return (
    <div className={classes.messagesListWrapper}>
      <MessageOptionsMenu
        message={selectedMessage}
        anchorEl={anchorEl}
        menuOpen={messageOptionsMenuOpen}
        handleClose={handleCloseMessageOptionsMenu}
      />
      <div
        id="messagesList"
        className={classes.messagesList}
        onScroll={handleScroll}
      >
        {messagesList.length > 0 ? renderMessages() : []}
      </div>
      {loading && (
        <div>
          <CircularProgress className={classes.circleLoading} />
        </div>
      )}
    </div>
  );
};

export default MessagesList;
