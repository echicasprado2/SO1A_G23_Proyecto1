import { element } from 'prop-types';
import React,{useState,useEffect} from 'react';
import PieChart from './PieChart';

function InfectadosTipo() {

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
        const url = "http://104.154.113.215:3001/api/cases/infectedtype/all"
        const result = await fetch(url);
        const dataset = await result.json();
        /*const arr = await JSON.parse(dataset);
        arr.forEach( obj => renameKey( obj, '_id', 'label' ) );
        const updatedJson = JSON.stringify( arr );*/
      
        let resultData;
        if(dataset.length > 0) {

            console.log(dataset)
            let totalCases = 0;
            let countArray = await dataset.map(element => {
                return element.count
            })
            console.log(countArray)
            totalCases =  await countArray.reduce((acumulator,current) => {
                
                return acumulator + current;
            });
            console.log(totalCases)

            resultData = await dataset.map(element => {
                return {id:element._id,value:(element.count/totalCases),label:element._id}
            });
            console.log(resultData)
        }
    
        setData(resultData);
        //console.log(dataset)
        })();
    }, []);

    return (
        <React.Fragment>
            <PieChart dataset={data}/>
        </React.Fragment>
    );
}

export default InfectadosTipo;