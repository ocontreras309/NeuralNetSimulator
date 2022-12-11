import GraphNode from "./GraphNode";
import React from 'react';
import { MathComponent } from 'mathjax-react';

class LinearRegressionModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [
                {
                    key: 'x1',
                    x: 250,
                    y: 100,
                    width: 100,
                    height: 100,
                    value: '3',
                    text: 'x_1'
                },
                {
                    key: 'x2',
                    x: 250,
                    y: 300,
                    width: 100,
                    height: 100,
                    value: '2',
                    text: 'x_2'
                },
                {
                    key: '1',
                    x: 250,
                    y: 500,
                    width: 100,
                    height: 100,
                    value: '1',
                    text: ''
                },
                {
                    key: 'hat_y',
                    x: 600,
                    y: 300,
                    width: 100,
                    height: 100,
                    value: '2',
                    text: '\\hat y',
                    connections: [['x1', {'w_1': 0.5}], ['x2', {'w_2': 0.5}], ['1', {'w_0': 0.2}]]
                }
            ],
            links: []
        };

        this.createLinks();
    }

    getPredictionValue() {

    }

    createLinks() {
        this.state.nodes.forEach(node => {
            if (node.connections !== undefined) {
                node.connections.forEach(connection => {
                    const sourceNode = this.state.nodes.find(source => connection[0] === source.key);
                    const parameterName = Object.keys(connection[1])[0];
                    
                    this.state.links.push({
                        parameter: {
                            name: parameterName,
                            value: connection[1][parameterName]
                        },
                        source: {
                            node: sourceNode.key,
                            x: sourceNode.x + sourceNode.width / 2 + 10,
                            y: sourceNode.y + sourceNode.height + 25,
                        },
                        dest: {
                            node: node.key,
                            x: node.x - node.width / 2 + 10,
                            y: node.y + node.height + 25
                        }
                    })
                })
            }
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.links.map((link, i) => {
                        return (
                            <div>
                                <div style={{position: 'absolute', left: (link.dest.x + link.source.x) / 2 - 50, top: (link.dest.y + link.source.y) / 2 - 50, zIndex: 1}}>
                                    <MathComponent tex={ link.parameter.name  + '=' + link.parameter.value } />
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" key={ "link_" + i } width={ window.innerWidth } height={ window.innerHeight } style={{ position: 'absolute', top: 0, left: 0}}>
                                    <line x1={ link.source.x } y1={ link.source.y } x2={link.dest.x} y2={link.dest.y} style={{ stroke: "rgb(155, 155, 255)", strokeWidth: 5 }} />
                                </svg>
                            </div>
                        );
                    })
                }
                { this.state.nodes.map(node => <GraphNode width={ node.width } height={ node.height } key={ node.key } x={ node.x } y={ node.y } value={ node.value } text={ node.text } />) }
            </div>
        );
    }
}

export default LinearRegressionModel;