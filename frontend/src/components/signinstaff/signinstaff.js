import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@material-ui-new/core";
import { Formik } from "formik";
import { Howl } from "howler";
import Image from "material-ui-image";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import { isExpired } from "react-jwt";
import * as Yup from "yup";
import audio_en from "../../audio/en/staff_login.mp3";
import audio_hi from "../../audio/hi/staff_login.mp3";
import { api_endpoint1 } from "../constants";
import Navbar from "../navbar/Navbar";

const HandleLogin = (
  history,
  enqueueSnackbar,
  closeSnackbar,
  staffId,
  password,
  formikref,
  t
) => {
  enqueueSnackbar(t("snack_bar:login"), { autoHideDuration: 3000 });
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: String(staffId),
      password: String(password),
    }),
  };
  //handle login with the password n username input
  fetch(api_endpoint1 + "/auth/login", requestOptions)
    .then((response) => {
      if (response.status == 200) return response.json();
      else throw new Error("Incorrect Staff ID or Password");
    })
    .then((data) => {
      formikref.current.setSubmitting(false);
      console.log(data);
      closeSnackbar();
      localStorage.setItem("userTokenStaff", data.jwt);
      history.replace({
        pathname: "/dashboard",
        state: { fromApp: true, jwt: data.jwt },
      });
    })
    .catch((err) => {
      formikref.current.setSubmitting(false);
      enqueueSnackbar(String(err), { autoHideDuration: 2000 });
    });
};

const Login = (props) => {
  const { t, i18n } = useTranslation(["staff_signin", "snack_bar"]);
  //handle language change
  React.useEffect(() => {
    console.log(i18n);
    var play;
    if (i18n.language == "en") {
      play = new Howl({
        src: audio_en,
        html5: true,
      });
    } else if (i18n.language == "hi") {
      play = new Howl({
        src: audio_hi,
        html5: true,
      });
    } else {
    }
    let timer = setTimeout(() => {
      if (props.audio) {
        play.play();
      }
    }, 1000);
    return () => {
      play.stop();
      clearTimeout(timer);
    };
  }, []);

  const { match, history } = props;
  React.useEffect(() => {
    var userTokenStaff = localStorage.getItem("userTokenStaff");
    const isMyTokenExpired = isExpired(userTokenStaff);
    console.log(isMyTokenExpired);
    if (!isMyTokenExpired && userTokenStaff !== "") {
      history.replace({
        pathname: "/dashboard",
        state: { fromApp: true, jwt: userTokenStaff },
      });
    }
  }, []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let formikref = React.useRef(null);
  return (
    <>
      <Navbar {...props} disableLogout={true} />
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "10px",
                  marginBottom: "5px",
                }}
              >
                <Image
                  style={{
                    backgroundColor: "#ffffff",
                    width: "170px",
                    height: "170px",
                    paddingTop: 0,
                    margin: "auto",
                  }}
                  imageStyle={{
                    width: "170px",
                    height: "170px",
                    margin: "auto",
                  }}
                  src="/logo1gg.jpeg"
                />
                <Image
                  style={{
                    backgroundColor: "#ffffff",
                    width: "170px",
                    height: "170px",
                    paddingTop: 0,
                    margin: "auto",
                  }}
                  imageStyle={{
                    width: "170px",
                    height: "170px",
                    margin: "auto",
                  }}
                  src="/logo2gg.png"
                />
              </div>
              <Formik
                innerRef={formikref}
                initialValues={{
                  phoneNo: "",
                }}
                validationSchema={Yup.object().shape({
                  staffId: Yup.string().required(
                    t("staff_signin:staff_validation")
                  ),
                  password: Yup.string().required(
                    t("staff_signin:pass_validation")
                  ),
                })}
                onSubmit={({ staffId, password }) => {
                  console.log(formikref);
                  HandleLogin(
                    history,
                    enqueueSnackbar,
                    closeSnackbar,
                    staffId,
                    password,
                    formikref,
                    t
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
                        {t("staff_signin:sign_in")}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body2"
                      >
                        {t("staff_signin:title")}{" "}
                      </Typography>
                    </Box>
                    <TextField
                      style={{ margin: 0 }}
                      error={Boolean(touched.staffId && errors.staffId)}
                      fullWidth
                      helperText={
                        Boolean(touched.staffId && errors.staffId)
                          ? touched.staffId && errors.staffId
                          : "\u00a0"
                      }
                      label={t("staff_signin:staff_id")}
                      margin="normal"
                      name="staffId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.staffId}
                      variant="outlined"
                    />
                    <TextField
                      style={{ margin: 0, marginTop: "10px" }}
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={
                        Boolean(touched.password && errors.password)
                          ? touched.password && errors.password
                          : "\u00a0"
                      }
                      label={t("staff_signin:password")}
                      margin="normal"
                      type="password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
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
                        {t("staff_signin:sign_in")}
                      </Button>
                    </Box>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      style={{ marginTop: "10px" }}
                    >
                      {t("staff_signin:forgot_password")}
                    </Typography>
                  </form>
                )}
              </Formik>
            </Container>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
