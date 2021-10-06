import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import useSWR from "swr";
import Loader from "react-loader-spinner";
import React from "react";
import { api_endpoint, api_key } from "../constants";
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
} from "@material-ui-new/core";

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
      "x-api-key": api_key,
      accept: "application/json",
    },
    body: JSON.stringify({ mobile: String(phoneNo) }),
  };
  fetch(api_endpoint + "/api/v2/auth/generateOTP", requestOptions)
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

  React.useEffect(() => {
    var userToken = localStorage.getItem("userToken");
    var phoneNo = localStorage.getItem("phoneNo");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
        "X-API-KEY": api_key,
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

            // history.replace({
            //   pathname: "/slotBookingForm",
            //   state: {
            //     fromApp: true,
            //     phoneNo: phoneNo,
            //   },
            // });
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
      {!isLoading ? (
        <div
          style={{
            display: "grid",
            height: "102vh",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Card style={{ width: "450px" }}>
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
                          Sign in
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
                          href="https://selfregistration.cowin.gov.in"
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
