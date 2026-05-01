import React, { useContext, useEffect, useState } from "react";

import { 
  Badge,
  Button,
  FormControlLabel,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Switch
} from "@material-ui/core";

import {
  AllInboxRounded,
  HourglassEmptyRounded,
  MoveToInbox,
  Search
} from "@material-ui/icons";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsList";
import TabPanel from "../TabPanel";
import { TagsFilter } from "../TagsFilter";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
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

  settingsIcon: {
    alignSelf: "center",
    marginLeft: "auto",
    padding: 8,
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
  show: {
    display: "block",
  },
  hide: {
    display: "none !important",
  },
  searchContainer: {
    display: "flex",
    padding: "8px 16px",
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
  },
  fabIcon: {
      fontSize: "28px",
  }
}));

const TicketsManager = () => {
  const classes = useStyles();

  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const { user } = useContext(AuthContext);

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

  useEffect(() => {
    if (user.profile.toUpperCase() === "ADMIN") {
      setShowAllTickets(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();


    setSearchParam(searchedTerm);
    if (searchedTerm === "") {
      setTab("open");
    } else if (tab !== "search") {
      setTab("search");
    }

  };

  const handleSelectedTags = (selecteds) => {
    const tags = selecteds.map(t => t.id);
    setSelectedTags(tags);
  }

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(e) => setNewTicketModalOpen(false)}
      />

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
            value={"pending"}
            label={
              <Badge
                className={classes.badge}
                badgeContent={pendingCount}
                overlap="rectangular"
                color="secondary"
              >
                Pendiente
              </Badge>
            }
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"closed"}
            label="Resueltos"
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
      <TagsFilter onFiltered={handleSelectedTags} />
        <Paper className={classes.ticketsWrapper}>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
            tags={selectedTags}
          />
          <TicketsList
            status="pending"
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
            tags={selectedTags}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={tab} name="pending" className={classes.ticketsWrapper}>
      <TagsFilter onFiltered={handleSelectedTags} />
        <TicketsList
          status="pending"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
          updateCount={(val) => setPendingCount(val)}
          tags={selectedTags}
        />
      </TabPanel>



      <TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
      <TagsFilter onFiltered={handleSelectedTags} />
        <TicketsList
          status="closed"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
          tags={selectedTags}
        />
      </TabPanel>
      <TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
      <TagsFilter onFiltered={handleSelectedTags} />
        <TicketsList
          searchParam={searchParam}
          tags={selectedTags}
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <div className={classes.fab} onClick={() => setNewTicketModalOpen(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>add</span>
      </div>
    </Paper>
  );
};

export default TicketsManager;