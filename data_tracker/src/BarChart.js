import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import './resources/styles/barchart.css'

const MyResponsiveBar = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={[ 'casos']}
        indexBy="edades"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'category10' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        //borderColor="#fff"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Edades',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Casos',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        //labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        labelTextColor = "#fff"
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
)

export default function BarChart({dataset}) {
    
    if(dataset) {
        if(dataset.length > 0) {
        return (
            <div className="main-bchart">
                <div className="bchart">
                    <h3>Infectados por Edades</h3>
                    <div style={{ width: 600, height: 500 }}>
                        <MyResponsiveBar data={dataset} />
                    </div>
                </div>
            </div>
          );
        }
    }
    return <></>
}