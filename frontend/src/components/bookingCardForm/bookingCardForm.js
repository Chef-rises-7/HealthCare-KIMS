import { Button, Grid, TextField } from "@material-ui-new/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
const BookingCardForm = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation(["alt_flow"]);
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
                        ? t("alt_flow:name_war")
                        : "\u00a0"
                    }
                    label={t("alt_flow:name")}
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
                        ? t("alt_flow:ref_war")
                        : "\u00a0"
                    }
                    r
                    label={t("alt_flow:ref_id")}
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
              <InputLabel id="vacc">{t("alt_flow:select_vacc")}</InputLabel>
              <Select
                labelId="vacc"
                id="vaccsel"
                value={props.valVacc}
                onChange={handleChangeVaccine}
              >
                <MenuItem value={"covishield"}>
                  {t("alt_flow:covishield")}
                </MenuItem>
                <MenuItem value={"covaxin"}>{t("alt_flow:covaxin")}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.section2}>
            <FormControl
              className={classes.formControl}
              error={Boolean(props.valDose === "")}
            >
              <InputLabel id="dose">{t("alt_flow:select_dose")}</InputLabel>
              <Select
                labelId="dose"
                id="dosesel"
                value={props.valDose}
                onChange={handlesetDose}
              >
                <MenuItem value={"dose1"}>{t("alt_flow:dose_1")}</MenuItem>
                <MenuItem value={"dose2"}>{t("alt_flow:dose_2")}</MenuItem>
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
                  ? t("alt_flow:birth_war")
                  : "\u00a0"
              }
              label={t("alt_flow:birth_year")}
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
              {t("alt_flow:remove")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCardForm;
