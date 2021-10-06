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
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Tabs from "@material-ui-new/core/Tabs";
import Tab from "@material-ui-new/core/Tab";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui-new/core/styles";
import TableSortLabel from "@material-ui-new/core/TableSortLabel";
import Checkbox from "@material-ui-new/core/Checkbox";
import Tooltip from "@material-ui-new/core/Tooltip";
import { Search as SearchIcon } from "react-feather";
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
        <TableCell padding="checkbox"></TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell padding="checkbox" />
          {expandComponent}
        </TableRow>
      )}
    </>
  );
};

const rows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "credits",
    numeric: true,
    disablePadding: false,
    label: "Credits bought",
  },
  { id: "start", numeric: true, disablePadding: false, label: "Start date" },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Campaign type",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
];
class EnhancedTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } =
      this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" />
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
    const { history } = this.props;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("euprimeShort")}`,
      },
    };
    fetch("/api/getCampaigns/", requestOptions)
      .then((response) => response.json())
      .then((datalog) => {
        let newData = [];
        if (datalog.data) {
          newData = datalog.data.map((el) => {
            return {
              name: el.name,
              credits: parseInt(el.noOfCredits),
              date: el.date,
              type: el.campaignType.plan,
              status: el.campaignStatus,
            };
          });
        }
        this.setState({ data: newData, isLoaded: true });
        // } else {
        //   console.log(datalog);
        //   //   this.props.enqueueSnackbar("Session expired, re-logging in.");
        //   //   history.push("/signin");
        // }
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
        <Container maxWidth={false} style={{ padding: 0 }}>
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
                    Select Campaign to see Statistics
                  </Typography>
                  <Box sx={{ minWidth: "100%" }}>
                    <TextField
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon fontSize="small" color="action">
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Find Campaign"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>{" "}
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Pending" {...a11yProps(1)} />
            <Tab label="Active" {...a11yProps(2)} />
            <Tab label="Completed" {...a11yProps(3)} />
          </Tabs>
          {value == 0 && (
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
                              key={n.id}
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
                                padding="none"
                              >
                                {n.name}
                              </TableCell>
                              <TableCell align="right">{n.credits}</TableCell>
                              <TableCell align="right">{n.date}</TableCell>{" "}
                              <TableCell align="right">{n.type}</TableCell>{" "}
                              <TableCell align="right">
                                <Chip
                                  color="primary"
                                  label={n.status}
                                  size="small"
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
          )}
          {value == 1 && (
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
                      rowCount={
                        data.filter((obj) => {
                          return obj.campaignStatus == "Pending";
                        }).length
                      }
                    />
                    <TableBody>
                      {stableSort(
                        data.filter((obj) => {
                          return obj.status == "Pending";
                        }),
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
                              key={n.id}
                              selected={isSelected}
                              key={data.name}
                              expandComponent={
                                <TableCell colSpan="6">
                                  <div>Plan type</div>
                                </TableCell>
                              }
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                {n.name} gg
                              </TableCell>
                              <TableCell align="right">{n.credits}</TableCell>
                              <TableCell align="right">{n.date}</TableCell>
                              <TableCell align="right">{n.type}</TableCell>
                              <TableCell align="right">
                                <Chip
                                  color="primary"
                                  label={n.status}
                                  size="small"
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
          )}
          {value == 2 && (
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
                      rowCount={
                        data.filter((obj) => {
                          return obj.status == "Pending";
                        }).length
                      }
                    />
                    <TableBody>
                      {stableSort(
                        data.filter((obj) => {
                          return obj.campaignStatus == "Ongoing";
                        }),
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
                              key={n.id}
                              selected={isSelected}
                              key={data.name}
                              expandComponent={
                                <TableCell colSpan="6">
                                  <div>Plan type</div>
                                </TableCell>
                              }
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                {n.name}
                              </TableCell>
                              <TableCell align="right">{n.credits}</TableCell>
                              <TableCell align="right">{n.date}</TableCell>
                              <TableCell align="right">{n.type}</TableCell>
                              <TableCell align="right">
                                <Chip
                                  color="primary"
                                  label={n.status}
                                  size="small"
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
          )}
          {value == 3 && (
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
                      rowCount={
                        data.filter((obj) => {
                          return obj.campaignStatus == "Pending";
                        }).length
                      }
                    />
                    <TableBody>
                      {stableSort(
                        data.filter((obj) => {
                          return obj.status == "Completed";
                        }),
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
                              key={n.id}
                              selected={isSelected}
                              key={data.name}
                              expandComponent={
                                <TableCell colSpan="6">
                                  <div>Plan type</div>
                                </TableCell>
                              }
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                {n.name}
                              </TableCell>
                              <TableCell align="right">{n.credits}</TableCell>
                              <TableCell align="right">{n.date}</TableCell>
                              <TableCell align="right">{n.type}</TableCell>
                              <TableCell align="right">
                                <Chip
                                  color="primary"
                                  label={n.status}
                                  size="small"
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
          )}
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
