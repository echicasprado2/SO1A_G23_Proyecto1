import React,{useState,useEffect} from 'react';
import BarChart from './BarChart';

function setIndex(range) {
    switch (range) {
        case "0-9":
            return 0;
        case "10-19":
            return 1;
        case "20-29":
            return 2;
        case "30-39":
            return 3;
        case "40-49":
            return 4;
        case "50-59":
            return 5;
        case "60-69":
            return 6;
        case "70-79":
            return 7;
        case "80-89":
            return 8;
        case "90-99":
            return 9;
    }
}

function Edad() {

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
        const url = "http://104.154.113.215:3001/api/cases/agerange"
        const result = await fetch(url);
        const dataset = await result.json();
        
        

        let resultData;
        if(dataset.length > 0) {
            resultData = await dataset.map(element => {
                return {casos:element.count,edades:element._id,index:setIndex(element._id)}
            });
            resultData = resultData.sort((a,b)=>a.index-b.index);
            console.log(resultData)
        }
    
        setData(resultData);
        //console.log(dataset)
        })();
    }, []);

    return (
        <React.Fragment>
            <BarChart dataset={data}/>
        </React.Fragment>
    );
}

export default Edad;
