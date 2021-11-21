import { Divider, Grid } from "@material-ui-new/core";
import Chip from "@material-ui-new/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";

const BeneficiaryCard = (props) => {
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
      maxWidth: 400,
      minWidth: 350,
      margin: "15px",
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: "5px",
      boxShadow: "2px 4px 2px grey",
      borderWidth: "1px",
      borderColor: "#000000",
      borderStyle: "solid",
      fontSize: "1rem",
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

  const { t } = useTranslation(["beneficiary"]);
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
                }}
              >
                <PersonIcon />
                {props.name}
              </div>

              <div
                style={{
                  display: "flex",
                }}
              >
                {props.age < 45 ? (
                  <Chip
                    className={classes.chip}
                    style={{
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    color="primary"
                    label="18+"
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
                <Chip
                  className={classes.chip}
                  style={{
                    background: props.isDose1 ? "#1fd451" : "#d4241f",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  label={t("beneficiary:register.dose1")}
                  icon={
                    props.isDose1 ? (
                      <CheckOutlinedIcon style={{ color: "#ffffff" }} />
                    ) : (
                      <ClearOutlinedIcon style={{ color: "#ffffff" }} />
                    )
                  }
                />
                <Chip
                  className={classes.chip}
                  style={{
                    background: props.isDose2 ? "#1fd451" : "#d4241f",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  label={t("beneficiary:register.dose2")}
                  icon={
                    props.isDose2 ? (
                      <CheckOutlinedIcon style={{ color: "#ffffff" }} />
                    ) : (
                      <ClearOutlinedIcon style={{ color: "#ffffff" }} />
                    )
                  }
                />
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
            {"  "}
            {t("beneficiary:register.birth")} {props.birth_year}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "3px",
            }}
          >
            <ContactMailIcon style={{ marginRight: "5px" }} />
            {"  "} {t("beneficiary:register.photo")} {props.photo_id_type}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "3px",
            }}
          >
            <VerifiedUserOutlinedIcon style={{ marginRight: "5px" }} />
            {"  "} {t("beneficiary:register.id_number")} {props.photo_id_number}
          </div>
        </div>
        <Divider variant="middle" />
        {/* <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Dose-1: Appointment not Scheduled
          </Typography>
          <Typography gutterBottom variant="body1">
            Dose-2: Appointment not Scheduled
          </Typography>
        </div> */}
        <Divider variant="middle" />
      </div>
    </>
  );
};

export default BeneficiaryCard;
