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
import "./dateFix.css";
import XLXS from "xlsx";
import { api_endpoint1 } from "../constants";
import Loader from "react-loader-spinner";
import DateFnsUtils from "@date-io/date-fns";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Search as SearchIcon } from "react-feather";
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
import { withSnackbar } from "notistack";
import { DataSaverOff } from "@material-ui/icons";

import { withTranslation } from 'react-i18next';
import {Howl, Howler} from 'howler';
import audio_hi from "../../audio/hi/dashboard.mp3"
import audio_en from "../../audio/en/dashboard.mp3" 

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
      <TableRow {...otherProps}>{children}</TableRow>
      {isExpanded && <TableRow>{expandComponent}</TableRow>}
    </>
  );
};

const rows = [
  {
    id: "token_number",
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
    id: "beneficiary",
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
    id: "dose",
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
    const { order, orderBy, numSelected, rowCount } = this.props;

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
                  enterDelay={200}
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
    orderBy: "date",
    selected: [],
    value: 0,
    data: [],
    filteredDateData: [],
    filteredDateDataRange: [],
    filteredDateDataMonth: [],
    filteredSearchData: [],
    date0: new Date(),
    date1: new Date(),
    date2: new Date(),
    month: new Date(),
    isLoaded: false,
    searchKW: "",
    page: 0,
    rowsPerPage: 10,
  };
  timer;
  play;


 
  

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
  handleExport = (toExport, name) => {
    const workSheet = XLXS.utils.json_to_sheet(toExport);
    workSheet["!cols"] = [];
    workSheet["!cols"][0] = { hidden: true };
    workSheet["!cols"][1] = { hidden: true };
    workSheet["!cols"][4] = { hidden: true };
    workSheet["!cols"][5] = { hidden: true };
    workSheet["!cols"][7] = { hidden: true };
    workSheet["!cols"][11] = { hidden: true };
    workSheet["!cols"][12] = { hidden: true };
    workSheet["!cols"][14] = { hidden: true };
    const workBook = XLXS.utils.book_new();
    XLXS.utils.book_append_sheet(workBook, workSheet, "Token Data");
    // XLXS.write(workBook, { bookType: "xlsx", type: "binary" });
    XLXS.writeFile(workBook, `${name}.xlsx`);
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
  toUTCDate = (inp) => {
    return (
      inp.getUTCFullYear() +
      "-" +
      ("0" + (inp.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("0" + inp.getUTCDate()).slice(-2)
    );
  };
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  filteredKWdata = (toFilter) => {
    return toFilter.filter((el) =>
      el.name.toLowerCase().includes(this.state.searchKW.toLowerCase())
    );
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  isSelected = (id) => this.state.selected.indexOf(id) !== -1;


  componentDidMount() {
    
    if(this.props.i18n.language =='en'){
      this.play = new Howl({
        src: audio_en,
        html5: true
      });      
    }
    else if(this.props.i18n.language =='hi'){
      this.play = new Howl({
        src: audio_hi,
        html5: true
      });  
    }
    else{

    }
    this.timer = setTimeout(()=>{
      if(this.props.audio) {
        this.play.play();
      }
    },1000);


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
        let filterOneDay, filterMonth, filterRange;
        filterOneDay = datagg.filter(
          (el) =>
            new Date(el.date).setHours(0, 0, 0, 0) ===
            this.state.date0.setHours(0, 0, 0, 0)
        );
        filterRange = datagg.filter(
          (el) =>
            new Date(el.date).setHours(0, 0, 0, 0) <=
              this.state.date2.setHours(0, 0, 0, 0) &&
            new Date(el.date).setHours(0, 0, 0, 0) >=
              this.state.date1.setHours(0, 0, 0, 0)
        );
        filterMonth = datagg.filter(
          (el) =>
            new Date(el.date).getMonth() === this.state.month.getMonth() &&
            new Date(el.date).getFullYear() === this.state.month.getFullYear()
        );
        this.setState({
          data: datagg,
          isLoaded: true,
          filteredSearchData: datagg,
          filteredDateData: filterOneDay,
          filteredDateDataRange: filterRange,
          filteredDateDataMonth: filterMonth,
        });
      })
      .catch((err) => {
        this.setState({ isLoaded: true });
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.play.stop();
    clearTimeout(this.timer);
  }

  

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    let filteredSearchData = this.filteredKWdata(data);
    let fsDataDate = this.filteredKWdata(this.state.filteredDateData);
    let fsDataDateRange = this.filteredKWdata(this.state.filteredDateDataRange);
    let fsDataMonth = this.filteredKWdata(this.state.filteredDateDataMonth);

    let emptyRows;
    let toExport;
    let fileName = "Token Data- ";
    if (value == 0) {
      emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, filteredSearchData.length - page * rowsPerPage);
      toExport = data;
      fileName += "All time";
    } else if (value == 1) {
      emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, fsDataDate.length - page * rowsPerPage);
      toExport = this.state.filteredDateData;
      fileName += this.toUTCDate(this.state.date0);
    } else if (value == 2) {
      emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, fsDataDateRange.length - page * rowsPerPage);
      toExport = this.state.filteredDateDataRange;
      fileName += this.toUTCDate(this.state.date1);
      fileName += " to ";
      fileName += this.toUTCDate(this.state.date2);
    } else {
      emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, fsDataMonth.length - page * rowsPerPage);
      toExport = this.state.filteredDateDataMonth;
      fileName += `${
        this.state.month.getMonth() + 1
      }-${this.state.month.getFullYear()}`;
    }
    return this.state.isLoaded ? (
      <div style={{ display: "grid" }}>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "90%",
          }}
          style={{ display: "grid" }}
        >
          <Container
            maxWidth={false}
            style={{
              padding: 0,
              width: "80%",
              justifySelf: "center",
            }}
          >
            <Box style={{ marginTop: "10px" }}>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardContent
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gridGap: "20px",
                    }}
                  >
                    <Typography
                      align="center"
                      variant="h3"
                      style={{ margin: "auto" }}
                    >
                      {this.props.t('db_statistics:search.token_details')}
                    </Typography>
                    <Box sx={{ minWidth: "100%" }}>
                      <TextField
                        fullWidth
                        onChange={(e) => {
                          this.setState({ searchKW: e.target.value });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SvgIcon fontSize="medium" color="action">
                                {" "}
                                <SearchIcon />
                              </SvgIcon>
                            </InputAdornment>
                          ),
                        }}
                        placeholder={this.props.t('db_statistics:search.placeholder')}
                        variant="outlined"
                      />
                    </Box>
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ fontWeight: "bold", borderRadius: "20px" }}
                      onClick={() => {
                        this.handleExport(toExport, fileName);
                      }}
                    >
                      <GetAppOutlinedIcon />
                      {this.props.t('db_statistics:search.export')}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Box>
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="auto"
            >
              <Tab label={(this.props.t("db_statistics:all"))} {...a11yProps(0)} />
              <Tab label={(this.props.t("db_statistics:by_date.name"))} {...a11yProps(1)} />
              <Tab label={(this.props.t("db_statistics:by_range.name"))} {...a11yProps(2)} />
              <Tab label={(this.props.t("db_statistics:by_month.name"))} {...a11yProps(3)} />
            </Tabs>
            {value == 0 && (
              <Box>
                <Paper className={classes.root}>
                  <div className={classes.tableWrapper}>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={filteredSearchData.length}
                      />
                      <TableBody>
                        {stableSort(
                          filteredSearchData,
                          getSorting(order, orderBy)
                        )
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
                                key={`${n.beneficiary}_${n.date}`}
                                expandComponent={
                                  <TableCell colSpan="6">
                                    {/* <div>Plan type</div> */}
                                  </TableCell>
                                }
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.token_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.date}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.name}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.beneficiary}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {parseInt(n.age) < 45 ? (
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  <Chip
                                    className={classes.chip}
                                    style={{
                                      background:
                                        n.dose === "dose2"
                                          ? "#1fd451"
                                          : "#d4241f",
                                      color: "#ffffff",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                    label={
                                      n.dose === "dose2" ? "Dose 2" : "Dose 1"
                                    }
                                  />
                                </TableCell>
                              </ExpandableTableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 51 * emptyRows }}>
                            <TableCell
                              colSpan={7}
                              style={{
                                textAlign: "center",
                                fontSize: "1.2rem",
                              }}
                            >
                              {filteredSearchData.length == 0 &&
                                "No Results found with given filters"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={filteredSearchData.length}
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
            )}
            {value == 1 && (
              <Box>
                <Paper className={classes.root}>
                  <div className={classes.tableWrapper}>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={fsDataDate.length}
                      />
                      <TableBody>
                        {stableSort(fsDataDate, getSorting(order, orderBy))
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
                                key={`${n.beneficiary}_${n.date}`}
                                expandComponent={
                                  <TableCell colSpan="6">
                                    {/* <div>Plan type</div> */}
                                  </TableCell>
                                }
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.token_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.date}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.name}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.beneficiary}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {parseInt(n.age) < 45 ? (
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  <Chip
                                    className={classes.chip}
                                    style={{
                                      background:
                                        n.dose === "dose2"
                                          ? "#1fd451"
                                          : "#d4241f",
                                      color: "#ffffff",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                    label={
                                      n.dose === "dose2" ? "Dose 2" : "Dose 1"
                                    }
                                  />
                                </TableCell>
                              </ExpandableTableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 51 * emptyRows }}>
                            <TableCell
                              colSpan={7}
                              style={{
                                textAlign: "center",
                                fontSize: "1.2rem",
                              }}
                            >
                              {fsDataDate.length == 0 &&
                                "No Results found with given filters"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={fsDataDate.length}
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
            )}
            {value == 2 && (
              <Box>
                <Paper className={classes.root}>
                  <div className={classes.tableWrapper}>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={fsDataDateRange.length}
                      />
                      <TableBody>
                        {stableSort(fsDataDateRange, getSorting(order, orderBy))
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
                                key={`${n.beneficiary}_${n.date}`}
                                expandComponent={
                                  <TableCell colSpan="6">
                                    {/* <div>Plan type</div> */}
                                  </TableCell>
                                }
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.token_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.date}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.name}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.beneficiary}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {parseInt(n.age) < 45 ? (
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  <Chip
                                    className={classes.chip}
                                    style={{
                                      background:
                                        n.dose === "dose2"
                                          ? "#1fd451"
                                          : "#d4241f",
                                      color: "#ffffff",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                    label={
                                      n.dose === "dose2" ? "Dose 2" : "Dose 1"
                                    }
                                  />
                                </TableCell>
                              </ExpandableTableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 51 * emptyRows }}>
                            <TableCell
                              colSpan={7}
                              style={{
                                textAlign: "center",
                                fontSize: "1.2rem",
                              }}
                            >
                              {fsDataDateRange.length == 0 &&
                                "No Results found with given filters"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={fsDataDateRange.length}
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
            )}
            {value == 3 && (
              <Box>
                <Paper className={classes.root}>
                  <div className={classes.tableWrapper}>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={fsDataMonth.length}
                      />
                      <TableBody>
                        {stableSort(fsDataMonth, getSorting(order, orderBy))
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
                                key={`${n.beneficiary}_${n.date}`}
                                expandComponent={
                                  <TableCell colSpan="6">
                                    {/* <div>Plan type</div> */}
                                  </TableCell>
                                }
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.token_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.date}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.name}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {n.beneficiary}
                                </TableCell>{" "}
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  {parseInt(n.age) < 45 ? (
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
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
                                <TableCell
                                  align="right"
                                  style={{
                                    paddingTop: "9px",
                                    paddingBottom: "9px",
                                  }}
                                >
                                  <Chip
                                    className={classes.chip}
                                    style={{
                                      background:
                                        n.dose === "dose2"
                                          ? "#1fd451"
                                          : "#d4241f",
                                      color: "#ffffff",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                    label={
                                      n.dose === "dose2" ? "Dose 2" : "Dose 1"
                                    }
                                  />
                                </TableCell>
                              </ExpandableTableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 51 * emptyRows }}>
                            <TableCell
                              colSpan={7}
                              style={{
                                textAlign: "center",
                                fontSize: "1.2rem",
                              }}
                            >
                              {fsDataMonth.length == 0 &&
                                "No Results found with given filters"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={fsDataMonth.length}
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
            )}
          </Container>
        </Box>
        {this.state.value == 1 && (
          <div style={{ margin: "10px", justifySelf: "center" }}>
            {this.props.t('db_statistics:by_date.title')}{" "}
          </div>
        )}
        {this.state.value == 1 && (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              format="yyyy-MM-dd"
              value={this.state.date0}
              disableFuture
              onChange={(date) => {
                let temp = data.filter((el) => {
                  console.log(new Date(el.date).getTime(), date.getTime());
                  return (
                    new Date(el.date).setHours(0, 0, 0, 0) ===
                    date.setHours(0, 0, 0, 0)
                  );
                });

                this.setState({ date0: date, filteredDateData: temp });
              }}
              style={{ margin: "10px", justifySelf: "center", width: "150px" }}
              className="forDate"
            />
          </MuiPickersUtilsProvider>
        )}
        {this.state.value == 2 && (
          <div style={{ margin: "10px", justifySelf: "center" }}>
            {this.props.t('db_statistics:by_range.title')}{" "}
          </div>
        )}
        {this.state.value == 2 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 0.5fr 1fr",
              justifySelf: "center",
            }}
            className="forDate"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                format="yyyy-MM-dd"
                value={this.state.date1}
                onChange={(date) => {
                  let temp = data.filter(
                    (el) =>
                      new Date(el.date).setHours(0, 0, 0, 0) <=
                        this.state.date2.setHours(0, 0, 0, 0) &&
                      new Date(el.date).setHours(0, 0, 0, 0) >=
                        date.setHours(0, 0, 0, 0)
                  );
                  this.setState({ date1: date, filteredDateDataRange: temp });
                }}
                style={{ margin: "10px", width: "150px" }}
              />
            </MuiPickersUtilsProvider>
            <div style={{ margin: "10px", textAlign: "center" }}>to</div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                format="yyyy-MM-dd"
                value={this.state.date2}
                onChange={(date) => {
                  let temp = data.filter(
                    (el) =>
                      new Date(el.date).setHours(0, 0, 0, 0) <=
                        date.setHours(0, 0, 0, 0) &&
                      new Date(el.date).setHours(0, 0, 0, 0) >=
                        this.state.date1.setHours(0, 0, 0, 0)
                  );
                  this.setState({ date2: date, filteredDateDataRange: temp });
                }}
                style={{ margin: "10px", width: "150px", textAlign: "center" }}
              />
            </MuiPickersUtilsProvider>
          </div>
        )}
        {this.state.value == 3 && (
          <div style={{ margin: "10px", justifySelf: "center" }}>
            {this.props.t('db_statistics:by_month.title')}{" "}
          </div>
        )}
        {this.state.value == 3 && (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              views={["year", "month"]}
              value={this.state.month}
              disableFuture
              onChange={(date) => {
                let temp = data.filter(
                  (el) =>
                    new Date(el.date).getMonth() === date.getMonth() &&
                    new Date(el.date).getFullYear() === date.getFullYear()
                );
                this.setState({ month: date, filteredDateDataMonth: temp });
              }}
              style={{ margin: "10px", justifySelf: "center", width: "150px" }}
              className="forDate"
            />
          </MuiPickersUtilsProvider>
        )}
      </div>
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

export default withTranslation(["db_statistics"])(withStyles(styles)(withSnackbar(StatsTable)));
