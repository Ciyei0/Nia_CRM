import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import api from "../../services/api";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import PlaylistAddCheckOutlinedIcon from '@material-ui/icons/PlaylistAddCheckOutlined';


import {
  Add as AddIcon,
} from "@material-ui/icons";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsListCustom";
import TabPanel from "../TabPanel";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import { TagsFilter } from "../TagsFilter";
import { UsersFilter } from "../UsersFilter";

const useStyles = makeStyles(theme => ({
	ticketsWrapper: {
		position: "relative",
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflow: "hidden",
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
        border: "none",
        backgroundColor: theme.palette.fancyBackground,
	},


	tabsHeader: {
		flex: "none",
		backgroundColor: theme.palette.fancyBackground,
        borderBottom: `1px solid ${theme.palette.bordabox}`,
	},

	tabsInternal: {
		flex: "none",
		backgroundColor: theme.palette.fancyBackground
	},

	settingsIcon: {
		alignSelf: "center",
		marginLeft: "auto",
		padding: 8,
	},
    snackbar: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        borderRadius: "12px",
    },

    yesButton: {
        backgroundColor: "#FFF",
        color: "rgba(0, 100, 0, 1)",
        padding: "4px 12px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginRight: theme.spacing(1),
        borderRadius: "8px",
    },
    noButton: {
        backgroundColor: "#FFF",
        color: "rgba(139, 0, 0, 1)",
        padding: "4px 12px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "8px",
    },

	tab: {
		minWidth: "33.33%",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "none",
        color: theme.palette.secondary.main,
        '&.Mui-selected': {
            color: theme.palette.primary.main,
        }
	},

	internalTab: {
		minWidth: "50%",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "none",
        color: theme.palette.secondary.main,
        '&.Mui-selected': {
            color: theme.palette.primary.main,
        }
	},

	ticketOptionsBox: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: theme.palette.fancyBackground,
		padding: theme.spacing(1.5),
        borderBottom: `1px solid ${theme.palette.bordabox}`,
	},

	serachInputWrapper: {
		flex: 1,
		backgroundColor: theme.mode === 'light' ? '#ffffff' : '#1a1a24',
		display: "flex",
		borderRadius: "12px",
		padding: "4px 12px",
		margin: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: `1px solid ${theme.palette.bordabox}`,
	},

	searchIcon: {
		color: theme.palette.primary.main,
        alignSelf: "center",
        fontSize: "20px",
	},

    searchIconWrapper: {
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

	searchInput: {
		flex: 1,
		border: "none",
		borderRadius: 25,
        padding: "10px",
        outline: "none",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "transparent",
        color: theme.palette.dark.main,
	},

    badge: {
        '& .MuiBadge-badge': {
            right: -3,
            top: 3,
            fontSize: "10px",
            fontWeight: 700,
            backgroundColor: theme.palette.primary.main,
        }
    },
    searchContainer: {
        display: "flex",
        padding: "0px",
        backgroundColor: theme.palette.fancyBackground,
        borderBottom: `1px solid ${theme.palette.bordabox}`,
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: "56px",
        height: "56px",
        background: "linear-gradient(135deg, #70008b, #8E24AA)",
        color: "white",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 8px 16px rgba(112, 0, 139, 0.3)",
        transition: "all 0.3s ease",
        zIndex: 100,
        '&:hover': {
            transform: "scale(1.05)",
            boxShadow: "0 12px 24px rgba(112, 0, 139, 0.4)",
        },
        '&:active': {
            transform: "scale(0.95)",
        }
    }
}));

const TicketsManagerTabs = () => {
  const classes = useStyles();
  const history = useHistory();
  
  const [isHoveredAll, setIsHoveredAll] = useState(false);
  const [isHoveredNew, setIsHoveredNew] = useState(false);
  const [isHoveredResolve, setIsHoveredResolve] = useState(false);
  const [isHoveredOpen, setIsHoveredOpen] = useState(false);
  const [isHoveredClosed, setIsHoveredClosed] = useState(false);

  
  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const searchInputRef = useRef();
  const { user } = useContext(AuthContext);
  const { profile } = user;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (user.profile.toUpperCase() === "ADMIN") {
      setShowAllTickets(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "search") {
      searchInputRef.current.focus();
    }
  }, [tab]);

  let searchTimeout;

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setTab("open");
      return;
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e, newValue) => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  const handleCloseOrOpenTicket = (ticket) => {
    setNewTicketModalOpen(false);
    if (ticket !== undefined && ticket.uuid !== undefined) {
      history.push(`/tickets/${ticket.uuid}`);
    }
  };

  const handleSelectedTags = (selecteds) => {
    const tags = selecteds.map((t) => t.id);
    setSelectedTags(tags);
  };

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);
    setSelectedUsers(users);
  };

  const CloseAllTicket = async () => {
    try {
      const { data } = await api.post("/tickets/closeAll", {
        status: tabOpen,
        selectedQueueIds,
      });

      handleSnackbarClose();

    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(ticket) => {
          handleCloseOrOpenTicket(ticket);
        }}
      />

      <div className={classes.searchContainer}>
        <div className={classes.serachInputWrapper}>
            <div className={classes.searchIconWrapper}>
                <SearchIcon className={classes.searchIcon} />
            </div>
            <input
              type="text"
              placeholder={i18n.t("tickets.search.placeholder")}
              className={classes.searchInput}
              value={searchParam}
              onChange={handleSearch}
            />
        </div>
      </div>

      <Paper elevation={0} square className={classes.tabsHeader}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon label tabs example"
        >
          <Tab
            value={"open"}
            label={
              <Badge
                className={classes.badge}
                badgeContent={openCount}
                overlap="rectangular"
                color="secondary"
              >
                Abiertos
              </Badge>
            }
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"closed"}
            label="Resueltos"
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"search"}
            label="Búsqueda"
            classes={{ root: classes.tab }}
          />
        </Tabs>
      </Paper>
      <Paper square elevation={0} className={classes.ticketOptionsBox}>
        <Can
          role={user.profile}
          perform="tickets-manager:showall"
          yes={() => (
            <FormControlLabel
              label={i18n.t("tickets.buttons.showAll")}
              labelPlacement="start"
              control={
                <Switch
                  size="small"
                  checked={showAllTickets}
                  onChange={() =>
                    setShowAllTickets((prevState) => !prevState)
                  }
                  name="showAllTickets"
                  color="primary"
                />
              }
            />
          )}
        />
        <TicketsQueueSelect
          style={{ marginLeft: 6 }}
          selectedQueueIds={selectedQueueIds}
          userQueues={user?.queues}
          onChange={(values) => setSelectedQueueIds(values)}
        />
      </Paper>
      <TabPanel value={tab} name="open" className={classes.ticketsWrapper}>
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className={classes.tabsInternal}
        >
          <Tab
            label={
              <Badge
                className={classes.badge}
                badgeContent={openCount}
                color="primary"
              >
                Abiertos
              </Badge>
            }
            value={"open"}
            classes={{ root: classes.internalTab }}
          />
          <Tab
            label={
              <Badge
                className={classes.badge}
                badgeContent={pendingCount}
                color="secondary"
              >
                Pendiente
              </Badge>
            }
            value={"pending"}
            classes={{ root: classes.internalTab }}
          />
        </Tabs>
        <Paper className={classes.ticketsWrapper}>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
          />
          <TicketsList
            status="pending"
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
        <TicketsList
          status="closed"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
        <TagsFilter onFiltered={handleSelectedTags} />
        {profile === "admin" && (
          <UsersFilter onFiltered={handleSelectedUsers} />
        )}
        <TicketsList
          searchParam={searchParam}
          showAll={true}
          tags={selectedTags}
          users={selectedUsers}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>

      <div className={classes.fab} onClick={() => setNewTicketModalOpen(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>add</span>
      </div>
    </Paper>
  );
};

export default TicketsManagerTabs;
