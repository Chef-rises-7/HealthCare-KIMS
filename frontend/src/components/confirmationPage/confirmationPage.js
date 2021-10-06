import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import useSWR from "swr";
import { jsPDF } from "jspdf";
import React from "react";
import { api_endpoint } from "../constants";
import ActiveSlotCard from "../activeSlotCard/activeSlotCard";
import AvailableSlots from "../availableSlots/availableSlots";
import BookingCard from "../bookingCard/bookingCard";
import GeneratedCard from "../generatedCard/generatedCard";
import QRCode from "qrcode.react";
import ReactToPdf from "react-to-pdf";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
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
} from "@material-ui-new/core";

import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import BeneficiaryCard from "../beneficiaryCard/beneficiaryCard";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui-new/core/Chip";
import Navbar from "../navbar/Navbar";
import { CardHeader } from "@material-ui/core";
import Loader from "react-loader-spinner";
const ConfirmationPage = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);

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
    // Use http://dataurl.net/#dataurlmaker
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
    var imgGg = new Image();
    imgGg.onload = function () {
      doc.addImage(imgGg, "PNG", leftMargin + 65, line, 40, 40);
      closeSnackbar();
      doc.save("Confirmation.pdf");
    };
    console.log(imgGg);
    imgGg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${payload}&amp;size=150x150`;
  };

  const classes = useStyles();
  return (
    <>
      <Navbar {...props} />
      {!isLoading ? (
        <div style={{ margin: "0 auto", width: "80%" }}>
          <Card style={{ margin: "20px" }}>
            <CardHeader
              title="Your slots have been booked!"
              subheader="Please download the QR Code"
            />
            <Divider />
            <CardContent>
              <div
                style={{
                  alignItems: "center",
                }}
              >
                <Typography variant="h3">Token details:</Typography>
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
                  Token QR Code:
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
                  Download
                </Button>
              </div>
              <Divider variant="middle" style={{ marginTop: "20px" }} />
              <div>
                <Typography variant="h3" style={{ marginTop: "10px" }}>
                  Post booking instructions:
                </Typography>
              </div>
              <ul>
                <li>
                  Please download the given QR code and show it at the
                  vaccination center when asked.
                </li>
                <li>
                  This QR code could be downloaded from the Beneficiary
                  Verification page as well and is valid for today only.
                </li>
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
    </>
  );
};

export default ConfirmationPage;
