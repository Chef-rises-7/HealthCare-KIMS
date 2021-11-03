import React, {useState} from 'react';
import Navbar from "./components/navbar/Navbar";
import "./components/helper/chartjs";
import Signin from "./components/signinotp/Signinotp";
import SigninStaff from "./components/signinstaff/signinstaff";
import SigninVerify from "./components/signinverify/Signinverify";
import BeneficiaryCard from "./components/beneficiaryCard/beneficiaryCard";
import BeneficiaryVerify from "./components/beneficiaryVerify/beneficiaryVerify";
import ActiveSlotCard from "./components/activeSlotCard/activeSlotCard";
import { ThemeProvider } from "@material-ui-new/core";
import GlobalStyles from "./components/themes/GlobalStyles";
import theme from "./components/themes";
import { Route, Switch, Redirect } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Statistics from "./components/statistics/Statistics";
import SlotBooking from "./components/slotBooking/slotBooking";
import ConfirmationPage from "./components/confirmationPage/confirmationPage";
import SlotBookingForm from "./components/slotBookingForm/slotBookingForm";

const App = () => {
  const [audio,setAudio] = useState(true);
  return (
    <SnackbarProvider maxSnack={1}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Switch>
          <Route
            exact
            path="/signinotp"
            render={(props) => <Signin {...props} audio={audio} setAudio={setAudio} />} //Initial route
          />
          <Route
            exact
            path="/signinstaff" // for staff login,
            render={(props) => <SigninStaff {...props} audio={audio} setAudio={setAudio}/>}
          />
          <Route
            exact
            path="/signinverify" // OTP Verification
            render={(props) => <SigninVerify {...props} audio={audio} setAudio={setAudio}/>}
          />
          <Route
            exact
            path="/dashboard" // for data visualisation
            render={(props) => <Statistics {...props} audio={audio} setAudio={setAudio}/>}
          />
          <Route
            exact
            path="/beneficiary" // display beneficiary details
            render={(props) => <BeneficiaryVerify {...props} audio={audio} setAudio={setAudio}/>}
          />
          <Route
            exact
            path="/slotBookingForm" // alternate slot booking form
            render={(props) => <SlotBookingForm {...props} audio={audio} setAudio={setAudio}/>}
          />
          <Route
            exact
            path="/slotBooking" // book slots with general flow
            render={(props) => <SlotBooking {...props} audio={audio} setAudio={setAudio}/>}
          />
          <Route
            exact
            path="/confirmPage" // slot confirmation page
            render={(props) => <ConfirmationPage {...props} audio={audio} setAudio={setAudio}/>}
          />

          <Redirect to="/signinotp" />
        </Switch>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default App;
