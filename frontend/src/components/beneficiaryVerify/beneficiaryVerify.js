import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
} from "@material-ui-new/core";
import { CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Howl } from "howler";
import { jsPDF } from "jspdf";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import audio_en from "../../audio/en/secret_code.mp3";
import audio_hi from "../../audio/hi/secret_code.mp3";
import ActiveSlotCard from "../activeSlotCard/activeSlotCard";
import BeneficiaryCard from "../beneficiaryCard/beneficiaryCard";
import { api_endpoint, api_endpoint1 } from "../constants";
import Navbar from "../navbar/Navbar";
import "./beneficiaryVerify.css";

const BeneficiaryVerify = (props) => {
  //const navigate = useNavigate();
  //initialise all states here
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoadingAS, setLoadingAS] = React.useState(true);
  const [isLoadingOS, setLoadingOS] = React.useState(true);
  const [benData, setBenData] = React.useState([]);
  const [activeSlot, setActiveSlot] = React.useState({});
  const [benCode, setBenCode] = React.useState("");

  const { t, i18n } = useTranslation(["beneficiary", "snack_bar", "swal"]);

  const downloadQRCode = (arr, payload) => {
    enqueueSnackbar("Generating PDF, please wait.");
    // const qrCodeURL = document
    //   .getElementById("qrCodeEl")
    //   .toDataURL("image/png")
    //   .replace("image/png", "image/octet-stream");
    // console.log(qrCodeURL);
    // let aEl = document.createElement("a");
    // aEl.href = qrCodeURL;
    // aEl.download = "QRToken.png";
    // document.body.appendChild(aEl);
    // aEl.click();
    // document.body.removeChild(aEl);
    // Don't forget, that there are CORS-Restrictions. So if you want to run it without a Server in your Browser you need to transform the image to a dataURL
    var doc = new jsPDF();
    doc.setFontSize(20);
    var line = 20; // Line height to start text at
    var lineHeight = 10;
    var leftMargin = 20;
    var wrapWidth = 180;
    var longString = "KIMS Hospital";

    var splitText = doc.splitTextToSize(longString, wrapWidth);
    for (var i = 0, length = splitText.length; i < length; i++) {
      // loop thru each line and increase
      doc.text(splitText[i], 85, line);
      line = lineHeight + line;
    }
    doc.setFontSize(15);
    doc.text(
      "Please find the vaccination token details below.",
      leftMargin,
      line
    );
    line = 7 + line;
    // template to generate PDF
    doc.setFontSize(10);
    arr.map((token, id) => {
      doc.text(`${id + 1}) Name: ${token.name}`, leftMargin, line);
      line = 5 + line;
      doc.text(`Age: ${token.age}`, leftMargin + 4, line);
      line = 5 + line;
      doc.text(`Vaccine: ${token.vaccine}`, leftMargin + 4, line);
      line = 5 + line;
      doc.text(`Token number: ${token.token_number}`, leftMargin + 4, line);
      line = 5 + line;
      doc.text(`Reference ID: ${token.beneficiary}`, leftMargin + 4, line);
      line = 5 + line;
      doc.text(`Date: ${token.date}`, leftMargin + 4, line);
      line = 5 + line;
      doc.text(
        `Confirmation Status: ${
          parseInt(token.availability) - parseInt(token.booked) > 0
            ? `Confirmed`
            : `Pending`
        }`,
        leftMargin + 4,
        line
      );
      line = 10 + line;
    });
    doc.setFontSize(15);
    doc.text("QR code", leftMargin + 75, line);
    line = line + 8;
    var img = new Image();
    // use api to get qr code image
    img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${payload}&amp;size=150x150`;
    img.onload = function () {
      doc.addImage(img, "PNG", leftMargin + 65, line, 40, 40);
      closeSnackbar();
      doc.save("Confirmation.pdf");
    };
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 450,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: "5px",
      boxShadow: "2px 4px 2px grey",
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
  // voice configuration
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

  React.useEffect(() => {
    console.log(props.location);
    // redirect if user is trying to access the route directly without logging in.
    if (!props.location.state) {
      history.replace("/signinotp");
      return;
    }
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.location.state.tokenId,
      },
    };
    fetch(api_endpoint + "/api/v2/appointment/beneficiaries", requestOptions)
      .then((response) => {
        if (response.status == 200) return response.json();
        else if (response.status == 401) {
          // handle the case where token is expired
          enqueueSnackbar(t("snack_bar:session_expire"), 1500);
          history.replace("/signinotp");
          return [];
        } else
          history.replace({
            pathname: "/slotBookingForm",
            state: { fromApp: true },
          });
        return []; // alt page
      })
      .then((data) => {
        console.log(data);
        setLoadingAS(false);
        setBenData(data.beneficiaries);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: props.location.state.phoneNo }),
    };
    fetch(api_endpoint1 + "/apis/getActiveSlots/", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((activeData) => {
        console.log(activeData);
        setLoadingOS(false);
        setActiveSlot(activeData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const classes = useStyles();
  return (
    <>
      <Navbar {...props} />
      {!isLoadingAS && !isLoadingOS ? (
        <div style={{ margin: "0 auto", width: "90%" }}>
          {activeSlot.message === "Beneficiaries Found" ? (
            <Card
              style={{ margin: "0px", marginTop: "10px" }}
              className="tempCard"
            >
              <CardHeader
                title={t("beneficiary:active.title")}
                subheader={t("beneficiary:active.sub_title")}
              />
              <Divider />
              <CardContent>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(330px, 1fr))",
                    gridColumnGap: "30px",
                    gridRowGap: "30px",
                    padding: "10px",
                  }}
                >
                  {Object.keys(activeSlot.data).map((key) => {
                    let activeObj = activeSlot.data[key];
                    let benNo = activeSlot.data[key].length;
                    let tokenIds = activeSlot.data[key]
                      .map((obj) => obj.token_number)
                      .toString();
                    let bookDate = activeObj[0].date;
                    let qrPayload = activeObj[0].qr_payload;
                    return (
                      <ActiveSlotCard
                        benNo={benNo}
                        tokenIds={tokenIds}
                        date={bookDate}
                        activeObj={activeObj}
                        genPdf={downloadQRCode}
                        qrPayload={qrPayload}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div></div>
          )}
          <Card style={{ marginTop: "15px" }} className="tempCard">
            <CardHeader
              title={t("beneficiary:register.title")}
              subheader={t("beneficiary:register.sub_title")}
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                  gridColumnGap: "20px",
                  gridRowGap: "20px",
                }}
              >
                {benData.map((ben) => (
                  <BeneficiaryCard
                    name={ben.name}
                    photo_id_type={ben.photo_id_type}
                    photo_id_number={ben.photo_id_number}
                    isDose1={
                      ben.vaccination_status == "Partially Vaccinated" ||
                      ben.vaccination_status == "Vaccinated"
                        ? true
                        : false
                    }
                    isDose2={
                      ben.vaccination_status == "Vaccinated" ? true : false
                    }
                    age={2021 - parseInt(ben.birth_year)} // todo fix this
                    birth_year={ben.birth_year}
                  />
                ))}
              </div>
              <Divider />
              <CardHeader
                title={t("beneficiary:secret.title")}
                subheader={
                  <div>
                    {t("beneficiary:secret.sub_title")}.{" "}
                    {t("swal:error.find_code")}
                    <a
                      href="https://selfregistration.cowin.gov.in/"
                      target="_blank"
                    >
                      {t("swal:error.here")}
                    </a>
                  </div>
                }
              />
              <Divider />
              <Box
                style={{
                  display: "flex",
                  padding: "8px",
                }}
              >
                <TextField
                  id="outlined-search"
                  label="Secret Code"
                  type="search"
                  variant="outlined"
                  style={{ flexGrow: 1 }}
                  onChange={(event) => {
                    setBenCode(event.target.value);
                  }}
                />

                <Button
                  color="primary"
                  variant="contained"
                  style={{
                    marginRight: "15px",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    background: "#0acb6a",
                    borderRadius: "20px",
                  }}
                  onClick={() => {
                    let isVerified = false;
                    benData.forEach((ben) => {
                      if (
                        String(ben.beneficiary_reference_id).substr(-4) ===
                        benCode
                      )
                        isVerified = true;
                    });
                    if (isVerified)
                      history.push({
                        pathname: "/slotBooking",
                        state: {
                          bens: benData,
                          phoneNo: props.location.state.phoneNo,
                          fromApp: true,
                        },
                      });
                    else {
                      Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `${t("swal:error.invalid_secret")}`,
                        footer: `<p>${t(
                          "swal:error.find_code"
                        )}  <a href="https://selfregistration.cowin.gov.in/" target="_blank">${t(
                          "swal:error.here"
                        )}</a></p>`,
                      });
                    }
                  }}
                >
                  {t("beneficiary:secret.verify_details")}
                </Button>
              </Box>
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
      {/* handle the case where data is not loaded with a loader*/}
    </>
  );
};

export default BeneficiaryVerify;
