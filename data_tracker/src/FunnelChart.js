import React from 'react';
import { ResponsiveFunnel } from "@nivo/funnel";
import './resources/styles/funnelChart.css'

const MyResponsiveFunnel = ({ data }) => (
  <ResponsiveFunnel
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    valueFormat=">-.4s"
    colors={{ scheme: "spectral" }}
    borderWidth={20}
    labelColor={{ from: "color", modifiers: [["darker", 3]] }}
    beforeSeparatorLength={100}
    beforeSeparatorOffset={20}
    afterSeparatorLength={100}
    afterSeparatorOffset={20}
    currentPartSizeExtension={10}
    currentBorderWidth={40}
    motionConfig="wobbly"
  />
);


export default function FunnelChart({dataset}) {

    if(dataset) {
        if(dataset.length > 0) {
        return (
            <div className="main-fchart">
                <div className="fchart">
                    <h3>Top 5 Departamentos Infectados</h3>
                    <div style={{ width: 550, height: 450 }}>
                        <MyResponsiveFunnel data={dataset} />
                    </div>
                </div>
            </div>
          );
        }
    }
    return <></>
    
    
  }
