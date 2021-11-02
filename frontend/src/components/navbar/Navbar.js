import React from "react";
import { AppBar, Tabs, Tab } from "@material-ui-new/core";
import { makeStyles } from "@material-ui-new/styles";
import Toolbar from "@material-ui-new/core/Toolbar";
import IconButton from "@material-ui-new/core/IconButton";
import Avatar from "@material-ui-new/core/Avatar";
import "./Navbar.css";
import ExitApp from "@material-ui-new/icons/ExitToApp";
import { Typography } from "@material-ui/core";

import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  rootx: {
    flexGrow: 1,
    backgroundColor: "#f1f1f1",
    display: "block",
    maxWidth: "100%",
    marginBottom: "10px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: "left",
  },
  fullHeight: {
    ...theme.mixins.toolbar,
    color: "#ffffff",
    fontWeight: "800",
  },
  indicator: {
    backgroundColor: "white",
  },
}));

const Navbar = (props) => {
  const classes = useStyles();

  const { t } = useTranslation(["db_statistics"]);

  return (
    <div className={classes.rootx}>
      <AppBar position="static" style={{ backgroundColor: "#6360db" }}>
        <Toolbar>
          <Avatar src="/logo192.png" style={{ marginRight: "5px" }} />
          <Typography variant="h6"> {t('db_statistics:header.title')}</Typography>
          <div style={{ marginLeft: "20px" }} />
          {props.statsTab ? (
            <Tabs
              value={props.currTab}
              onChange={props.handleChange}
              TabIndicatorProps={{ style: { background: "#ffffff" } }}
            >
              <Tab
                inkBarStyle={{ background: "#ffffff" }}
                label={t('db_statistics:header.statistics')}
                className="fullheight"
              />
              <Tab label={t('db_statistics:header.add_slots')} className="fullheight" />
            </Tabs>
          ) : (
            ""
          )}
          <div style={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              localStorage.setItem("phoneNo", "");
              localStorage.setItem("userToken", "");
              localStorage.setItem("userTokenStaff", "");
              props.history.replace("/signinotp");
            }}
          >
            <ExitApp />
            <Typography variant="h6">{t('db_statistics:header.logout')}</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
