import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui-new/core";
import { indigo } from "@material-ui-new/core/colors";
import Assess from "@material-ui-new/icons/Assessment";

const TotalProfit = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            ACTIVE CAMPAIGNS
          </Typography>
          <Typography color="textPrimary" variant="h3">
            5
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: indigo[600],
              height: 56,
              width: 56,
            }}
          >
            <Assess />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default TotalProfit;
