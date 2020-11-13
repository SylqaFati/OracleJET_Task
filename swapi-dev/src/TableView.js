import React from 'react'
import BootstrapTable from "react-bootstrap-table-next";

export default function  TableView ({data,columns,onTableChange,expandRow}){
    return (
        <div>
             <BootstrapTable
                  remote
                  striped
                  bordered
                  hover
                  responsive
                  className="Tbl"
                  classes="tbody"
                  headerClasses="headerTbl"
                 
                  keyField="id"
                  data={data}
                  columns={columns}
                  onTableChange={onTableChange}
                  noDataIndication="No planets found !"
                  expandRow={expandRow}
              
                ></BootstrapTable>
        </div>
    )
}
