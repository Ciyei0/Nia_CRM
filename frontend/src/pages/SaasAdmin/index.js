import React, { useState, useEffect } from "react";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { makeStyles, Paper, Tabs, Tab } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";

import CompaniesManager from "../../components/CompaniesManager";
import PlansManager from "../../components/PlansManager";
import HelpsManager from "../../components/HelpsManager";
import Uploader from "../../components/Settings/Uploader";
import NewCompaniesManager from "../../pages/Companies";

import { i18n } from "../../translate/i18n.js";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth.js";
import OnlyForSuperUser from "../../components/OnlyForSuperUser";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  mainPaper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    flex: 1,
  },
  tab: {
    backgroundColor: theme.palette.options,
    borderRadius: 4,
  },
  paper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  container: {
    width: "100%",
    maxHeight: "100%",
  },
}));

const SaasAdmin = () => {
  const classes = useStyles();
  const [tab, setTab] = useState("companies");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const { getCurrentUserInfo } = useAuth();

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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const isSuper = () => {
    return currentUser.super;
  };

  if (!isSuper()) {
    return (
      <MainContainer className={classes.root}>
        <MainHeader>
          <Title>Administración SaaS</Title>
        </MainHeader>
        <Paper className={classes.mainPaper} elevation={1}>
           <div style={{ padding: 20 }}>Acceso denegado.</div>
        </Paper>
      </MainContainer>
    );
  }

  return (
    <MainContainer className={classes.root}>
      <MainHeader>
        <Title>Administración SaaS</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} elevation={1}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="on"
          variant="scrollable"
          onChange={handleTabChange}
          className={classes.tab}
        >
          <Tab label="Empresas" value={"companies"} />
          <Tab label="Cadastrar Empresa" value={"newcompanie"} />
          <Tab label="Planos" value={"plans"} />
          <Tab label="Logo" value={"uploader"} />
          <Tab label="Ajuda" value={"helps"} />
        </Tabs>
        <Paper className={classes.paper} elevation={0}>
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"companies"}
              >
                <CompaniesManager />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"newcompanie"}
              >
                <NewCompaniesManager />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"plans"}
              >
                <PlansManager />
              </TabPanel>
            )}
          />
         <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"uploader"}
              >
                <Uploader />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel
                className={classes.container}
                value={tab}
                name={"helps"}
              >
                <HelpsManager />
              </TabPanel>
            )}
          />
        </Paper>
      </Paper>
    </MainContainer>
  );
};

export default SaasAdmin;
