import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import React from "react";
import { api_endpoint } from "../constants";
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
  Checkbox,
} from "@material-ui-new/core";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui-new/core/Chip";
const BookingCard = (props) => {
  //name,birth_year, ageGrp,vaccination_status
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
      maxWidth: 450,
      minWidth: 300,
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.handleCheck(props.id, event.target.checked);
  };
  const [vaccine, setVaccine] = React.useState("");

  const handleChangeVaccine = (event) => {
    setVaccine(event.target.value);
    props.handleVaccine(props.id, String(event.target.value).toLowerCase());
  };
  const classes = useStyles();
  return (
    <>
      <div
        className={classes.root}
        style={
          checked
            ? {
                borderColor: "#25cb5c",
                boxShadow: "2px 4px 2px #25cb5c",
              }
            : {}
        }
      >
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item xs>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
                <PersonIcon />
                {props.name}
                <div style={{ flexGrow: 1 }} />
              </div>
            </Grid>
          </Grid>
        </div>
        <Divider variant="middle" />
        <div className={classes.section2}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "3px",
            }}
          >
            <EventAvailableIcon style={{ marginRight: "5px" }} />
            {"  "}Year of Birth: {props.birth_year}
          </div>
          {props.ageGrp === "18to45" ? (
            <Chip
              className={classes.chip}
              style={{
                fontSize: "14px",
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
                fontSize: "14px",
                fontWeight: "bold",
                color: "#ffffff",
                background: "#a617f2",
              }}
              label="45+"
            />
          )}
          <Chip
            className={classes.chip}
            style={{
              background: "#1fd451",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            label={
              props.vaccination_status === "Not Vaccinated"
                ? "Dose 1"
                : "Dose 2"
            }
          />
          <Divider style={{ marginTop: "5px" }} variant="middle" />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              Select Vaccine
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={vaccine}
              onChange={handleChangeVaccine}
              disabled={!checked}
            >
              <MenuItem value={"Covishield"}>Covishield</MenuItem>
              <MenuItem value={"Covaxin"}>Covaxin</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Divider variant="middle" />
      </div>
    </>
  );
};

export default BookingCard;
