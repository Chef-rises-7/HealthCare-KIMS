import { Checkbox, Divider, Grid } from "@material-ui-new/core";
import Chip from "@material-ui-new/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import PersonIcon from "@material-ui/icons/Person";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";

const BookingCard = (props) => {
  //name,birth_year, ageGrp,vaccination_status
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let formikref = React.useRef(null);

  const { t } = useTranslation(["slotbooking"]);

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
            {"  "}
            {t("slotbooking:year_of_birth")} {props.birth_year}
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
                ? t("slotbooking:dose_1")
                : t("slotbooking:dose_2")
            }
          />
          <Divider style={{ marginTop: "5px" }} variant="middle" />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              {t("slotbooking:select_vaccine")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={vaccine}
              onChange={handleChangeVaccine}
              disabled={!checked}
            >
              <MenuItem value={"Covishield"}>
                {t("slotbooking:covishield")}
              </MenuItem>
              <MenuItem value={"Covaxin"}>{t("slotbooking:covaxin")}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Divider variant="middle" />
      </div>
    </>
  );
};

export default BookingCard;
