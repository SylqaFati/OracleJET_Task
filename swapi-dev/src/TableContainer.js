import React from "react";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { search } from "./utils";
import Loader from "./Loader";

import { columns } from "./TableColumns";


export default class TableContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sizePerPage: 10,
      planets: [],
      loading: false,
      value: "",
    };
  }

  //get api from planets
  async getPlanets() {
    this.setState({ loading: true });
    let res = await fetch("https://swapi.dev/api/planets/");
    let data = await res.json();
    this.setState({ planets: data.results, loading: false });

    console.log("data fetched", this.state.planets);
  }

  componentDidMount() {
    this.getPlanets();
  }

  //search planets from api query
  search = async (val) => {
    this.setState({ loading: true });
    const results = await search(
      `https://swapi.dev/api/planets/?search=${val}`
    );
    this.setState({ loading: false });
    const planetSearch = results;

    this.setState({ planets: planetSearch, loading: false });
    console.log("table search", this.state.planets);
  };

  onChangeSearch = async (e) => {
    this.search(e.target.value);
    this.setState({ value: e.target.value });
  };

  // remote api pagination
  handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    this.setState({ loading: true });
    fetch(`https://swapi.dev/api/planets/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          planets: data.results,
          page,
          sizePerPage,
          loading: false,
        });
      });
  };

  render() {
    const expandRow = {
      onlyOneExpanding: true,

      renderer: (row) => (
        <div>
          <p>{`The climate of ${row.name} is : ${row.climate}`}</p>
          <p>{`The terrain of the planet is : ${row.terrain}`}</p>
          <p>{`The population is:  ${row.population}`}</p>
        </div>
      ),
      showExpandColumn: true,

      expandHeaderColumnRenderer: ({ isAnyExpands }) => {
        if (isAnyExpands) {
          return <b>-</b>;
        }
        return <b>+</b>;
      },
      expandColumnRenderer: ({ expanded }) => {
        if (expanded) {
          return <b>-</b>;
        }
        return <b>...</b>;
      },
    };


    const RemotePagination = ({
      page,
      sizePerPage,
      onTableChange,
      totalSize,
    }) => (
      <div>
        <PaginationProvider
          pagination={paginationFactory({
            custom: true,
            page,
            sizePerPage,
            totalSize,
          })}
        >
          {({ paginationProps, paginationTableProps }) => (
            <div>
              <div>
                <PaginationListStandalone {...paginationProps} />
              </div>

              {this.state.loading ? (
                <Loader />
              ) : (
                <BootstrapTable
                  striped
                  bordered
                  hover
                  responsive
                  className="Tbl"
                  classes="tbody"
                  headerClasses="headerTbl"
                  remote
                  keyField="id"
                  data={this.state.planets}
                  columns={columns}
                  onTableChange={onTableChange}
                  {...paginationTableProps}
                  noDataIndication="No planets found !"
                  expandRow={expandRow}
                />
              )}
            </div>
          )}
        </PaginationProvider>
      </div>
    );

    const { planets, sizePerPage, page } = this.state;
    return (
      <>
        <input
          className=" search form-control col-sm-4"
          value={this.state.value}
          onChange={(e) => this.onChangeSearch(e)}
          placeholder="Search planets..."
        />

        <RemotePagination
          planets={planets}
          page={page}
          sizePerPage={sizePerPage}
          totalSize={this.state.length}
          onTableChange={this.handleTableChange}
        />
      </>
    );
  }
}
