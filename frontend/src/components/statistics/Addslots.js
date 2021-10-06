import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import React from "react";
import { api_endpoint } from "../constants";
import ActiveSlotCard from "../activeSlotCard/activeSlotCard";
import AvailableSlots from "../availableSlots/availableSlots";
import BookingCard from "../bookingCard/bookingCard";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@material-ui-new/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import Select from "@material-ui/core/Select";
import Loader from "react-loader-spinner";

import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import BeneficiaryCard from "../beneficiaryCard/beneficiaryCard";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui-new/core/Chip";
import Navbar from "../navbar/Navbar";
import { CardHeader } from "@material-ui/core";
const Addslots = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);
  const [vaccname, setVaccName] = React.useState("");
  const [ageGrp, setAgeGrp] = React.useState("");
  const [doseNo, setDoseNo] = React.useState("");

  const handleVaccName = (event) => {
    setVaccName(event.target.value);
  };
  const handlesetAgeGrp = (event) => {
    setAgeGrp(event.target.value);
  };
  const handleDoseNo = (event) => {
    setDoseNo(event.target.value);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 450,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: "5px",
      boxShadow: "2px 4px 2px grey",
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
  }));
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const classes = useStyles();
  return (
    <>
      {!isLoading ? (
        <div style={{ margin: "0 auto", width: "80%" }}>
          <Card style={{ margin: "20px" }}>
            <CardHeader
              title="Remaining Slots"
              subheader="The numbers might update while you are on this page."
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gridRowGap: "20px",
                  gridColumnGap: "10px",
                }}
              >
                <AvailableSlots vaccine="COVISHIELD" ageGrp="18+" />
                <AvailableSlots vaccine="COVISHIELD" ageGrp="45+" />
                <AvailableSlots vaccine="COVAXIN" ageGrp="18+" />
                <AvailableSlots vaccine="COVAXIN" ageGrp="45+" />
              </div>
            </CardContent>
          </Card>
          <Card style={{ margin: "20px", width: "60%", margin: "auto" }}>
            <CardHeader
              title="Add Slots (20 August)"
              subheader="Select the appropriate tags to add slots for today."
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridRowGap: "20px",
                  gridColumnGap: "25px",
                  width: "40%",
                  margin: "auto",
                }}
              >
                <FormControl className={classes.formControl}>
                  <InputLabel id="vacc">Select Vaccine</InputLabel>
                  <Select
                    labelId="vacc"
                    id="vaccsel"
                    value={vaccname}
                    onChange={handleVaccName}
                  >
                    <MenuItem value={"Covishield"}>Covishield</MenuItem>
                    <MenuItem value={"Covaxin"}>Covaxin</MenuItem>
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id="dose">Select Dose</InputLabel>
                  <Select
                    labelId="dose"
                    id="dosesel"
                    value={doseNo}
                    onChange={handleDoseNo}
                  >
                    <MenuItem value={"Dose1"}>Dose 1</MenuItem>
                    <MenuItem value={"Dose2"}>Dose 2</MenuItem>
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="agegrp">Select Age Group</InputLabel>
                  <Select
                    labelId="agegrp"
                    id="agegrpsel"
                    value={ageGrp}
                    onChange={handlesetAgeGrp}
                  >
                    <MenuItem value={"18to45"}>18-45</MenuItem>
                    <MenuItem value={"45plus"}>45+</MenuItem>
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>
                <TextField
                  style={{ marginBottom: "10px" }}
                  id="standard-number"
                  label="Number of Slots"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <Divider />
              <Box
                style={{
                  display: "flex",
                  padding: "8px",
                  justifyItems: "flex-end",
                }}
              >
                <div style={{ flexGrow: 1 }}></div>
                <Button
                  color="primary"
                  variant="contained"
                  style={{
                    marginRight: "15px",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    background: "#0acb6a",
                    borderRadius: "20px",
                  }}
                  onClick={() => {
                    history.push("/confirmPage");
                  }}
                >
                  Book Slot(s)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Loader
          type="Oval"
          color="#00BFFF"
          height={80}
          width={80}
          style={{ position: "fixed", left: "50%", top: "50%" }}
        />
      )}
    </>
  );
};

export default Addslots;
