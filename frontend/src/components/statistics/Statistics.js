import React from "react";
import Navbar from "./../navbar/Navbar";
import Addslots from "./Addslots";
import StatsTable from "./StatsTable";

const Statistics = (props) => {
  const [currTab, selectTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    selectTab(newValue);
  };

  React.useEffect(() => {
    console.log(props.location);
    if (!props.location.state) {
      props.history.replace("/signinstaff");
      return;
    }
  }, []);
  return (
    <>
      <Navbar
        statsTab={true}
        handleChange={handleChange}
        currTab={currTab}
        {...props}
      />
      {currTab == 0 ? <StatsTable {...props} /> : <Addslots {...props} />}
    </>
  );
};

export default Statistics;
