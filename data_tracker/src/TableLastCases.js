import React, {useState} from 'react';
import { useTable, useSortBy,useFilters, usePagination} from 'react-table';

export default function TableLastCases({columns, data}) {
    const [filterInput, setFilterInput] = useState("");
  // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        
    } = useTable({
            columns,
            data,
        },
        useSortBy,
    );
    

    // Render the UI for your table
    return (
            <>  
                
                <table {...getTableProps()} className="table table-bordered">
                    <thead>
                        {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={
                                    column.isSorted
                                    ? column.isSortedDesc
                                    ? "sort-desc"
                                    : "sort-asc"
                                    : ""
                                }
                            >
                            {column.render("Header")}
                            </th>
                        ))}
                        </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                            return (
                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                            );
                            })}
                        </tr>
                        );
                        })}
                    </tbody>
                </table>
            </>
        );
}