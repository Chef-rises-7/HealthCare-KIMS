import {
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@material-ui-new/core";
import { CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import { Howl } from "howler";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSnackbar } from "notistack";
import QRCode from "qrcode.react";
import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import audio_en from "../../audio/en/token_success.mp3";
import audio_hi from "../../audio/hi/token_success.mp3";
import GeneratedCard from "../generatedCard/generatedCard";
import Navbar from "../navbar/Navbar";

const ConfirmationPage = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);

  const { t, i18n } = useTranslation([
    "slotbooking",
    "snack_bar",
    "confirmpage",
  ]);

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
    if (!props.location.state) {
      history.replace("/signinotp");
      return;
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
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
  const downloadQRCode = (arr, payload) => {
    enqueueSnackbar(t("snack_bar:generate_pdf"));
    // define template for pdf
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
    const input = document.getElementById("qrCodeEl");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      doc.addImage(imgData, "PNG", leftMargin + 65, line, 40, 40);
      // pdf.output('dataurlnewwindow');
      doc.save("download.pdf");
      closeSnackbar();
    });
  };

  const classes = useStyles();
  return (
    <>
      <Navbar {...props} />
      {!isLoading ? (
        <div style={{ margin: "0 auto", width: "80%" }}>
          <Card style={{ margin: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.5fr 20fr" }}>
              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon
                  style={{
                    marginLeft: "5px",
                    alignSelf: "center",
                    color: "red",
                  }}
                  fontSize="large"
                />
              </div>
              <CardHeader
                title={t("confirmpage:slot_bookd_confirmation")}
                subheader={t("confirmpage:donwload_qr_code")}
              />
            </div>
            <Divider />
            <CardContent>
              <div
                style={{
                  alignItems: "center",
                }}
              >
                <Typography variant="h3">
                  {t("confirmpage:token_details")}
                </Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gridRowGap: "20px",
                    gridColumnGap: "25px",
                  }}
                >
                  {props.location.state.response_tokens.map((token) => (
                    <GeneratedCard
                      name={token.name}
                      age={token.age}
                      vaccine={token.vaccine}
                      beneficiary={token.beneficiary}
                      token_number={token.token_number}
                      date={token.date}
                      isConfirmed={
                        parseInt(token.availability) - parseInt(token.booked) >
                        0
                      }
                    />
                  ))}
                </div>
              </div>
              <Divider variant="middle" />
              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h3"
                  style={{ marginTop: "10px", textAlign: "center" }}
                >
                  {t("confirmpage:token_qr_code")}
                </Typography>
                <QRCode
                  id="qrCodeEl"
                  size={200}
                  value={props.location.state.qrPayload}
                  style={{ margin: "20px" }}
                />
                <Button
                  color="primary"
                  variant="contained"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "20px",
                    background: "#25cb5c",
                  }}
                  onClick={() => {
                    downloadQRCode(
                      props.location.state.response_tokens,
                      props.location.state.qrPayload
                    );
                  }}
                >
                  <GetAppOutlinedIcon />
                  {t("confirmpage:download")}
                </Button>
              </div>
              <Divider variant="middle" style={{ marginTop: "20px" }} />
              <div>
                <Typography variant="h3" style={{ marginTop: "10px" }}>
                  {t("confirmpage:post_booking_instruction")}
                </Typography>
              </div>
              <ul>
                <li>{t("confirmpage:post_inst_1")}</li>
                <li>{t("confirmpage:post_inst_2")}</li>
              </ul>
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

export default ConfirmationPage;
