import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import Image from "material-ui-image";
import { sha256 } from "js-sha256";
import useSWR from "swr";
import React from "react";
import { api_key, secret } from "../constants";
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
import silence from "../../audio/silence.mp3"
import { api_endpoint } from "../constants";
import { useTranslation } from 'react-i18next';
import {Howl, Howler} from 'howler';
import audio_hi from "../../audio/hi/otp.mp3"
import audio_en from "../../audio/en/otp.mp3" 

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const otpExp = /^\d{6}$/;
const HandleOTP = (
  history,
  enqueueSnackbar,
  closeSnackbar,
  txnId,
  OTP,
  setErr,
  formikref,
  phoneNo,
  t
) => {
  setErr("\u00a0");
  enqueueSnackbar(t('snack_bar:verify_otp'));
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ txnId: String(txnId), otp: sha256(OTP) }),
  };
  fetch(api_endpoint + "/api/v2/auth/validateMobileOtp", requestOptions)
    .then((response) => {
      if (response.ok)
        // return { resCode: response.status, resBody: response.json() };
        return response.json();
      else {
        throw new Error("Unable to Verify OTP, Try again later");
      } // todo change
    })
    .then((data) => {
      console.log(data.resBody);
      formikref.current.setSubmitting(false);
      closeSnackbar();
      console.log(data);
      if (data.isNewAccount === "Y") {
        setTimeout(() => {
          window.open(
            "https://selfregistration.sandbox.cowin.gov.in",
            "_blank"
          );
        }, 1000);
        throw new Error("Your mobile number isn't registered with Co-WIN");
      }
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("phoneNo", phoneNo);

      history.replace({
        pathname: "/beneficiary",
        state: { tokenId: data.token, phoneNo: phoneNo, fromApp: true },
      });
    })
    .catch((err) => {
      closeSnackbar();
      formikref.current.setSubmitting(false);
      setErr(String(err));
    });
};

const HandleOTPResend = (
  enqueueSnackbar,
  closeSnackbar,
  phoneNo,
  setErr,
  setTxn,
  setSeconds,
  t
) => {
  setErr("\u00a0");
  enqueueSnackbar(t('snack_bar:generating_otp'));
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile: String(phoneNo), secret: secret }),
  };
  //   fetch(api_endpoint + "/api/v2/auth/generateOTP", requestOptions)
  fetch(api_endpoint + "/api/v2/auth/generateMobileOTP", requestOptions)
    .then((response) => {
      setSeconds(181);
      if (response.status == 200) return response.json();
      else throw new Error("Error while generating new OTP, try again ");
    })
    .then((data) => {
      console.log(data);
      closeSnackbar();
      setTxn(data.txnId);
    })
    .catch((err) => {
      closeSnackbar();
      setErr(String(err.Error));
    });
};
const LoginVerify = (props) => {
  //const navigate = useNavigate();
  const [errMsg, setErr] = React.useState("\u00a0");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { match, history } = props;
  const [seconds, setSeconds] = React.useState(181);
  const { t ,i18n} = useTranslation(["signinverify","snack_bar"]);
  //   const [txnId, settxnID] = React.useState(""); // do it in useeffect
  //   const [phoneNo, setPhoneNo] = React.useState("");

  const [txnId, settxnID] = React.useState(""); // do it in useeffect
  const [phoneNo, setPhoneNo] = React.useState("");

  React.useEffect(() => {
    console.log(i18n);
    var play;
    if(i18n.language =='en'){
      play = new Howl({
        src: audio_en,
        html5: true
      });      
    }
    else if(i18n.language =='hi'){
      play = new Howl({
        src: audio_hi,
        html5: true
      });  
    }
    else{

    }
    let timer = setTimeout(()=>{
      play.play();
    },1000);
    return () => {
      play.stop();
      clearTimeout(timer);
    }
  },[])


  React.useEffect(() => {
    if (!props.location.state) {
      history.replace("/signinotp");
    } else {
      settxnID(props.location.state.txnId);
      setPhoneNo(props.location.state.phoneNo);
    }
  }, []);
  React.useEffect(() => {
    console.log(props);
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }
  });
  let formikref = React.useRef(null);

  return (
    <>
      <div
        style={{
          display: "grid",
          height: "102vh",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Card style={{ width: "450px" }}>
          <CardContent style={{ width: "450px" }}>
            <Container
              maxWidth={450}
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
                  OTP: "",
                }}
                validationSchema={Yup.object().shape({
                  OTP: Yup.string()
                    .required("Please enter an OTP")
                    .max(6)
                    .matches(otpExp, "Please enter a 6-digit valid OTP"),
                })}
                onSubmit={({ OTP }) => {
                  console.log(formikref);
                  HandleOTP(
                    history,
                    enqueueSnackbar,
                    closeSnackbar,
                    txnId,
                    OTP,
                    setErr,
                    formikref,
                    phoneNo,
                    t
                  );

                  console.log(formikref);
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
                  setSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                      <Typography color="textPrimary" variant="h2">
                        {t("signinverify:verify_otp")}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body2"
                      >
                        {t("signinverify:otp_sent")} {phoneNo}{" "}
                        <Link component={RouterLink} to="/signin" variant="h6">
                          ({t("signinverify:change")})
                        </Link>
                      </Typography>
                    </Box>
                    <TextField
                      error={Boolean(touched.OTP && errors.OTP)}
                      fullWidth
                      helperText={
                        Boolean(touched.OTP && errors.OTP)
                          ? touched.OTP && errors.OTP
                          : errMsg
                      }
                      FormHelperTextProps={{
                        style: { color: "red", fontSize: "0.8rem" },
                      }}
                      label={t("signinverify:enter_otp")}
                      margin="normal"
                      name="OTP"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.OTP}
                      variant="outlined"
                    />
                    <Box sx={{ py: 1 }}>
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        {t("signinverify:verify_otp")}
                      </Button>
                    </Box>
                    <Box sx={{ py: 1 }}>
                      <Button
                        color="primary"
                        disabled={seconds > 0}
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={() => {
                          HandleOTPResend(
                            enqueueSnackbar,
                            closeSnackbar,
                            phoneNo,
                            setErr,
                            settxnID,
                            setSeconds,
                            t
                          );
                        }}
                      >
                        {t("signinverify:resend_otp")} {seconds > 0 ? `(${seconds} sec)` : ""}
                      </Button>
                    </Box>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      style={{ marginTop: "10px" }}
                    >
                      {t("signinverify:not_registered")}?{" "}
                      <a
                        href="https://selfregistration.sandbox.cowin.gov.in"
                        target="_blank"
                      >
                        ({t("signinverify:register_here")})
                      </a>
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

export default LoginVerify;
