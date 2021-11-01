import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import Loader from "react-loader-spinner";
import React from "react";
import AvailableSlots from "../availableSlots/availableSlots";

import { api_endpoint, api_key, api_endpoint1, secret } from "../constants";
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
  CardHeader,
  Divider,
} from "@material-ui-new/core";
import { useTranslation } from 'react-i18next';

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const phoneNoExp = /^[6-9]\d{9}$/;

const HandleLogin = (
  history,
  enqueueSnackbar,
  closeSnackbar,
  phoneNo,
  formikref
) => {
  enqueueSnackbar("Generating OTP...", { autoHideDuration: 3000 });
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ mobile: String(phoneNo), secret: secret }),
  };
  //   fetch(api_endpoint + "/api/v2/auth/generateOTP", requestOptions)
  fetch(api_endpoint + "/api/v2/auth/generateMobileOTP", requestOptions)
    .then((response) => {
      if (response.status == 200) return response.json();
      else throw new Error("Error while generating new OTP, try again ");
    })
    .then((data) => {
      formikref.current.setSubmitting(false);
      console.log(data);
      closeSnackbar();
      history.push({
        pathname: "/signinverify",
        state: { txnId: data.txnId, phoneNo: phoneNo, fromApp: true },
      });
    })
    .catch((err) => {
      formikref.current.setSubmitting(false);
      enqueueSnackbar(String(err), { autoHideDuration: 3000 });
    });
};

const Login = (props) => {
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);
  const [isLoading2, setLoading2] = React.useState(true);
  const [slotInfo, setSlotInfo] = React.useState([]);
  const { t } = useTranslation(["signinotp"]);

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
  React.useEffect(() => {
    var userToken = localStorage.getItem("userToken");
    var phoneNo = localStorage.getItem("phoneNo");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };
    if (phoneNo !== "") {
      fetch(api_endpoint + "/api/v2/appointment/beneficiaries", requestOptions)
        .then((response) => {
          console.log(response.status, response.status == 401);
          if (response.status != 401) {
            history.replace({
              pathname: "/beneficiary",
              state: {
                fromApp: true,
                tokenId: userToken,
                phoneNo: phoneNo,
              },
            });
          } else {
            setLoading(false);
            localStorage.setItem("userToken", "");
            localStorage.setItem("phoneNo", "");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else setLoading(false);
  }, []);
  let formikref = React.useRef(null);
  return (
    <>
      {!isLoading && !isLoading2 ? (
        <div
          style={{
            display: "grid",
            minHeight: "99vh",
            justifyContent: "center",
            alignContent: "center",
            gridTemplateColumns: "0.9fr 1.1fr",
            justifyItems: "center",
          }}
        >
          <Card
            style={{
              width: "450px",
              alignSelf: "center",
            }}
          >
            <CardContent>
              <Container
                maxWidth="sm"
                style={{
                  display: "grid",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Image
                  style={{
                    backgroundColor: "#f4f6f8",
                    width: "200px",
                    height: "200px",
                    paddingTop: 0,
                    margin: "auto",
                  }}
                  imageStyle={{
                    width: "200px",
                    height: "200px",
                    margin: "auto",
                  }}
                  src="/logo512.png"
                />
                <Formik
                  innerRef={formikref}
                  initialValues={{
                    phoneNo: "",
                  }}
                  validationSchema={Yup.object().shape({
                    phoneNo: Yup.string()
                      .required("Phone number is required")
                      .matches(phoneNoExp, "Invalid phone number"),
                  })}
                  onSubmit={({ phoneNo }) => {
                    console.log(formikref);
                    HandleLogin(
                      history,
                      enqueueSnackbar,
                      closeSnackbar,
                      phoneNo,
                      formikref
                    );
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Box sx={{ mb: 3 }}>
                        <Typography color="textPrimary" variant="h2">
                          {t('signinotp:sign_in')}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          gutterBottom
                          variant="body2"
                        >
                          An OTP will be sent to your mobile number for
                          verification{" "}
                        </Typography>
                      </Box>
                      <TextField
                        error={Boolean(touched.phoneNo && errors.phoneNo)}
                        fullWidth
                        helperText={
                          Boolean(touched.phoneNo && errors.phoneNo)
                            ? touched.phoneNo && errors.phoneNo
                            : "\u00a0"
                        }
                        label="Phone number"
                        margin="normal"
                        name="phoneNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.phoneNo}
                        variant="outlined"
                      />
                      <Box sx={{ py: 2 }}>
                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          Get OTP
                        </Button>
                      </Box>
                      <Typography
                        color="textSecondary"
                        variant="body1"
                        style={{ marginTop: "10px" }}
                      >
                        Haven't registered on Co-WIN?{" "}
                        <a
                          href="https://selfregistration.sandbox.cowin.gov.in"
                          target="_blank"
                        >
                          Register here
                        </a>
                      </Typography>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body1"
                        style={{ marginTop: "10px" }}
                      >
                        <Link
                          component={RouterLink}
                          to="/signinstaff"
                          variant="body1"
                        >
                          Staff Login
                        </Link>
                      </Typography>
                    </form>
                  )}
                </Formik>
              </Container>
            </CardContent>
          </Card>
          <Card style={{ margin: "20px", width: "90%", alignSelf: "center" }}>
            <CardHeader
              title="Available Slots"
              subheader="The numbers might update during the booking procedure."
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))",
                  gridColumnGap: "25px",
                  gridRowGap: "2px",
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

export default Login;
