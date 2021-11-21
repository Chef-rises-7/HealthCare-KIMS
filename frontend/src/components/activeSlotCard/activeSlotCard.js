import { Button, Divider, Grid } from "@material-ui-new/core";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
const ActiveSlotCard = (props) => {
  //benNo,date, tokenIds, genPdf
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation(["beneficiary"]);
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
                  fontSize: "20px",
                }}
              >
                <ConfirmationNumberOutlinedIcon
                  style={{ marginRight: "5px" }}
                />
                {t("beneficiary:active.token")} {props.tokenIds}
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
            {t("beneficiary:active.date")} {props.date}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "3px",
            }}
          >
            <PeopleAltOutlinedIcon style={{ marginRight: "5px" }} />
            {t("beneficiary:active.beneficiaries")} ({props.benNo})
          </div>
        </div>
        <Divider variant="middle" />
        <div className={classes.section2}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              color="primary"
              variant="contained"
              style={{ fontWeight: "bold", borderRadius: "20px" }}
              onClick={() => {
                props.genPdf(props.activeObj, props.qrPayload);
              }}
            >
              <GetAppOutlinedIcon />
              {t("beneficiary:active.download")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveSlotCard;
