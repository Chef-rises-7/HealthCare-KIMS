import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import React from "react";
import { api_endpoint } from "../constants";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
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
const BookingCardForm = (props) => {
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
      minWidth: 150,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const handleChangeName = (event) => {
    // setBenName(event.target.value);
    props.handleUserName(event, props.index);
  };
  const handleRefID = (event) => {
    // setRefid(event.target.value);
    props.handleRefID(event, props.index);
  };
  const handleChangeVaccine = (event) => {
    // setVaccine(event.target.value);
    props.handleVaccName(event, props.index);
  };
  const handlesetAgeGrp = (event) => {
    // setAgeGrp(event.target.value);
    props.handlesetAgeGrp(event, props.index);
  };
  const handlesetDose = (event) => {
    // setDose(event.target.value);
    props.handleDoseNo(event, props.index);
  };
  const egObj = {
    name: "Omkar",
    photo_id_type: "Aadhar",
    vaccination_status: "done",
    dose1_date: "12/2/2021",
    dose2_date: "12/2/2021",
    birth_year: 2021,
    photo_id_number,
  };
  const classes = useStyles();

  return (
    <>
      <div
        className={classes.root}
        style={{
          borderColor: "#000000",
        }}
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
                <div
                  style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}
                >
                  <PersonIcon
                    style={{
                      alignSelf: "center",
                      justifySelf: "center",
                      marginRight: "10px",
                    }}
                  />
                  <TextField
                    error={Boolean(props.valUser === "")}
                    fullWidth
                    helperText={
                      Boolean(props.valUser === "")
                        ? "Name is required"
                        : "\u00a0"
                    }
                    label="Name"
                    margin="normal"
                    onChange={handleChangeName}
                    value={props.valUser}
                    id="standard-basic"
                    variant="standard"
                    style={{ marginTop: "0" }}
                  />
                </div>
                <div
                  style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}
                >
                  <ContactMailIcon
                    style={{
                      alignSelf: "center",
                      justifySelf: "center",
                      marginRight: "10px",
                    }}
                  />
                  <TextField
                    error={Boolean(props.valRef === "")}
                    fullWidth
                    helperText={
                      Boolean(props.valRef === "")
                        ? "Reference ID is required"
                        : "\u00a0"
                    }
                    label="Reference ID"
                    margin="normal"
                    onChange={handleRefID}
                    value={props.valRef}
                    id="standard-basic"
                    variant="standard"
                    style={{ marginTop: "0" }}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div className={classes.section2}>
            <FormControl
              className={classes.formControl}
              error={Boolean(props.valVacc === "")}
            >
              <InputLabel id="vacc">Select Vaccine</InputLabel>
              <Select
                labelId="vacc"
                id="vaccsel"
                value={props.valVacc}
                onChange={handleChangeVaccine}
              >
                <MenuItem value={"covishield"}>Covishield</MenuItem>
                <MenuItem value={"covaxin"}>Covaxin</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.section2}>
            <FormControl
              className={classes.formControl}
              error={Boolean(props.valDose === "")}
            >
              <InputLabel id="dose">Select Dose</InputLabel>
              <Select
                labelId="dose"
                id="dosesel"
                value={props.valDose}
                onChange={handlesetDose}
              >
                <MenuItem value={"dose1"}>Dose 1</MenuItem>
                <MenuItem value={"dose2"}>Dose 2</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div className={classes.section2}>
            <TextField
              error={Boolean(props.valAge === "")}
              fullWidth
              helperText={
                Boolean(props.valAge === "")
                  ? "Birth Year is required"
                  : "\u00a0"
              }
              label="Birth Year"
              margin="normal"
              onChange={handlesetAgeGrp}
              value={props.valAge}
              id="standard-basic"
              variant="standard"
              style={{ marginTop: "0" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignContent: "center",
              alignItems: "end",
            }}
          >
            <div style={{ flexGrow: 1 }}></div>
            <Button
              variant="contained"
              style={{
                fontWeight: "bold",
                borderRadius: "20px",
                background: "red",
                maxHeight: "40px",
                marginBottom: "10px",
                marginTop: "30px",
              }}
              onClick={() => {
                props.delCard(props.index);
              }}
            >
              <DeleteIcon />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCardForm;
