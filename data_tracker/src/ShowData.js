import React,{useState,useEffect, useMemo} from 'react';
import {useSortBy, useTable} from 'react-table'
import ReactTable from 'react-table'

import DataTable from './DataTable'
import './resources/styles/showData.css'


function ShowData() {

    const columns = useMemo(() => [{
        Header: 'Nombre',
        accessor: 'name', // accessor is the "key" in the data
    },
    {  
        Header: 'Edad',
        accessor: 'age',
    },
    {  
        Header: 'Ubicacion',
        accessor: 'location',
    },
    {  
        Header: 'Region',
        accessor: 'region',
    },
    {
        Header: 'infectedtype',
        accessor:'infectedtype'
    },
    {
        Header:'Estado',
        accessor:'state'
    },
    {
        Header:'Tipo',
        accessor:'type'
    },
    {
        Header:'Fecha',
        accessor:'createdAt'
    }],[])

    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
        const url = "http://localhost:3001/api/data"
        const result = await fetch(url);
        const dataset = await result.json();
        setData(dataset);
        })();
    }, []);


    return (
        <React.Fragment>
            <div className="main">
                <section className="content-table">
                    <div className="content-center">
                        <div className="main-table">
                            <h3>Datos Recopilados</h3>
                            <DataTable columns={columns} data={data}/>
                        </div>
                    </div>
                </section>
                <footer></footer>
            </div>
        </React.Fragment>
    );
}

export default ShowData;