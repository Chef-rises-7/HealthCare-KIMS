import { Divider, Grid } from "@material-ui-new/core";
import Chip from "@material-ui-new/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import PersonIcon from "@material-ui/icons/Person";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
const GeneratedCard = (props) => {
  const { t, i18n } = useTranslation([
    "slotbooking",
    "snack_bar",
    "confirmpage",
  ]);
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
      maxWidth: 350,
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
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Chip
                    className={classes.chip}
                    style={{
                      background: props.isConfirmed ? "#1fd451" : "#d4241f",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                    label={props.isConfirmed ? "Confirmed" : "Pending"}
                    icon={
                      !props.isConfirmed ? (
                        <ClearOutlinedIcon style={{ color: "#ffffff" }} />
                      ) : (
                        <CheckOutlinedIcon style={{ color: "#ffffff" }} />
                      )
                    }
                  />
                  <Chip
                    className={classes.chip}
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                    color="primary"
                    label={props.age > 45 ? "45+" : "18-45"}
                  />
                  <Chip
                    className={classes.chip}
                    style={{
                      background: "#f2174f",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                    label={String(props.vaccine).toUpperCase()}
                  />
                </div>
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
            <ContactMailIcon style={{ marginRight: "5px" }} />
            {"  "} {t("confirmpage:reference_id")} {props.beneficiary}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "3px",
            }}
          >
            <ConfirmationNumberOutlinedIcon style={{ marginRight: "5px" }} />
            {"  "} {t("confirmpage:token_number")} {props.token_number}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "3px",
            }}
          >
            <EventAvailableIcon style={{ marginRight: "5px" }} />
            {"  "} {t("confirmpage:date")} {props.date}
          </div>
        </div>
        <Divider variant="middle" />
      </div>
    </>
  );
};

export default GeneratedCard;
