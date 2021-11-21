import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
const BookingCardAdd = (props) => {
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
  };
  const [vaccine, setVaccine] = React.useState("");

  const handleChangeVaccine = (event) => {
    setVaccine(event.target.value);
  };
  const classes = useStyles();
  // this card is used to add a new beneficiary to the form
  return (
    <>
      <div
        onClick={props.addCard}
        className={classes.root}
        style={{ cursor: "pointer" }}
      >
        <div className={classes.section1} style={{ display: "grid" }}>
          <div
            style={{
              display: "grid",
              padding: "4rem",
            }}
          >
            <div style={{ textAlign: "center", fontSize: "2rem" }}>
              {t("alt_flow:add_one_more")}
            </div>
            <AddCircleIcon
              style={{
                fontSize: "6rem",
                color: "#f2174f",
                textAlign: "center",
                alignSelf: "center",
                justifySelf: "center",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCardAdd;
