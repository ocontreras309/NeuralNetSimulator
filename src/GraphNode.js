import React from 'react';
import { MathComponent } from 'mathjax-react';

class GraphNode extends React.Component {
    constructor(props) {
        super(props);
        this.width = this.props.width;
        this.height = this.props.height;
        this.titleMarginBottom = -this.props.height / 5;
        this.viewBox = `${-(this.width / 2 + 1)} ${-(this.height / 2 + 1)} ${this.width + 2} ${this.height + 2}`;
        this.nodeValueOffset = `${ -(this.width / 2 - 10) }px`;
        this.nodeIconOffset = `${ -(this.width / 2 - 10) }px`;
    }

    render() {
        
        return (
            <div className="Graph-node" style={{ position: 'fixed', top: this.props.y, left: this.props.x/*, display: 'flex', flexDirection: 'column'*/ }}>
                <div style={{ marginBottom: `${ this.titleMarginBottom }px` }}>
                    <MathComponent tex={ this.props.text } />
                </div>
                <div>
                    <div style={{ display: 'flex', position: 'relative' }}>
                        <MathComponent tex={ this.props.value } style={{ /*display: 'flex',*/ position: 'absolute', left: this.nodeValueOffset }} />
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width={ `${ this.width }px` }
                            height={ `${ this.height }px` }
                            viewBox={ this.viewBox } style={{ display: 'flex', position: 'absolute', left: this.nodeIconOffset }}>
                            
                            <g fill="rgba(25, 25, 25, 0.5)" stroke='#fff'>
                                <circle cx="0" cy="0" r="50" strokeWidth="3px"/>
                            </g>
                        </svg>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default GraphNode;