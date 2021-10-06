import React from "react";
import { AppBar, Tabs, Tab } from "@material-ui-new/core";
import { makeStyles } from "@material-ui-new/styles";
import Toolbar from "@material-ui-new/core/Toolbar";
import IconButton from "@material-ui-new/core/IconButton";
import Avatar from "@material-ui-new/core/Avatar";
import "./Navbar.css";
import ExitApp from "@material-ui-new/icons/ExitToApp";
import { Typography } from "@material-ui/core";

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
  return (
    <div className={classes.rootx}>
      <AppBar position="static" style={{ backgroundColor: "#6360db" }}>
        <Toolbar>
          <Avatar src="/logo192.png" style={{ marginRight: "5px" }} />
          <Typography variant="h6"> Vaccination Slot Booking Portal</Typography>
          {props.statsTab ? (
            <Tabs
              value={props.currTab}
              onChange={props.handleChange}
              TabIndicatorProps={{ style: { background: "#ffffff" } }}
            >
              <Tab
                inkBarStyle={{ background: "#ffffff" }}
                label="STATISTICS"
                className="fullheight"
              />
              <Tab label="ADD SLOTS" className="fullheight" />
            </Tabs>
          ) : (
            ""
          )}
          <div style={{ flexGrow: 1 }}></div>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              localStorage.setItem("phoneNo", "");
              localStorage.setItem("userToken", "");
              props.history.replace("/signinotp");
            }}
          >
            <ExitApp />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
