import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import "./availableSlots.css";
import Image from "material-ui-image";
import { OldAge, YoungAge, Injection } from "../media/Icons";
import useSWR from "swr";
import React from "react";
import { api_endpoint } from "../constants";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import Icon from "@material-ui/core/SvgIcon";
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
  IconButton,
} from "@material-ui-new/core";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui-new/core/Chip";
const AvailableSlots = (props) => {
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
      minWidth: 280,
      maxWidth: 300,
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
                Slot Tags:
              </div>
              <div
                style={{
                  display: "flex", // Set tag values according to props
                  flexGrow: 1,
                  alignItems: "flex-start",
                }}
              >
                {props.ageGrp === "18to45" ? (
                  <Chip
                    className={`${classes.chip} customLabel`}
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                    label="18-45"
                    icon={
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.000000pt"
                        height="18.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <path
                            d="M2460 5109 c-158 -31 -293 -169 -327 -335 -63 -310 220 -579 527
					-499 326 85 430 493 183 726 -102 97 -241 136 -383 108z"
                          />
                          <path
                            d="M2465 4063 c-160 -21 -290 -56 -389 -106 -378 -189 -609 -693 -594
					-1299 4 -167 6 -179 32 -230 43 -86 112 -127 214 -128 63 0 107 17 144 56 46
					49 49 73 42 258 -10 257 16 460 83 636 l28 75 3 -675 c2 -371 -3 -1012 -10
					-1425 -7 -412 -13 -825 -13 -916 0 -164 0 -166 27 -207 76 -115 257 -135 371
					-41 63 52 79 96 88 247 10 158 29 1075 29 1390 l0 222 35 0 35 0 0 -177 c0
					-287 20 -1265 29 -1423 6 -118 12 -153 29 -187 82 -159 333 -177 430 -31 27
					41 27 43 27 212 0 94 -6 504 -12 911 -7 407 -15 1055 -18 1440 l-6 700 22 -40
					c32 -58 66 -165 91 -284 19 -92 22 -141 23 -366 1 -171 5 -267 12 -280 59
					-105 226 -127 332 -44 17 13 43 49 58 79 l28 55 0 225 c0 189 -4 244 -22 345
					-93 501 -341 843 -696 956 -116 37 -356 65 -452 52z"
                          />
                        </g>
                      </svg>
                    }
                    color="primary"
                  />
                ) : (
                  <Chip
                    className={`${classes.chip} customLabel`}
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      background: "#a617f2",
                    }}
                    label="45+"
                    icon={
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.000000pt"
                        height="18.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <path
                            d="M2932 5104 c-190 -51 -325 -211 -348 -414 -20 -176 93 -374 260 -455
					   100 -49 191 -62 288 -42 204 41 345 185 380 385 56 326 -259 613 -580 526z"
                          />
                          <path
                            d="M2248 4366 c-26 -8 -71 -27 -100 -44 -39 -21 -155 -56 -431 -126
					   -208 -54 -389 -101 -402 -106 -36 -14 -91 -67 -109 -105 -10 -20 -17 -57 -17
					   -83 -1 -37 187 -1027 207 -1095 3 -9 21 -37 39 -61 l33 -44 -26 -79 c-22 -65
					   -26 -97 -26 -193 l-1 -115 128 -479 127 -479 -136 -516 c-93 -352 -136 -533
					   -137 -571 -1 -146 124 -270 273 -270 106 0 221 87 253 190 52 171 297 1131
					   297 1167 0 32 -176 734 -205 821 -2 6 -3 12 -1 12 2 0 126 -175 274 -388 l270
					   -388 -165 -540 c-184 -600 -189 -625 -144 -716 43 -89 149 -158 241 -158 103
					   0 210 68 248 157 30 70 381 1230 388 1283 11 82 -16 132 -249 466 -119 171
					   -217 317 -217 324 0 7 39 125 86 262 48 137 85 250 83 252 -2 2 -40 27 -84 56
					   -326 217 -321 210 -318 425 1 83 5 224 9 315 l7 165 57 -270 c71 -341 65 -319
					   100 -358 47 -55 712 -500 766 -514 148 -38 290 99 254 247 -6 26 -23 63 -36
					   82 -14 19 -152 119 -327 239 l-302 206 -47 219 c-26 120 -46 222 -45 226 1 4
					   38 -69 81 -161 73 -155 107 -205 126 -184 20 23 102 285 107 343 6 76 -15 172
					   -52 236 l-24 42 -84 7 c-162 13 -287 75 -401 197 -52 56 -85 82 -117 94 -60
					   22 -192 27 -251 10z m-469 -770 c-35 -102 -66 -180 -70 -173 -12 22 -63 306
					   -57 313 8 7 182 52 187 48 2 -2 -25 -87 -60 -188z"
                          />
                          <path
                            d="M3757 2711 c-2 -21 -17 -66 -32 -99 -26 -59 -27 -60 -8 -88 15 -24
					   19 -56 23 -232 l5 -204 28 -24 c64 -55 148 -13 162 80 4 26 6 123 3 215 -4
					   162 -5 169 -35 234 -28 59 -110 157 -133 157 -4 0 -10 -17 -13 -39z"
                          />
                          <path
                            d="M3242 1264 l3 -1196 33 -29 c44 -40 93 -40 133 0 l29 29 0 1176 0
					   1176 -45 0 c-25 0 -68 9 -97 20 -29 11 -54 20 -56 20 -1 0 -1 -538 0 -1196z"
                          />
                        </g>
                      </svg>
                    }
                  />
                )}
                {props.vaccine === "covaxin" ? (
                  <Chip
                    className={`${classes.chip} customLabel`}
                    style={{
                      background: "#f2ca17",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    label="Covaxin"
                    labelStyle={{ paddingLeft: "2px" }}
                    icon={
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.000000pt"
                        height="18.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <path
                            d="M4054 5104 c-58 -29 -83 -111 -48 -164 9 -14 73 -82 141 -151 l125
					-126 -106 -99 c-58 -54 -106 -103 -106 -109 0 -6 88 -98 195 -205 l194 -194
					28 24 c15 13 65 60 110 104 l83 80 128 -127 c72 -71 144 -133 164 -142 48 -19
					91 -10 129 27 24 25 29 37 29 81 l0 51 -467 469 c-267 267 -482 475 -500 483
					-41 18 -60 17 -99 -2z"
                          />
                          <path
                            d="M3425 4820 c-53 -22 -85 -92 -65 -146 6 -16 55 -73 108 -127 l97 -97
					-173 -173 -172 -172 149 -150 c85 -85 153 -161 156 -175 9 -38 -27 -80 -68
					-80 -28 0 -52 20 -184 152 l-153 153 -132 -132 -133 -133 153 -153 c132 -133
					152 -158 152 -185 0 -39 -30 -72 -67 -72 -21 0 -58 32 -178 150 -83 83 -155
					150 -160 150 -5 0 -67 -57 -137 -127 l-128 -127 155 -156 c165 -167 176 -184
					135 -228 -13 -14 -33 -22 -52 -22 -27 0 -53 21 -185 152 l-153 153 -133 -133
					-132 -132 153 -153 c132 -132 152 -156 152 -184 0 -35 -38 -73 -73 -73 -13 0
					-77 56 -177 155 l-155 155 -133 -132 -132 -133 155 -155 c123 -124 155 -162
					155 -183 0 -37 -33 -67 -72 -67 -29 0 -51 19 -185 152 l-153 153 -132 -133
					-133 -132 152 -152 c83 -84 153 -160 154 -168 11 -60 -46 -104 -97 -76 -16 8
					-92 78 -169 155 l-140 141 -167 -167 c-93 -92 -168 -172 -168 -178 0 -5 53
					-63 117 -127 l118 -118 -143 -143 c-78 -78 -142 -146 -142 -151 0 -5 33 -40
					72 -77 l73 -67 -522 -524 c-472 -472 -523 -527 -523 -555 0 -39 33 -73 69 -73
					20 0 133 107 548 522 l523 523 75 -75 75 -75 148 148 147 147 123 -123 122
					-122 1308 1307 1307 1308 106 -105 c105 -104 106 -105 153 -105 41 0 53 5 82
					34 46 46 48 105 5 162 -51 69 -1255 1263 -1284 1273 -33 13 -64 13 -92 1z"
                          />
                        </g>
                      </svg>
                    }
                  />
                ) : (
                  <Chip
                    className={`${classes.chip} customLabel`}
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      background: "#f2174f",
                      paddingLeft: "2px",
                    }}
                    label="Covishield"
                    icon={
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.000000pt"
                        height="18.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <path
                            d="M4054 5104 c-58 -29 -83 -111 -48 -164 9 -14 73 -82 141 -151 l125
					-126 -106 -99 c-58 -54 -106 -103 -106 -109 0 -6 88 -98 195 -205 l194 -194
					28 24 c15 13 65 60 110 104 l83 80 128 -127 c72 -71 144 -133 164 -142 48 -19
					91 -10 129 27 24 25 29 37 29 81 l0 51 -467 469 c-267 267 -482 475 -500 483
					-41 18 -60 17 -99 -2z"
                          />
                          <path
                            d="M3425 4820 c-53 -22 -85 -92 -65 -146 6 -16 55 -73 108 -127 l97 -97
					-173 -173 -172 -172 149 -150 c85 -85 153 -161 156 -175 9 -38 -27 -80 -68
					-80 -28 0 -52 20 -184 152 l-153 153 -132 -132 -133 -133 153 -153 c132 -133
					152 -158 152 -185 0 -39 -30 -72 -67 -72 -21 0 -58 32 -178 150 -83 83 -155
					150 -160 150 -5 0 -67 -57 -137 -127 l-128 -127 155 -156 c165 -167 176 -184
					135 -228 -13 -14 -33 -22 -52 -22 -27 0 -53 21 -185 152 l-153 153 -133 -133
					-132 -132 153 -153 c132 -132 152 -156 152 -184 0 -35 -38 -73 -73 -73 -13 0
					-77 56 -177 155 l-155 155 -133 -132 -132 -133 155 -155 c123 -124 155 -162
					155 -183 0 -37 -33 -67 -72 -67 -29 0 -51 19 -185 152 l-153 153 -132 -133
					-133 -132 152 -152 c83 -84 153 -160 154 -168 11 -60 -46 -104 -97 -76 -16 8
					-92 78 -169 155 l-140 141 -167 -167 c-93 -92 -168 -172 -168 -178 0 -5 53
					-63 117 -127 l118 -118 -143 -143 c-78 -78 -142 -146 -142 -151 0 -5 33 -40
					72 -77 l73 -67 -522 -524 c-472 -472 -523 -527 -523 -555 0 -39 33 -73 69 -73
					20 0 133 107 548 522 l523 523 75 -75 75 -75 148 148 147 147 123 -123 122
					-122 1308 1307 1307 1308 106 -105 c105 -104 106 -105 153 -105 41 0 53 5 82
					34 46 46 48 105 5 162 -51 69 -1255 1263 -1284 1273 -33 13 -64 13 -92 1z"
                          />
                        </g>
                      </svg>
                    }
                  />
                )}
                <Chip
                  className={classes.chip}
                  style={{
                    background: "#1fd451",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  label={props.dose_choice === "dose1" ? "Dose 1" : "Dose 2"}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <Divider variant="middle" />
        <div
          style={{
            textAlign: "center",
            fontSize: "2rem",
            color: props.available == 0 ? "red" : "black",
          }}
        >
          {props.available}
        </div>
        <Divider variant="middle" />
      </div>
    </>
  );
};

export default AvailableSlots;
