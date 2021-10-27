import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import React from "react";
import { api_endpoint } from "../constants";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@material-ui-new/core";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui-new/core/Chip";
const AvailableSlots = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let formikref = React.useRef(null);
  const {
    name,
    photo_id_type,
    vaccination_status,
    dose1_date,
    dose2_date,
    birth_year,
    photo_id_number,
  } = props;
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      minWidth: 260,
      maxWidth: 300,
      margin: "15px",
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: "5px",
      boxShadow: "2px 4px 2px grey",
      borderWidth: "1px",
      borderColor: "#000000",
      borderStyle: "solid",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    section1: {
      margin: theme.spacing(0.5),
    },
    section2: {
      margin: theme.spacing(2),
    },
    section3: {
      margin: theme.spacing(3, 1, 1),
    },
  }));

  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item xs>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  fontSize: "20px",
                }}
              >
                <ConfirmationNumberOutlinedIcon
                  style={{ marginRight: "5px" }}
                />
                Slot Tags:
              </div>
              <div
                style={{
                  display: "flex", // Set tag values according to props
                  flexGrow: 1,
                  alignItems: "flex-end",
                }}
              >
                {props.ageGrp === "18to45" ? (
                  <Chip
                    className={classes.chip}
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                    label="18-45"
                    color="primary"
                  />
                ) : (
                  <Chip
                    className={classes.chip}
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      background: "#a617f2",
                    }}
                    label="45+"
                  />
                )}
                {props.vaccine === "covaxin" ? (
                  <Chip
                    className={classes.chip}
                    style={{
                      background: "#f2ca17",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    label="COVAXIN"
                  />
                ) : (
                  <Chip
                    className={classes.chip}
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      background: "#f2174f",
                    }}
                    label="COVISHIELD"
                  />
                )}
                <Chip
                  className={classes.chip}
                  style={{
                    background: "#1fd451",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  label={props.dose_choice === "dose1" ? "Dose 1" : "Dose 2"}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <Divider variant="middle" />
        <div
          style={{
            textAlign: "center",
            fontSize: "2rem",
            color: props.available == 0 ? "red" : "black",
          }}
        >
          {props.available}
        </div>
        <Divider variant="middle" />
      </div>
    </>
  );
};

export default AvailableSlots;
