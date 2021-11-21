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
import PhoneIcon from "@material-ui/icons/Phone";
import { Howl } from "howler";
import { jsPDF } from "jspdf";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import audio_en from "../../audio/en/manual_token.mp3";
import audio_hi from "../../audio/hi/manual_token.mp3";
import ActiveSlotCard from "../activeSlotCard/activeSlotCard";
import BookingCardAdd from "../bookingCardForm/bookingCardAdd";
import BookingCardForm from "../bookingCardForm/bookingCardForm";
import { api_endpoint1 } from "../constants";
import Navbar from "../navbar/Navbar";

const SlotBookingForm = (props) => {
  //const navigate = useNavigate();
  const { match, history } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(true);
  const [userName, setUserName] = React.useState([""]);
  const [refId, setRefID] = React.useState([""]);
  const [vaccName, setVaccName] = React.useState([""]);
  const [ageGrp, setAgeGrp] = React.useState([""]);
  const [doseNo, setDoseNo] = React.useState([""]);
  const [activeSlot, setActiveSlot] = React.useState({});
  const [errState, setErrState] = React.useState(false);
  const [phoneNo, setPhoneNo] = React.useState("");
  const [slotInfo, setSlotInfo] = React.useState([]);
  const { t, i18n } = useTranslation([
    "swal",
    "alt_flow",
    "snack_bar",
    "signinotp",
    "beneficiary",
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
    img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${payload}&amp;size=150x150`;
    img.onload = function () {
      doc.addImage(img, "PNG", leftMargin + 65, line, 40, 40);
      closeSnackbar();
      doc.save("Confirmation.pdf");
    };
  };
  const handleBook = () => {
    let doseObj = {};
    let benArr = [];
    let flag = 0;
    let leastOne = false;
    const regex = new RegExp("foo*");
    refId.forEach((refs, index) => {
      let benObj = {};
      leastOne = true;
      // check if any of the details are not filled
      if (
        refId[index] === "" ||
        vaccName[index] === "" ||
        ageGrp[index] === "" ||
        doseNo[index] === "" ||
        userName[index] === ""
      ) {
        enqueueSnackbar(t("snack_bar:fill_all_details"), 2500);
        flag = 1;
      }
      benObj["beneficiary_reference_id"] = refs;
      benObj["name"] = userName[index];
      benObj["birth_year"] = ageGrp[index];
      benObj["vaccine"] = vaccName[index];
      doseObj[refs] = doseNo[index];
      benArr.push(benObj);
    });
    if (!leastOne) {
      flag = 1;
      enqueueSnackbar(t("snack_bar:select_ben"), 3000);
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      flag = 1;
      enqueueSnackbar("Please enter valid phone number", 3000);
      setErrState(true);
    }
    let reqBody = {
      beneficiaries: benArr,
      phone_number: phoneNo,
      doses: doseObj,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    };
    // check if data is there;
    console.log(reqBody);
    if (flag == 0) {
      Swal.fire({
        title: t("swal:slot_booking_1.title"),
        text: t("swal:slot_booking_1.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal:slot_booking_1.confirmButtonText"),
      })
        .then((result) => {
          if (result.isConfirmed) {
            setLoading(true);
            return fetch(
              api_endpoint1 + "/apis/generateToken/",
              requestOptions
            );
          }
        })
        .then((response) => {
          if (response.status == 200) return response.json();
          else throw new Error("Tokens already booked");
        })
        .then((data) => {
          console.log(data);
          setActiveSlot(data);
          setLoading(false);
          if (data.message === "Beneficiaries Found")
            history.push({
              pathname: "/confirmPage",
              state: {
                qrPayload: data.qr_payload,
                response_tokens: data.response_tokens,
                fromApp: true,
              },
            });
          else if (data.message === "Beneficiaries Already Found") {
            Swal.fire({
              icon: "error",
              title: t("swal:slot_booking_2.title"),
              text: t("swal:slot_booking_2.text"),
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: t("swal:slot_booking_2.title"),
            text: t("swal:slot_booking_2.text"),
          });
          //   enqueueSnackbar(err, 3000);
        });
    }
  };

  const handleUserName = (event, id) => {
    let tempArr = [...userName];
    tempArr[id] = event.target.value;
    setUserName(tempArr);
  };
  const handleRefID = (event, id) => {
    let tempArr = [...refId];
    tempArr[id] = event.target.value;
    setRefID(tempArr);
  };
  const handleVaccName = (event, id) => {
    let tempArr = [...vaccName];
    tempArr[id] = event.target.value;
    setVaccName(tempArr);
  };
  const handlesetAgeGrp = (event, id) => {
    let tempArr = [...ageGrp];
    tempArr[id] = event.target.value;
    setAgeGrp(tempArr);
  };
  const handleDoseNo = (event, id) => {
    let tempArr = [...doseNo];
    tempArr[id] = event.target.value;
    setDoseNo(tempArr);
  };
  const addCard = () => {
    if (userName.length < 4) {
      setUserName([...userName, ""]);
      setRefID([...refId, ""]);
      setVaccName([...vaccName, ""]);
      setAgeGrp([...ageGrp, ""]);
      setDoseNo([...doseNo, ""]);
      console.log(userName.length);
    } else {
      enqueueSnackbar(t("snack_bar:maxi"), 2000);
    }
  };

  const delCard = (id) => {
    let tempArr = [...userName];
    tempArr.splice(id, 1);
    setUserName(tempArr);
    tempArr = [...refId];
    tempArr.splice(id, 1);
    setRefID(tempArr);
    tempArr = [...vaccName];
    tempArr.splice(id, 1);
    setVaccName(tempArr);
    tempArr = [...ageGrp];
    tempArr.splice(id, 1);
    setAgeGrp(tempArr);
    tempArr = [...doseNo];
    tempArr.splice(id, 1);
    setDoseNo(tempArr);
    // console.log(userName);
  };
  React.useEffect(() => {
    console.log(userName);
  }, [userName]);
  const ggRef = React.useRef(null);
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
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const classes = useStyles();
  return (
    <>
      <Navbar {...props} />
      {!isLoading ? (
        <div style={{ margin: "0 auto", width: "80%" }}>
          <Card style={{ margin: "20px" }}>
            <CardHeader title={t("alt_flow:book_slots")} />
            <Divider />
            <CardContent>
              <TextField
                error={errState}
                helperText={"Please enter your phone number here"}
                // label="Phone number"
                label={t("signinotp:phone_number")}
                margin="normal"
                name="phoneNo"
                InputProps={{
                  startAdornment: <PhoneIcon />,
                }}
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                }}
                variant="outlined"
                style={{ margin: "15px" }}
              />

              <Divider />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gridRowGap: "20px",
                  gridColumnGap: "25px",
                }}
              >
                {userName.map((val, index) => (
                  <BookingCardForm
                    index={index}
                    delCard={delCard}
                    handleUserName={handleUserName}
                    handleRefID={handleRefID}
                    handleDoseNo={handleDoseNo}
                    handlesetAgeGrp={handlesetAgeGrp}
                    handleVaccName={handleVaccName}
                    valUser={userName[index]}
                    valVacc={vaccName[index]}
                    valAge={ageGrp[index]}
                    valRef={refId[index]}
                    valDose={doseNo[index]}
                  />
                ))}

                <BookingCardAdd addCard={addCard} />
              </div>
              <Divider />
              <Box
                style={{
                  display: "flex",
                  padding: "8px",
                  justifyItems: "flex-end",
                }}
              >
                <div style={{ flexGrow: 1 }}></div>
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
                    handleBook();
                    // history.push("/confirmPage");
                  }}
                >
                  {t("alt_flow:book_slots")}
                </Button>
              </Box>
            </CardContent>
          </Card>
          {activeSlot.message === "Beneficiaries Already Found" ? (
            <Card style={{ margin: "20px" }} className="tempCard">
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
                    console.log(activeObj);
                    let benNo = activeSlot.data[key].length;
                    let tokenIds = activeSlot.data[key]
                      .map((obj) => obj.token_number)
                      .toString();
                    let bookDate = activeObj[0].date;
                    let qrPayload = activeObj[0].qr_payload;
                    console.log(qrPayload);

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

export default SlotBookingForm;
