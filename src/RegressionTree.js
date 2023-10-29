import React from 'react';
import rd3 from 'react-d3-library';
import { node, nodeAttributes, update } from './d3tree';
import RegressionTreeDocumentation from './RegressionTreeDocumentation';
import { Link } from '@mui/material';
const RD3Component = rd3.Component;

const DATATYPE_CATEGORICAL = 'categorical';
const COMPARISON_EQUAL = 'equal';
const COMPARISON_DISTINCT = 'distinct';
const COMPARISON_GREATER_THAN = 'greater_than';
const COMPARISON_LESS_THAN_OR_EQUAL = 'less_than_or_equal';
const DATATYPE_CONTINUOUS = 'continuous';
const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = 2;

/**
 * Dataset declarations
 */

const HOUSING_DATASET = {
    data: {
        'SquareFeet': [40, 80, 100, 120, 150],
        'Construction': ['Adobe', 'Brick', 'Brick', 'Adobe', 'Adobe']
    },
    target: {
        'Price_K': [30, 80, 90, 45, 50]
    },
    datatypes: {
        'SquareFeet': DATATYPE_CONTINUOUS,
        'Construction': DATATYPE_CATEGORICAL
    }
};

const SYSTOLIC_BP_DATASET = {
    data: {
        'Age':    [60, 61, 74, 57, 63, 68, 66, 77, 63, 54],
        'Weight': [58, 90, 96, 72, 62, 79, 69, 96, 96, 54]
    },
    target: {
        'Systolic BP': [117, 120, 145, 129, 132, 130, 110, 163, 136, 115]
    },
    datatypes: {
        'Age': DATATYPE_CONTINUOUS,
        'Weight': DATATYPE_CONTINUOUS
    }
}

const ACADEMIC_PERFORMANCE_DATASET = {
    data: {
      Age: [20, 22, 21, 19, 23, 18, 24],
      Major: [
        "Engineering",
        "Medicine",
        "Law",
        "Computer Science",
        "Economics",
        "Psychology",
        "Physics",
        "Business",
      ],
      Daily_Study_Hours: [5, 6, 4, 7, 5, 6, 5],
      Distance_km: [2, 1, 5, 3, 4, 1, 3],
    },
    target: {
      Academic_Performance: [85, 92, 78, 88, 80, 75, 90],
    },
    datatypes: {
      Age: DATATYPE_CONTINUOUS,
      Major: DATATYPE_CATEGORICAL,
      Daily_Study_Hours: DATATYPE_CONTINUOUS,
      Distance_km: DATATYPE_CONTINUOUS,
    },
  };

const datasets = {
    'Housing': HOUSING_DATASET,
    'Systolic BP': SYSTOLIC_BP_DATASET,
    'Academic performance': ACADEMIC_PERFORMANCE_DATASET
};

/**
 * This class defines the properties of a single decision tree node
 */
class DecisionTreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.treeData = props.treeData[0];
        this.state = {d3: props.treeData};
    }

    componentDidMount() {
        update(this.treeData, this.ref.current);
        this.setState({d3: node});
    }

    render() {
        return (
            <div ref={ this.ref }>
                <RD3Component data={this.state.d3} />
            </div>
        )
    }
}

/**
 * Attribute comparison options
 */
const columnComparisonCallback = (value, comparison, columnValue) => {
    switch (comparison) {
        case COMPARISON_EQUAL:
            return value === columnValue;
        case COMPARISON_DISTINCT:
            return value !== columnValue;
        case COMPARISON_LESS_THAN_OR_EQUAL:
            return value <= columnValue;
        case COMPARISON_GREATER_THAN:
            return value > columnValue;
    }
}

/**
 * Main class
 */
class RegressionTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: {}
        }
        
        this.datasetname = 'Housing';
        this.history = [];
        this.historyActive = false;
        this.idCount = 1;
        this.state.dataset = datasets[this.datasetname];
    }

    /**
     * Generate a unique id per dataset row
     */
    generateDatasetIds() {
        let key = Object.keys(this.state.dataset.target)[0];
        let dataset = this.state.dataset;
        dataset.ids = this.state.dataset.target[key].map((_, i) => i + 1);
    }

    /**
     * Calculating midpoints is a key step when columns are continuous
     */
    calculateMidpoints(columnValues) {
        let sortedValues = columnValues.slice();
        sortedValues.sort((a, b) => a - b);
        
        let midpoints = [];

        sortedValues.forEach((_, index) => {
            if (index < sortedValues.length - 1) {
                midpoints.push(Math.floor((parseFloat(sortedValues[index]) + parseFloat(sortedValues[index + 1])) / 2));
            }
        })

        return midpoints;
    }

    /**
     * Calculate a single attribute impurity value
     * as well as other information that is required to display the calculation procedure
     */
    calculateAttributeImpurity(data, counts, unfilteredTargets, column, columnValue, comparison) {
        let impurityResult = {
            impurityCalculationText: '',
            columnProbabilityText: ''
        };
        
        let filteredTargets = unfilteredTargets.filter(((_, i) => {
            return columnComparisonCallback(data[column][i], comparison, columnValue);
        }));

        counts[`${column}_${columnValue}`] = data[column].filter(value => columnComparisonCallback(value, comparison, columnValue)).length;
        let total = data[column].length;
        let variance = 0;
        let impurityCalculationText = '';

        if (filteredTargets.length > 0) {
            let mean = filteredTargets.reduce((sum, targetValue) => sum + targetValue, 0) / filteredTargets.length;
            
            variance = filteredTargets.reduce((sum, targetValue) => {
                let diff = targetValue - mean;
                impurityCalculationText += ((impurityCalculationText === '') ? '' : '+') + `(${targetValue}-${Math.round(mean * 100) / 100})^2`;
                return sum + diff * diff;
            }, 0) / filteredTargets.length;

            impurityCalculationText = `\\frac{${impurityCalculationText}}{${filteredTargets.length}}`;
        }

        impurityResult.impurityCalculationText = impurityCalculationText;
        impurityResult.columnProbability = counts[`${column}_${columnValue}`] / total;
        impurityResult.columnProbabilityText = `\\frac{${counts[`${column}_${columnValue}`]}}{${total}}`;
        impurityResult.finalImpurity = variance;
        
        return impurityResult;
    }

    /**
     * Calculate an overall column impurity
     * and report the total impurity values and calculation procedures
     */
    calculateColumnImpurity(dataset, column) {
        const data = dataset.data;
        const unfilteredTargets = dataset.target[Object.keys(dataset.target)[0]];
        const types = dataset.datatypes;
        let impurities = {};

        let columnValues = data[column].filter((v, i, a) => a.indexOf(v) === i);
        let counts = {};

        // If this is a binary column, then perform impurity evaluation just once.
        if (columnValues.length === 2) {
            columnValues.splice(1, 1);
        }

        // Get impurity values for each unique column value or midpoint
        if (types[column] === DATATYPE_CATEGORICAL) {
            columnValues.forEach(columnValue => {
                let impurityLeft = this.calculateAttributeImpurity(data, counts, unfilteredTargets, column, columnValue, COMPARISON_EQUAL);
                let impurityRight = this.calculateAttributeImpurity(data, counts, unfilteredTargets, column, columnValue, COMPARISON_DISTINCT);
                let leftImpurityResultText, rightImpurityResultText;

                impurities[columnValue] = impurityLeft.finalImpurity + impurityRight.finalImpurity;
                leftImpurityResultText = `Var(${column}=${columnValue})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                rightImpurityResultText = `Var(${column}!=${columnValue})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;

                let impurityValue = impurityLeft.columnProbability * impurityLeft.finalImpurity + impurityRight.columnProbability *  impurityRight.finalImpurity; 

                impurities[columnValue] = {
                    impurityValue: impurityValue,
                    impurityCalculationLeft: leftImpurityResultText,
                    impurityCalculationRight: rightImpurityResultText,
                    impurityCalculationTotal: `${impurityLeft.columnProbabilityText}\\times ${Math.round(impurityLeft.finalImpurity * 100) / 100}+${impurityRight.columnProbabilityText}\\times ${Math.round(impurityRight.finalImpurity * 100) / 100}=${Math.round(impurityValue * 100) / 100}`
                };
            });
        } else {
            let midpoints = this.calculateMidpoints(data[column]);
            let leftImpurityResultText, rightImpurityResultText;

            midpoints.forEach(midpoint => {
                let impurityLeft = this.calculateAttributeImpurity(data, counts, unfilteredTargets, column, midpoint, COMPARISON_LESS_THAN_OR_EQUAL);
                let impurityRight = this.calculateAttributeImpurity(data, counts, unfilteredTargets, column, midpoint, COMPARISON_GREATER_THAN);
                impurities[midpoint] = impurityLeft.finalImpurity + impurityRight.finalImpurity;

                leftImpurityResultText = `Var(${column}\\leq ${midpoint})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                rightImpurityResultText = `Var(${column}>${midpoint})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;

                let impurityValue = impurityLeft.columnProbability * impurityLeft.finalImpurity + impurityRight.columnProbability *  impurityRight.finalImpurity; 

                impurities[midpoint] = {
                    impurityValue: impurityValue,
                    impurityCalculationLeft: leftImpurityResultText,
                    impurityCalculationRight: rightImpurityResultText,
                    impurityCalculationTotal: `${impurityLeft.columnProbabilityText}\\times ${Math.round(impurityLeft.finalImpurity * 100) / 100}+${impurityRight.columnProbabilityText}\\times ${Math.round(impurityRight.finalImpurity * 100) / 100}=${Math.round(impurityValue * 100) / 100}`
                };
            });
        }

        return impurities;
    }

    /**
     * Store impurity values for future comparison
     */
    calculateImpurities(dataset) {
        const data = dataset.data;
        let impurities = {};

        for (let column in data) {        
            impurities[column] = this.calculateColumnImpurity(dataset, column);
        }

        return impurities;
    }

    /**
     * Find the attribute with minimal impurity
     * for splitting
     */
    findOptimalAttribute(dataset) {
        let impurities = this.calculateImpurities(dataset);
        let selectedAttribute = null;
        let minImpurity = Number.MAX_VALUE;

        for (let columnName in impurities) {
            let column = impurities[columnName];
            for (let attribute in column) {
                let impurity = column[attribute].impurityValue;

                if (impurity < minImpurity) {
                    minImpurity = impurity;
                    selectedAttribute = {
                        columnName: columnName,
                        attribute: attribute,
                        impurity: minImpurity,
                        impurityCalculationLeft: column[attribute].impurityCalculationLeft,
                        impurityCalculationRight: column[attribute].impurityCalculationRight,
                        impurityCalculationTotal: column[attribute].impurityCalculationTotal
                    }
                }
            }
        }

        return selectedAttribute;
    }

    /**
     * Create a new node for the tree
     * and filter out the dataset rows that match the node criteria
     */
    createTreeNode(dataset, selectedAttribute, direction) {
        let comparison;
        let data = dataset.data;
        let targetName = Object.keys(dataset.target)[0];
        let targetValues = dataset.target[targetName];
        let datatype = dataset.datatypes[selectedAttribute.columnName];

        if (direction === DIRECTION_LEFT) {
            comparison = (datatype === DATATYPE_CATEGORICAL) ? COMPARISON_EQUAL : COMPARISON_LESS_THAN_OR_EQUAL;
        } else {
            comparison = (datatype === DATATYPE_CATEGORICAL) ? COMPARISON_DISTINCT : COMPARISON_GREATER_THAN;
        }

        let datasetIndices = [];

        data[selectedAttribute.columnName].forEach((row, i) => {
            let isTrue = columnComparisonCallback(row, comparison, selectedAttribute.attribute);

            if (isTrue) {
                datasetIndices.push(i);
            }
        });

        let newNode = { dataset: { data: {}, target: {[targetName]: []}, datatypes: dataset.datatypes, ids: [] } }

        for (let column in data) {
            newNode.dataset.data[column] = [];
        }

        datasetIndices.forEach(index => {
            for (let column in newNode.dataset.data) {
                newNode.dataset.data[column].push(data[column][index]);
            }

            newNode.dataset.target[targetName].push(targetValues[index]);
            newNode.dataset.ids.push(dataset.ids[index]);
        });
        
        return newNode;
    }

    /**
     * Recursive method for generating the nodes
     */
    createPartition(node) {
        let targetName = Object.keys(node.dataset.target)[0];
        let target = node.dataset.target;
        let uniqueTargetValues = target[targetName].filter((v, i, a) => a.indexOf(v) === i);

        let attributes = Object.keys(node.dataset.data);
        let maxValueCount = 0;

        for (let attribute of attributes) {
            let uniqueColumnValues = node.dataset.data[attribute].filter((v, i, a) => a.indexOf(v) === i);

            if (uniqueColumnValues.length > maxValueCount) {
                maxValueCount = uniqueColumnValues.length;
            }
        }

        if (maxValueCount === 1) {
            let targetValueCount = {};

            target[targetName].forEach(targetValue => {
                targetValueCount[targetValue] = targetValueCount[targetValue] ? targetValueCount[targetValue] + 1 : 1;
            });

            let maxFrequency = 0;
            let mostFrequentValue;

            for (let value in targetValueCount) {
                if (targetValueCount[value] > maxFrequency) {
                    maxFrequency = targetValueCount[value];
                    mostFrequentValue = value;
                }
            }

            return mostFrequentValue;
        }
        
        if (uniqueTargetValues.length === 1) {
            return uniqueTargetValues[0];
        }

        let selectedAttribute = this.findOptimalAttribute(node.dataset);
        let leftNode = this.createTreeNode(node.dataset, selectedAttribute, DIRECTION_LEFT);
        let rightNode = this.createTreeNode(node.dataset, selectedAttribute, DIRECTION_RIGHT);

        node.label = node.dataset.datatypes[selectedAttribute.columnName] === DATATYPE_CATEGORICAL ? `${selectedAttribute.columnName} = ${selectedAttribute.attribute}` : `${selectedAttribute.columnName} <= ${selectedAttribute.attribute}`;
        node.bestFeature = selectedAttribute.columnName;
        node.bestFeatureType = node.dataset.datatypes[selectedAttribute.columnName];
        node.bestFeatureValue = selectedAttribute.attribute;
        node.impurity = selectedAttribute.impurity;
        node.impurityCalculationLeft = selectedAttribute.impurityCalculationLeft;
        node.impurityCalculationRight = selectedAttribute.impurityCalculationRight;
        node.impurityCalculationTotal = selectedAttribute.impurityCalculationTotal;

        node.left = this.createPartition(leftNode);
        node.right = this.createPartition(rightNode);

        return node;
    }

    /**
     * Main method for building the regression tree
     */
    buildRegressionTree() {
        let selectedAttribute = this.findOptimalAttribute(this.state.dataset);
        let leftNode = this.createTreeNode(this.state.dataset, selectedAttribute, DIRECTION_LEFT);
        let rightNode = this.createTreeNode(this.state.dataset, selectedAttribute, DIRECTION_RIGHT);
        let tree = this.state.tree;
        tree.root = {
            dataset: this.state.dataset,
            left: leftNode,
            right: rightNode,
            label: this.state.dataset.datatypes[selectedAttribute.columnName] === DATATYPE_CATEGORICAL ? `${selectedAttribute.columnName} = ${selectedAttribute.attribute}` : `${selectedAttribute.columnName} <= ${selectedAttribute.attribute}`,
            bestFeature: selectedAttribute.columnName,
            bestFeatureType: this.state.dataset.datatypes[selectedAttribute.columnName],
            bestFeatureValue: selectedAttribute.attribute,
            impurity: selectedAttribute.impurity,
            impurityCalculationLeft: selectedAttribute.impurityCalculationLeft,
            impurityCalculationRight: selectedAttribute.impurityCalculationRight,
            impurityCalculationTotal: selectedAttribute.impurityCalculationTotal
        };

        this.createPartition(this.state.tree.root);
    }

    /**
     * Generate nodes for D3 visualization
     */
    createD3Children(treeNode, originalNode, rootCopy) {
        if (!originalNode) {
            return null;
        }

        treeNode.name = originalNode.label ? originalNode.label : originalNode;

        let treeNodeLeft = {
            id: this.idCount++,
            side: 'left',
            children: []
        };

        let treeNodeRight = {
            id: this.idCount++,
            side: 'right',
            children: []
        };

        this.history.push(JSON.stringify(rootCopy));

        if (originalNode.left) {
            nodeAttributes[treeNodeLeft.id] = {
                bestFeature: originalNode.left.bestFeature,
                bestFeatureType: originalNode.left.bestFeatureType,
                bestFeatureValue: originalNode.left.bestFeatureValue,
                impurity: originalNode.left.impurity,
                impurityCalculationLeft: originalNode.left.impurityCalculationLeft,
                impurityCalculationRight: originalNode.left.impurityCalculationRight,
                impurityCalculationTotal: originalNode.left.impurityCalculationTotal,
                dataset: originalNode.left.dataset
            };
            treeNode.children.push(treeNodeLeft);
        }

        if (originalNode.right) {
            nodeAttributes[treeNodeRight.id] = {
                bestFeature: originalNode.right.bestFeature,
                bestFeatureType: originalNode.right.bestFeatureType,
                bestFeatureValue: originalNode.right.bestFeatureValue,
                impurity: originalNode.right.impurity,
                impurityCalculationLeft: originalNode.right.impurityCalculationLeft,
                impurityCalculationRight: originalNode.right.impurityCalculationRight,
                impurityCalculationTotal: originalNode.right.impurityCalculationTotal,
                dataset: originalNode.right.dataset
            };
            treeNode.children.push(treeNodeRight);
        }

        this.createD3Children(treeNodeLeft, originalNode.left, rootCopy);
        this.createD3Children(treeNodeRight, originalNode.right, rootCopy);

        return treeNode;
    }

    /**
     * Handle dataset selection event
     */
    handleDatasetChange(event) {
        this.datasetname = event.target.value;
        this.historyActive = false;
        this.setState({
            tree: {},
            dataset: datasets[event.target.value]
        });
    }

    /**
     * Handle impurity measure value change
     */
    handleImpurityMeasureChange(event) {
        this.setState({
            ...this.state,
            tree: {}
        });
        this.historyActive = false;
    }

    /**
     * Create D3 tree visualization
     */
    createD3Data() {
        let root = this.state.tree.root;
        
        this.idCount = 1;

        for (let key in nodeAttributes) {
            delete nodeAttributes[key];
        }
        
        let rootNode = {
            id: this.idCount++,
            parent: null,
            
            children: []
        }

        nodeAttributes[rootNode.id] = {
            impurity: root.impurity,
            dataset: root.dataset,
            name: rootNode.name,
            bestFeature: root.bestFeature,
            bestFeatureType: root.bestFeatureType,
            bestFeatureValue: root.bestFeatureValue,
            impurityCalculationLeft: root.impurityCalculationLeft,
            impurityCalculationRight: root.impurityCalculationRight,
            impurityCalculationTotal: root.impurityCalculationTotal
        };

        this.history = [];
        this.createD3Children(rootNode, root, rootNode);

        this.historyCount = this.history.length - 1;

        return [rootNode];
    }

    /**
     * Display first step
     */
    firstStep(event) {
        this.setState({
            ...this.state
        })
        this.historyActive = true;
        this.historyCount = 0;
        this.datasetname = this.datasetname + '_' + this.historyCount;
    }

    /**
     * Display the step before in the history array
     */
    stepBefore(event) {
        if (this.historyCount > 0) {
            this.setState({
                ...this.state
            })
            this.historyActive = true;
            this.historyCount--;
            this.datasetname = this.datasetname + '_' + this.historyCount;
        }
    }

    /**
     * Display the step after in the history array
     */
    stepAfter(event) {
        if (this.historyCount < this.history.length - 1) {
            this.setState({
                ...this.state
            })
            this.historyActive = true;
            this.historyCount++;
            this.datasetname = this.datasetname + '_' + this.historyCount;
        }
    }

    /**
     * Last step
     */

    lastStep(event) {
        this.setState({
            ...this.state
        })
        this.historyActive = true;
        this.historyCount = this.history.length - 1;
        this.datasetname = this.datasetname + '_' + this.historyCount;
    }

    /**
     * Display the dataset as a table on the left
     */
    visualizeDataset() {
        let key = Object.keys(this.state.dataset.target)[0];
        let columns = [];
        let data = this.state.dataset.data;
        
        for (let column in data) {
            columns.push(column);
        }

        let rows = this.state.dataset.target[key].map((_, i) => {
            return <tr key={ this.state.dataset.ids[i] } id={ 'row_' + this.state.dataset.ids[i] }  className='row-normal'>
                {
                    columns.map(column => {
                        return <td key={ column }>
                            { data[column][i] }
                        </td>
                    })
                }
                {
                    <td>
                        {
                            this.state.dataset.target[key][i]
                        }
                    </td>
                }
            </tr>
        });

        return (
            <table id='datasetTable' className='dataset'>
                <thead>
                    <tr key="0">
                        {
                            columns.map(column => {
                                return <th key={ column } className='header-row'>
                                    { column }
                                </th>
                            })
                        }
                        {
                            <th key="targetTh" className='header-row'>
                                { key }
                            </th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        rows
                    }
                </tbody>
            </table>
        )
    }

    handleOpenDocumentation() {
        this.setState({
            ...this.state
        });
        this.open = true;
    }

    handleCloseDocumentation() {
        this.setState({
            ...this.state
        });
        this.open = false;
    }

    /**
     * Rendering method
     */
    render() {
        if (!this.state.dataset.ids) {
            this.generateDatasetIds();
        }

        this.buildRegressionTree();
        let treeData;
        
        if (this.historyActive) {
            treeData = [JSON.parse(this.history[this.historyCount])];
        } else {
            treeData = this.createD3Data();
        }

        return (
            <div>
                <div className='container d-flex justify-content-center pt-2'>
                    <h3><strong>Regression Trees</strong></h3>
                </div>
                <div className='container d-flex justify-content-center'>
                    <Link onClick={ () => this.handleOpenDocumentation() }><img src='./documentation-icon.jpeg' />See documentation</Link>
                </div>
                <RegressionTreeDocumentation handleClose={ () => this.handleCloseDocumentation() } open={ this.open } />
                <div className='container'>
                    <div className='row'>
                        <form className='row'>
                            <div className='col'>
                                <label className='form-label'>Choose a dataset:</label>
                                <select className='form-control' onChange={ event => this.handleDatasetChange(event) }>
                                    {
                                        Object.keys(datasets).map((dataset, i) => (
                                            <option key={ `dataset_${i}` } value={ dataset }>{ dataset }</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className='row'>
                        <div className='col p-3' style={{ textAlign: "center" }}>
                            <h3>Dataset:</h3>
                            { this.visualizeDataset() }
                        </div>
                        <div className='col tree-display p-3' style={{ textAlign: "center" }}>
                            <h3>Tree:</h3>
                            <div className='d-flex justify-content-center'>
                                <div className='d-flex flex-direction-horizontal'>
                                    <button type='button' className='rounded-button' onClick={ event => this.firstStep(event) } title="First step" disabled={ this.historyCount === 0 }>|&lt;</button>
                                    <button type='button' className='rounded-button' onClick={ event => this.stepBefore(event) } title="Previous step" disabled={ this.historyCount === 0 }>&lt;</button>
                                    <button type='button' className='rounded-button' onClick={ event => this.stepAfter(event) } title="Next step" disabled={ this.historyCount === this.history.length - 1 }>&gt;</button>
                                    <button type='button' className='rounded-button' onClick={ event => this.lastStep(event) } title="Last step" disabled={ this.historyCount === this.history.length - 1 }>&gt;|</button>
                                </div>
                            </div>
                            <p>
                                Click on one of the nodes to see further details.
                            </p>
                            <div className='d-flex justify-content-center extended-height'>
                                <DecisionTreeNode key={ this.datasetname } treeData={ treeData } />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegressionTree;