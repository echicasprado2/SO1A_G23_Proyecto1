import React,{useState,useEffect, useMemo} from 'react';
import {useSortBy, useTable} from 'react-table'
import ReactTable from 'react-table'

import DataTable from './DataTable'



const Header = ()=> (
    <header>
        <div className="container">
            <div className="row header-content">
                <nav className="menu">
                    <div className="nav-left">
                        <div className="display-mode">
                            <div className="logo">
                                <h1>CovidTacker</h1>
                            </div>
                        </div>
                    </div>
                    <div className="nav-center">
                        <div className="display-nav">
                            <div className="btn-group-nav">
                                <ul>
                                    <a href="/">Inicio</a>
                                    <a href="/">Datos Recopilados</a>
                                    <a href="/">Metricas</a>
                                    <a href="/">Servidor</a>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="nav-right"></div>
                </nav>
            </div>
        </div>
    </header>
)

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
            <Header/>
            <div className="main">
            <DataTable columns={columns} data={data}/>
            </div>
        </React.Fragment>
    );
}

export default ShowData;