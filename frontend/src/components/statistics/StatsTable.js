import {
  Box,
  Button,
  Grid,
  Card,
  Container,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Chip,
  TabPanel,
} from "@material-ui-new/core";
import { api_endpoint1 } from "../constants";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Tabs from "@material-ui-new/core/Tabs";
import Tab from "@material-ui-new/core/Tab";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui-new/styles";
import TableSortLabel from "@material-ui-new/core/TableSortLabel";
import Checkbox from "@material-ui-new/core/Checkbox";
import Tooltip from "@material-ui-new/core/Tooltip";
import AddIcon from "@material-ui-new/icons/Add";
import React from "react";
import { makeStyles } from "@material-ui-new/core/styles";
import Table from "@material-ui-new/core/Table";
import TableBody from "@material-ui-new/core/TableBody";
import TableCell from "@material-ui-new/core/TableCell";
import TableContainer from "@material-ui-new/core/TableContainer";
import TableHead from "@material-ui-new/core/TableHead";
import TableRow from "@material-ui-new/core/TableRow";
import TablePagination from "@material-ui-new/core/TablePagination";
import Paper from "@material-ui-new/core/Paper";
import IconButton from "@material-ui-new/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui-new/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui-new/icons/KeyboardArrowUp";
import { withSnackbar } from "notistack";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
function createData(name, credits, start, type, status) {
  return { name, credits, start, type, status };
}

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <TableRow {...otherProps}>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          {expandComponent}
        </TableRow>
      )}
    </>
  );
};

const rows = [
  {
    id: "tokenno",
    numeric: false,
    disablePadding: false,
    label: "Token No.",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "refid",
    numeric: true,
    disablePadding: false,
    label: "Reference ID",
  },
    {
    id: "age",
    numeric: true,
    disablePadding: false,
    label: "Age Group",
  },
  { id: "vaccine", numeric: true, disablePadding: false, label: "Vaccine" },


  {
    id: "doseno",
    numeric: true,
    disablePadding: false,
    label: "Dose No.",
  },

];
class EnhancedTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } =
      this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            (row) => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
                style={{ fontWeight: "700" }}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}
const styles = (theme) => ({
  root: {
    width: "100%",
    padding: 0,
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: "auto",
  },
});
class StatsTable extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    order: "asc",
    orderBy: "calories",
    selected: [],
    value: 0,
    data: [],
    isLoaded: false,
    page: 0,
    rowsPerPage: 10,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      this.setState((state) => ({ selected: state.data.map((n) => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  componentDidMount() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userTokenStaff")}`,
      },
      body: JSON.stringify({ specification: "all" }),
    };

    fetch(api_endpoint1 + "/apis/getTokens/", requestOptions)
      .then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error("Failed to fetch slots, try again later");
      })
      .then((datagg) => {
        this.setState({data:datagg,isLoaded:true});
      })
      .catch((err) => {
        this.setState({isLoaded:true});
        console.log(err);
      });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return this.state.isLoaded ? (
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}

      >
        <Container maxWidth={false} style={{ padding: 0,marginLeft:'10px' }}>
          <Box style={{ marginTop: "10px" }}>
            <Box sx={{ mt: 3 }}>
              <Card>
                <CardContent
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gridGap: "20px",
                  }}
                >
                  <Typography
                    align="center"
                    variant="h3"
                    style={{ margin: "auto" }}
                  >
                    Token Details
                  </Typography>
                  <Box sx={{ minWidth: "100%" }}>
                    <TextField
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon fontSize="small" color="action">
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Find Token by Beneficiary Name"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
              <Box>
              <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                  <Table className={classes.table} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onRequestSort={this.handleRequestSort}
                      rowCount={data.length}
                    />
                    <TableBody>
                      {stableSort(data, getSorting(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((n) => {
                          const isSelected = this.isSelected(n.id);
                          return (
                            <ExpandableTableRow
                              hover
                              role="checkbox"
                              aria-checked={isSelected}
                              tabIndex={-1}
                              selected={isSelected}
                              key={data.name}
                              expandComponent={
                                <TableCell colSpan="6">
                                  {/* <div>Plan type</div> */}
                                </TableCell>
                              }
                            >
                              <TableCell
                                component="th"
                                scope="row"
                              >
                                {n.token_number}
                              </TableCell>
                              <TableCell align="left">{n.date}</TableCell>
                              <TableCell align="right">{n.name}</TableCell>{" "}
                              <TableCell align="right">{n.beneficiary}</TableCell>{" "}
                              <TableCell align="right">
                              {parseInt(n.age)<45 ? (
                                <Chip
                                  className={classes.chip}
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    color: "#ffffff",
                                  }}
                                  label="18-45"
                                  color="primary"
                                />
                              ) : (
                                <Chip
                                  className={classes.chip}
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    color: "#ffffff",
                                    background: "#a617f2",
                                  }}
                                  label="45+"
                                />
                              )}
                              </TableCell>
                              <TableCell align="right">
                              {n.vaccine === "covaxin" ? (
                              <Chip
                                className={classes.chip}
                                style={{
                                  background: "#f2ca17",
                                  color: "#ffffff",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                                label="COVAXIN"
                              />
                            ) : (
                              <Chip
                                className={classes.chip}
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "#ffffff",
                                  background: "#f2174f",
                                }}
                                label="COVISHIELD"
                              />
                            )}
                            </TableCell>
                              <TableCell align="right">
                              <Chip
                              className={classes.chip}
                              style={{
                                background: n.dose==='dose2' ? "#1fd451" : "#d4241f",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                              label= {n.dose==='dose2'?"Dose 2":'Dose 1'}
                             />
                              </TableCell>

                            </ExpandableTableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 49 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 30]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          
       
        </Container>
      </Box>
    ) : (
      <Loader
        type="Oval"
        color="#00BFFF"
        height={100}
        width={100}
        style={{
          position: "fixed",
          top: "calc(50% - 3em)",
          left: "calc(50% - 3em)",
          width: "6em",
          height: "6em",
          zIndex: "9999",
        }}
      />
    );
  }
}

StatsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withSnackbar(StatsTable));
