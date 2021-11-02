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
  return (
    <SnackbarProvider maxSnack={1}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Switch>
          <Route
            exact
            path="/signinotp"
            render={(props) => <Signin {...props} />} //Initial route
          />
          <Route
            exact
            path="/signinstaff" // for staff login,
            render={(props) => <SigninStaff {...props} />}
          />
          <Route
            exact
            path="/signinverify" // OTP Verification
            render={(props) => <SigninVerify {...props} />}
          />
          <Route
            exact
            path="/dashboard" // for data visualisation
            render={(props) => <Statistics {...props} />}
          />
          <Route
            exact
            path="/beneficiary" // display beneficiary details
            render={(props) => <BeneficiaryVerify {...props} />}
          />
          <Route
            exact
            path="/slotBookingForm" // alternate slot booking form
            render={(props) => <SlotBookingForm {...props} />}
          />
          <Route
            exact
            path="/slotBooking" // book slots with general flow
            render={(props) => <SlotBooking {...props} />}
          />
          <Route
            exact
            path="/confirmPage" // slot confirmation page
            render={(props) => <ConfirmationPage {...props} />}
          />

          <Redirect to="/signinotp" />
        </Switch>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default App;
