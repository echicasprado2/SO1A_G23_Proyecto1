import React,{useState,useEffect} from 'react';
import PieChart from './PieChart';

function InfectadosState() {

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
        const url = "http://localhost:3001/api/cases/state/all"
        const result = await fetch(url);
        const dataset = await result.json();
        /*const arr = await JSON.parse(dataset);
        arr.forEach( obj => renameKey( obj, '_id', 'label' ) );
        const updatedJson = JSON.stringify( arr );*/
      
        let resultData;
        if(dataset.length > 0) {

            let totalCases = 0;
            totalCases =  await dataset.reduce((acumulator,current) => {
                return acumulator.count + current.count;
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

export default InfectadosState;