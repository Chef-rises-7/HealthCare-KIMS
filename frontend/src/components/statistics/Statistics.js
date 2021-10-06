import { Box, Container, Grid } from "@material-ui-new/core";
import Budget from "./Budget";
import Sales from "./Sales";
import TasksProgress from "./TasksProgress";
import TotalCustomers from "./TotalCustomers";
import TotalProfit from "./TotalProfit";
import TrafficByDevice from "./TrafficByDevice";
import Navbar from "./../navbar/Navbar";
import React from "react";
import Addslots from "./Addslots";

const Statistics = () => {
  const [currTab, selectTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    selectTab(newValue);
  };
  return (
    <>
      <Navbar statsTab={true} handleChange={handleChange} currTab={currTab} />
      {currTab == 0 ? (
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}
        >
          <Container maxWidth={false} style={{ marginTop: "20px" }}>
            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <Budget />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TotalCustomers />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TasksProgress />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TotalProfit sx={{ height: "100%" }} />
              </Grid>
              <Grid item lg={8} md={12} xl={9} xs={12}>
                <Sales />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <TrafficByDevice sx={{ height: "100%" }} />
              </Grid>
              <Grid item xs={12}>
                {/* <CampaignStats sx={{ height: "100%" }} /> */}
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : (
        <Addslots />
      )}
    </>
  );
};

export default Statistics;
