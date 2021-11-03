import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import { api_endpoint1 } from "../constants";
import useSWR from "swr";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
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
import { makeStyles } from "@material-ui/core/styles";
import { CardHeader } from "@material-ui/core";

import { useTranslation } from 'react-i18next';
import {Howl, Howler} from 'howler';
import audio_hi from "../../audio/hi/add_slots.mp3"
import audio_en from "../../audio/en/add_slots.mp3" 


const Addslots = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);
  const [vaccname, setVaccName] = React.useState("");
  const [ageGrp, setAgeGrp] = React.useState("");
  const [doseNo, setDoseNo] = React.useState("");
  const [slotInfo, setSlotInfo] = React.useState([]);
  const [vaccNo, setVaccNo] = React.useState("0");
  const [isLoading2, setLoading2] = React.useState(true);
  const [dateInp, setDate] = React.useState(new Date());

  const { t, i18n } = useTranslation(["db_addslots","snack_bar","swal"]);


  const handleVaccName = (event) => {
    setVaccName(event.target.value);
  };
  const handlesetAgeGrp = (event) => {
    setAgeGrp(event.target.value);
  };
  const handleDoseNo = (event) => {
    setDoseNo(event.target.value);
  };
  const handleVaccNo = (event) => {
    setVaccNo(event.target.value);
  };
  const toUTCDate = (inp) => {
    return (
      inp.getUTCFullYear() +
      "-" +
      ("0" + (inp.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("0" + inp.getUTCDate()).slice(-2)
    );
  };

  React.useEffect(() => {
    console.log(i18n);
    var play;
    if(i18n.language =='en'){
      play = new Howl({
        src: audio_en,
        html5: true
      });      
    }
    else if(i18n.language =='hi'){
      play = new Howl({
        src: audio_hi,
        html5: true
      });  
    }
    else{

    }
    let timer = setTimeout(()=>{
      if(props.audio) {
        play.play();
      }
    },1000);
    return () => {
      play.stop();
      clearTimeout(timer);
    }
  },[])

  const addUpSlots = () => {
    let allVal = true;
    let posVal = true;
    if (parseInt(vaccNo) <= 0) posVal = false;
    if (vaccname === "" || ageGrp === "" || doseNo === "") allVal = false;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userTokenStaff")}`,
      },
      body: JSON.stringify({
        dose1: doseNo === "Dose1" ? true : false,
        dose2: doseNo === "Dose1" ? false : true,
        "18to45": ageGrp === "18to45" ? true : false,
        "45plus": ageGrp === "18to45" ? false : true,
        covishield: vaccname === "Covishield" ? true : false,
        covaxin: vaccname === "Covishield" ? false : true,
        availability: parseInt(vaccNo),
        date: toUTCDate(dateInp),
      }),
    };
    if (allVal && posVal) {
      Swal.fire({
        title: t("swal:add_slots_1.title"),
        text: t("swal:add_slots_1.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal:add_slots_1.confirmButtonText"),
      })
        .then((result) => {
          if (result.isConfirmed) {
            return fetch(
              api_endpoint1 + "/apis/addAndUpdateSlots/",
              requestOptions
            );
          }
        })
        .then((response) => {
          if (response.status == 200) return response.json();
          else throw new Error("Can't update slots, try again");
        })
        .then((res) => {
          setSlotInfo(res.data);
          Swal.fire({
            icon: "success",
            title: t("swal:add_slots_2.title"),
            text: t("swal:add_slots_2.text"),
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: t("swal:add_slots_3.title"),
            text: t("swal:add_slots_3.text"),
          });
          //   enqueueSnackbar(err, 3000);
        });
    } else {
      enqueueSnackbar(t('snack_bar:fill_all_details'), 2000);
    }
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
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userTokenStaff")}`,
      },
      body: JSON.stringify({ specification: "all" }),
    };

    fetch(api_endpoint1 + "/apis/getTokens/", requestOptions)
      .then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error("Failed to fetch slots, try again later");
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  React.useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(api_endpoint1 + "/apis/getSlots/", requestOptions)
      .then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error("Failed to fetch slots, try again later");
      })
      .then((data) => {
        console.log(data);
        setSlotInfo(data.slots);
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
        console.log(err);
      });
  }, []);

  const classes = useStyles();
  return (
    <>
      {!isLoading && !isLoading2 ? (
        <div
          style={{
            display: "grid",
            minHeight: "90vh",
            justifyContent: "center",
            alignContent: "center",
            gridTemplateColumns: "0.9fr 1.1fr",
            justifyItems: "center",
          }}
        >
          <Card
            style={{
              margin: "20px",
              width: "80%",
              margin: "auto",
              alignSelf: "center",
            }}
          >
            <div style={{ display: "grid" }}>
              <CardHeader
                title={t("db_addslots:add_slots")}
                subheader={t("db_addslots:slot_inst")}
              />
            </div>
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
                  <InputLabel id="vacc">{t("db_addslots:select_vaccine")}</InputLabel>
                  <Select
                    labelId="vacc"
                    id="vaccsel"
                    value={vaccname}
                    onChange={handleVaccName}
                  >
                    <MenuItem value={"Covishield"}>{t("db_addslots:covishield")}</MenuItem>
                    <MenuItem value={"Covaxin"}>{t("db_addslots:covaxin")}</MenuItem>
                  </Select>
                  <FormHelperText>{t("db_addslots:required")}</FormHelperText>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id="dose">{t("db_addslots:select_dose")}</InputLabel>
                  <Select
                    labelId="dose"
                    id="dosesel"
                    value={doseNo}
                    onChange={handleDoseNo}
                  >
                    <MenuItem value={"Dose1"}>{t("db_addslots:dose_1")}</MenuItem>
                    <MenuItem value={"Dose2"}>{t("db_addslots:dose_2")}</MenuItem>
                  </Select>
                  <FormHelperText>{t("db_addslots:required")}</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="agegrp">{t("db_addslots:select_age")}</InputLabel>
                  <Select
                    labelId="agegrp"
                    id="agegrpsel"
                    value={ageGrp}
                    onChange={handlesetAgeGrp}
                  >
                    <MenuItem value={"18to45"}>18-45</MenuItem>
                    <MenuItem value={"45plus"}>45+</MenuItem>
                  </Select>
                  <FormHelperText>{t("db_addslots:required")}</FormHelperText>
                </FormControl>
                <TextField
                  style={{ marginBottom: "10px" }}
                  id="standard-number"
                  label={t("db_addslots:number_slots_slots")}
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={vaccNo}
                  onChange={handleVaccNo}
                />
                <div
                  style={{ display: "flex", gridTemplateColumns: "auto auto" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyCcontent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("db_addslots:for_date")}
                  </div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      format="dd-MM-yyyy"
                      value={dateInp}
                      disablePast
                      onChange={(date) => {
                        setDate(date);
                      }}
                      style={{
                        margin: "10px",
                        justifySelf: "center",
                        width: "150px",
                      }}
                      className="forDate"
                    />
                  </MuiPickersUtilsProvider>
                </div>
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
                    addUpSlots();
                  }}
                >
                  {t("db_addslots:add_slots")}
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Card style={{ margin: "20px", width: "90%", alignSelf: "center" }}>
            <div style={{ display: "grid" }}>
              <CardHeader
                title={t("db_addslots:title")}
                subheader={t("db_addslots:sub_title")}
              />
            </div>
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gridColumnGap: "20px",
                  gridRowGap: "20px",
                  padding: "10px",
                }}
              >
                {slotInfo.map((slot) => (
                  <AvailableSlots
                    vaccine={slot.vaccine}
                    ageGrp={slot.age_group}
                    dose_choice={slot.dose_choice}
                    available={
                      parseInt(slot.availability) - parseInt(slot.booked) > 0
                        ? parseInt(slot.availability) - parseInt(slot.booked)
                        : 0
                    }
                  />
                ))}
              </div>
            </CardContent>
            <Divider />
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
