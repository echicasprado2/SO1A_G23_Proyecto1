import React,{useState,useEffect} from 'react';
import FunnelChart from './FunnelChart';

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



function DeptosInfectados() {

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
        const url = "http://localhost:3001/api/cases/departments/top5"
        const result = await fetch(url);
        const dataset = await result.json();
        /*const arr = await JSON.parse(dataset);
        arr.forEach( obj => renameKey( obj, '_id', 'label' ) );
        const updatedJson = JSON.stringify( arr );*/
      
        let resultData;
        if(dataset.length > 0) {
            resultData = await dataset.map(element => {
                const id = "step_"+String(element._id).toLowerCase()
                return {id:id,value:element.count,label:element._id}
            });
            console.log(resultData)
        }
    
        setData(resultData);
        //console.log(dataset)
        })();
    }, []);

    return (
        <React.Fragment>
            <Header/>
            <FunnelChart dataset={data}/>
        </React.Fragment>
    );
}

export default DeptosInfectados;