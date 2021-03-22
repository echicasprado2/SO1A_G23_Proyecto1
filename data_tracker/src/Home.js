import React,{useState,useEffect} from 'react';
import './resources/styles/index.css';
import Region from './Region';

function Body() {

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
        const url = "http://104.154.113.215:3001/api/cases/regiontop"
        const result = await fetch(url);
        const dataset = await result.json();
        //console.log(dataset[0])
        setData(dataset[0]);
        })();
    }, []);

    return(
        <div className="main-section big-circles">
            <section className="content-overview">
                <div className="content-left">
                    <aside className="region-details">
                        <div>
                            <ul>
                                <li className="principal-li">
                                    <div>
                                    <strong className="principal-strong">{data._id}</strong>
                                    Region
                                    </div>
                                </li>
                                <li>
                                    <strong>{data.count}</strong>
                                    Casos
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
                <div className="content-center">
                  
                    <div className="map">
                        <h3>Region mas infectada por COVID-19</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0,0,1650,900">
  
                        <g transform="translate(425,0)">
                            <Region data={data} />
                          </g>
                      </svg>
                  
                  </div>
  
                </div>
                <div className="content-right">
                  
                </div>
            </section>
            <footer>
            </footer>
        </div>
    );
}

function Home() {
    return (
        <React.Fragment>
            <Body/>
        </React.Fragment>
    );
}

export default Home;