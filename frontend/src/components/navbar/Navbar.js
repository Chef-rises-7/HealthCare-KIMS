import React from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Button,
} from "@material-ui-new/core";
import { makeStyles } from "@material-ui-new/styles";
import Toolbar from "@material-ui-new/core/Toolbar";
import IconButton from "@material-ui-new/core/IconButton";
import Avatar from "@material-ui-new/core/Avatar";
import "./Navbar.css";
import TranslateIcon from "@material-ui/icons/Translate";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import ExitApp from "@material-ui-new/icons/ExitToApp";
import { Typography } from "@material-ui/core";

import { useTranslation } from "react-i18next";

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
  const [anchorEl, setanchorEl] = React.useState(null);
  const [anchorEl2, setanchorEl2] = React.useState(null);

  const handleClickAnchor = (event) => {
    setanchorEl(event.currentTarget);
  };
  const handleClickAnchor2 = (event) => {
    setanchorEl2(event.currentTarget);
  };

  const { t, i18n } = useTranslation(["db_statistics"]);

  return (
    <div className={classes.rootx}>
      <AppBar position="static" style={{ backgroundColor: "#6360db" }}>
        <Toolbar>
          <Avatar src="/logo192.png" style={{ marginRight: "5px" }} />
          <Typography variant="h6">
            {" "}
            {t("db_statistics:header.title")}
          </Typography>
          <div style={{ marginLeft: "20px" }} />
          {props.statsTab ? (
            <Tabs
              value={props.currTab}
              onChange={props.handleChange}
              TabIndicatorProps={{ style: { background: "#ffffff" } }}
            >
              <Tab
                inkBarStyle={{ background: "#ffffff" }}
                label={t("db_statistics:header.statistics")}
                className="fullheight"
              />
              <Tab
                label={t("db_statistics:header.add_slots")}
                className="fullheight"
              />
            </Tabs>
          ) : (
            ""
          )}
          <div style={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClickAnchor2}
            style={{ marginRight: "10px" }}
          >
            <VolumeUp style={{ marginRight: "5px" }} />
            <Typography variant="h6">Audio</Typography>
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClickAnchor}
            style={{ marginRight: "10px" }}
          >
            <TranslateIcon style={{ marginRight: "5px" }} />
            <Typography variant="h6">Language</Typography>
          </IconButton>
          <Menu
            id="menu-appbar2"
            keepMounted
            anchorEl={anchorEl2}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            open={Boolean(anchorEl2)}
            onClose={() => {
              setanchorEl2(null);
            }}
          >
            <MenuItem
              onClick={() => {
                setanchorEl2(null); //
              }}
            >
              On
            </MenuItem>
            <MenuItem
              onClick={() => {
                setanchorEl2(null);
              }}
            >
              Off
            </MenuItem>
          </Menu>
          <Menu
            id="menu-appbar"
            keepMounted
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            open={Boolean(anchorEl)}
            onClose={() => {
              setanchorEl(null);
            }}
          >
            <MenuItem
              onClick={() => {
                i18n.changeLanguage("en");
                setanchorEl(null);
              }}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => {
                i18n.changeLanguage("kn");
                setanchorEl(null);
              }}
            >
              ಕನ್ನಡ
            </MenuItem>
            <MenuItem
              onClick={() => {
                i18n.changeLanguage("hi");
                setanchorEl(null);
              }}
            >
              हिंदी
            </MenuItem>
          </Menu>
          {!props.disableLogout ? (
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
              <ExitApp style={{ marginRight: "5px" }} />
              <Typography variant="h6">
                {t("db_statistics:header.logout")}
              </Typography>
            </IconButton>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
