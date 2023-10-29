import React from 'react';
import rd3 from 'react-d3-library';
import { node, nodeAttributes, update } from './d3tree';
import ClassificationTreeDocumentation from './ClassificationTreeDocumentation';
import { Link } from '@mui/material';
const RD3Component = rd3.Component;

const DATATYPE_CATEGORICAL = 'categorical';
const COMPARISON_EQUAL = 'equal';
const COMPARISON_DISTINCT = 'distinct';
const COMPARISON_GREATER_THAN = 'greater_than';
const COMPARISON_LESS_THAN_OR_EQUAL = 'less_than_or_equal';
const DATATYPE_CONTINUOUS = 'continuous';
const IMPURITY_ENTROPY = 1;
const IMPURITY_GINI = 2;
const IMPURITY_MISCLASSIFICATION_ERROR = 3;
const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = 2;

const impurityMeasures = [
    IMPURITY_ENTROPY,
    IMPURITY_GINI,
    IMPURITY_MISCLASSIFICATION_ERROR
];

const impurityMeasureTexts = [
    'Entropy',
    'Gini Index',
    'Misclassification error'
];

/**
 * Dataset declarations
 */

const XOR_DATASET = {
    data: {
        'X1': ['0', '0', '1', '1'],
        'X2': ['0', '1', '0', '1']
    },
    target: {
        'Y': ['0', '1', '1', '0']
    },
    datatypes: {
        'X1': DATATYPE_CATEGORICAL,
        'X2': DATATYPE_CATEGORICAL
    }
};

const ANIMALS_DATASET = {
    data: {
        'Teeth'   :  ['Yes', 'Yes', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No'],
        'Breathes':  ['Yes', 'Yes', 'Yes', 'No', 'Yes', 'Yes', 'No', 'Yes', 'Yes', 'Yes'],
        'Paws'    :  ['Yes', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'No', 'No', 'Yes', 'Yes']
    },
    target: {
        'Species' :  ['Mammal', 'Mammal', 'Reptile', 'Mammal', 'Mammal', 'Mammal', 'Reptile', 'Reptile', 'Mammal', 'Reptile']
    },
    datatypes: {
        'Teeth'   :  DATATYPE_CATEGORICAL,
        'Breathes':  DATATYPE_CATEGORICAL,
        'Paws'    :  DATATYPE_CATEGORICAL,
        'Species' :  DATATYPE_CATEGORICAL
    }
};

const BORROWERS_DATASET = {
    data: {
        'HomeOwner': ['Yes', 'No', 'No', 'Yes', 'No', 'No', 'Yes', 'No', 'No', 'No'],
        'MaritalStatus': ['Single', 'Married', 'Single', 'Married', 'Divorced', 'Married', 'Divorced', 'Single', 'Married', 'Single'],
        'AnnualIncome': [125, 100, 70, 120, 95, 60, 220, 85, 75, 90]
    },
    target: {
        'DefaultedBorrower': ['No', 'No', 'No', 'No', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes']
    },
    datatypes: {
        'HomeOwner': DATATYPE_CATEGORICAL,
        'MaritalStatus': DATATYPE_CATEGORICAL,
        'AnnualIncome': DATATYPE_CONTINUOUS
    }
};

const HACKEREARTH_DATASET = {
    data: {
        'Weather': ['Sunny', 'Cloudy', 'Sunny', 'Cloudy', 'Rainy', 'Rainy', 'Rainy', 'Sunny', 'Cloudy', 'Rainy'],
        'Temperature': [80, 66, 43, 82, 65, 42, 70, 81, 69, 67],
        'Humidity': ['High', 'High', 'Normal', 'High', 'High', 'Normal', 'High', 'High', 'Normal', 'High'],
        'Wind': ['Weak', 'Weak', 'Strong', 'Strong', 'Strong', 'Strong', 'Weak', 'Strong', 'Weak', 'Strong']
    },
    target: {
        'Play?': ['No', 'Yes', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'No']
    },
    datatypes: {
        'Weather': DATATYPE_CATEGORICAL,
        'Temperature': DATATYPE_CONTINUOUS,
        'Humidity': DATATYPE_CATEGORICAL,
        'Wind': DATATYPE_CATEGORICAL
    }
}

const DEVELOPER_DATASET = {
    data: {
        'Experience': [2, 4, 8, 10, 12],
        'Python': ['No', 'Yes', 'No', 'No', 'No']
    },
    target: {
        'Hired': ['No', 'Yes', 'No', 'Yes', 'Yes']
    },
    datatypes: {
        'Experience': DATATYPE_CONTINUOUS,
        'Python': DATATYPE_CATEGORICAL
    }
}

const EDUCATION_DATASET = {
    data: {
        'Age': [34, 22, 45, 67, 19, 32, 55, 40, 28, 60, 25, 51, 48, 39, 44, 26, 59, 36, 20, 49, 30, 53, 41, 24, 38, 57, 21, 42, 64, 29, 50, 68, 23, 35, 52, 43, 61, 27, 46, 56, 33, 70, 37, 54, 31, 47, 65, 18, 58, 19, 63, 22],
        'Education': ['Bachelor', 'Masters', 'PhD', 'Bachelor', 'High School', 'High School', 'PhD', 'Masters', 'Bachelor', 'Masters', 'PhD', 'Bachelor', 'High School', 'PhD', 'Masters', 'Bachelor', 'High School', 'High School', 'PhD', 'Masters', 'Bachelor', 'Masters', 'PhD', 'Bachelor', 'High School', 'PhD', 'Masters', 'Bachelor', 'Masters', 'PhD', 'Bachelor', 'High School', 'High School', 'PhD', 'Masters', 'Bachelor', 'Masters', 'PhD', 'Bachelor', 'High School', 'PhD', 'Masters', 'Bachelor', 'Masters', 'PhD', 'Bachelor', 'High School', 'High School'],
        'Salary': [55000, 75000, 90000, 54000, 30000, 32000, 87000, 78000, 60000, 81000, 95000, 52000, 28000, 93000, 79000, 59000, 33000, 35000, 85000, 76000, 61000, 73000, 91000, 56000, 31000, 89000, 80000, 63000, 83000, 97000, 54000, 32000, 34000, 89000, 77000, 62000, 74000, 92000, 57000, 29000, 94000, 82000, 64000, 86000, 99000, 55000, 75000],
        'Location': ['New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California', 'Texas', 'Florida', 'New York', 'California'],
        'Gender': ['Male', 'Female', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Male', 'Female', 'Female', 'Male', 'Female', 'Male'],
    },
    target: {
        'Response': ['Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes'],
    },
    datatypes: {
        'Age': DATATYPE_CONTINUOUS,
        'Education': DATATYPE_CATEGORICAL,
        'Salary': DATATYPE_CONTINUOUS,
        'Location': DATATYPE_CATEGORICAL,
        'Gender': DATATYPE_CATEGORICAL,
        'Response': DATATYPE_CATEGORICAL,
    }
};

const DIABETES_DATASET = {
    data: {
        'Glucose': [110, 125, 95, 140, 115, 120, 130, 118, 105, 100],
        'BloodPressure': [70, 80, 65, 72, 75, 82, 90, 76, 68, 88],
        'BMI': [26.6, 29.2, 24.8, 31.9, 27.1, 30, 28.3, 25.4, 23.8, 26.2],
        'Age': [35, 40, 28, 45, 38, 42, 50, 33, 30, 36]
    },
    target: {
        'Diabetes': ['No', 'Yes', 'No', 'Yes', 'No', 'No', 'Yes', 'No', 'No', 'Yes']
    },
    datatypes: {
        'Glucose': DATATYPE_CONTINUOUS,
        'BloodPressure': DATATYPE_CONTINUOUS,
        'BMI': DATATYPE_CONTINUOUS,
        'Age': DATATYPE_CONTINUOUS
    }
};

const datasets = {
    'XOR': XOR_DATASET,
    'Borrowers': BORROWERS_DATASET,
    'Animals': ANIMALS_DATASET,
    'HackerEarth': HACKEREARTH_DATASET,
    'Developer': DEVELOPER_DATASET,
    'Education': EDUCATION_DATASET
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
class ClassificationTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: {}
        }
        this.impurityType = IMPURITY_ENTROPY;
        this.datasetname = 'XOR';
        this.history = [];
        this.historyActive = false;
        this.idCount = 1;
        this.state.dataset = datasets[this.datasetname];
        this.open = false;
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
    calculateAttributeImpurity(data, counts, column, columnValue, targetName, targetValues, uniqueTargetValues, comparison, impurityType) {
        let impurityResult = {
            impurityCalculationText: '',
            columnProbabilityText: ''
        };
        let impurity = 0.0;
        let totalRecords = data[column].length;

        let total = data[column].filter(value => columnComparisonCallback(value, comparison, columnValue)).length;
        let maxProb = 0.0;

        if (total !== 0) {
            for (let targetValue of uniqueTargetValues) {
                counts[`${targetName}_${targetValue}`][`${column}_${columnValue}`] = data[column].filter((value, i) => columnComparisonCallback(value, comparison, columnValue) && targetValues[i] === targetValue).length;
                let prob = counts[`${targetName}_${targetValue}`][`${column}_${columnValue}`] / total;
                let probText = '\\frac{' + counts[`${targetName}_${targetValue}`][`${column}_${columnValue}`] + '}{' + total + '}';

                if (prob !== 0) {
                    switch (impurityType) {
                        case IMPURITY_ENTROPY:
                            impurity -= prob * Math.log2(prob);
                            impurityResult.impurityCalculationText += `+\\begin{matrix}${probText}\\end{matrix}\\times \\log_2\\begin{pmatrix}${probText}\\end{pmatrix}`;
                            break;
                        case IMPURITY_GINI:
                            impurity += prob * prob;
                            impurityResult.impurityCalculationText += `+\\begin{pmatrix}${probText}\\end{pmatrix}^2`;
                            break;
                        case IMPURITY_MISCLASSIFICATION_ERROR:
                            if (prob > maxProb) {
                                impurity = prob;
                            }
                            impurityResult.impurityCalculationText += `,${probText}`;
                            break;
                    }
                }
            }
        }

        let finalImpurity = 0.0;

        switch (impurityType) {
            case IMPURITY_ENTROPY:
                finalImpurity = impurity;
                impurityResult.impurityCalculationText = `-\\{${impurityResult.impurityCalculationText.substring(1)}\\}`;
                break;
            case IMPURITY_GINI:
                finalImpurity = 1 - impurity;
                impurityResult.impurityCalculationText = `1-\\{${impurityResult.impurityCalculationText.substring(1)}\\}`;
                break;
            case IMPURITY_MISCLASSIFICATION_ERROR:
                finalImpurity = 1 - impurity;
                impurityResult.impurityCalculationText = `1-\\max\\begin{pmatrix}${impurityResult.impurityCalculationText.substring(1)}\\end{pmatrix}`;
        }

        impurityResult.columnProbability = total / totalRecords;
        impurityResult.columnProbabilityText = `\\frac{${total}}{${totalRecords}}`;
        impurityResult.finalImpurity = finalImpurity;
        
        return impurityResult;
    }

    /**
     * Calculate an overall column impurity
     * and report the total impurity values and calculation procedures
     */
    calculateColumnImpurity(dataset, column, impurityType) {
        const data = dataset.data;
        const targetName = Object.keys(dataset.target)[0];
        const targetValues = Object.values(dataset.target)[0];
        const types = dataset.datatypes;
        let uniqueTargetValues = targetValues.filter((v, i, a) => a.indexOf(v) === i);
        let impurities = {};

        let columnValues = data[column].filter((v, i, a) => a.indexOf(v) === i);
        let counts = {};

        for (let targetValue of uniqueTargetValues) {
            counts[`${targetName}_${targetValue}`] = {};
        }

        // If this is a binary column, then perform impurity evaluation just once.
        if (columnValues.length === 2) {
            columnValues.splice(1, 1);
        }

        // Get impurity values for each unique column value or midpoint
        if (types[column] === DATATYPE_CATEGORICAL) {
            columnValues.forEach(columnValue => {
                let impurityLeft = this.calculateAttributeImpurity(data, counts, column, columnValue, targetName, targetValues, uniqueTargetValues, COMPARISON_EQUAL, impurityType);
                let impurityRight = this.calculateAttributeImpurity(data, counts, column, columnValue, targetName, targetValues, uniqueTargetValues, COMPARISON_DISTINCT, impurityType);
                let leftImpurityResultText, rightImpurityResultText;

                impurities[columnValue] = impurityLeft.finalImpurity + impurityRight.finalImpurity;

                switch (this.impurityType) {
                    case IMPURITY_ENTROPY:
                        leftImpurityResultText = `H(${column}=${columnValue})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                        rightImpurityResultText = `H(${column}!=${columnValue})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;
                        break;
                    case IMPURITY_GINI:
                        leftImpurityResultText = `Gini(${column}=${columnValue})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                        rightImpurityResultText = `Gini(${column}!=${columnValue})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;
                        break;
                    case IMPURITY_MISCLASSIFICATION_ERROR:
                        leftImpurityResultText = `Error(${column}=${columnValue})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                        rightImpurityResultText = `Error(${column}!=${columnValue})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;
                        break;
                }

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
                let impurityLeft = this.calculateAttributeImpurity(data, counts, column, midpoint, targetName, targetValues, uniqueTargetValues, COMPARISON_LESS_THAN_OR_EQUAL, impurityType);
                let impurityRight = this.calculateAttributeImpurity(data, counts, column, midpoint, targetName, targetValues, uniqueTargetValues, COMPARISON_GREATER_THAN, impurityType);
                impurities[midpoint] = impurityLeft.finalImpurity + impurityRight.finalImpurity;

                switch (this.impurityType) {
                    case IMPURITY_ENTROPY:
                        leftImpurityResultText = `H(${column}\\leq ${midpoint})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                        rightImpurityResultText = `H(${column}>${midpoint})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;
                        break;
                    case IMPURITY_GINI:
                        leftImpurityResultText = `Gini(${column}\\leq ${midpoint})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                        rightImpurityResultText = `Gini(${column}>${midpoint})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;
                        break;
                    case IMPURITY_MISCLASSIFICATION_ERROR:
                        leftImpurityResultText = `Error(${column}\\leq ${midpoint})=${impurityLeft.impurityCalculationText}=${Math.round(impurityLeft.finalImpurity * 100) / 100}`;
                        rightImpurityResultText = `Error(${column}>${midpoint})=${impurityRight.impurityCalculationText}=${Math.round(impurityRight.finalImpurity * 100) / 100}`;
                        break;
                }

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
            impurities[column] = this.calculateColumnImpurity(dataset, column, this.impurityType);
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
        let minImpurity = 10.0;

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
        node.impurity = selectedAttribute.impurity;
        node.bestFeature = selectedAttribute.columnName;
        node.bestFeatureType = node.dataset.datatypes[selectedAttribute.columnName];
        node.bestFeatureValue = selectedAttribute.attribute;
        node.impurityCalculationLeft = selectedAttribute.impurityCalculationLeft;
        node.impurityCalculationRight = selectedAttribute.impurityCalculationRight;
        node.impurityCalculationTotal = selectedAttribute.impurityCalculationTotal;

        node.left = this.createPartition(leftNode);
        node.right = this.createPartition(rightNode);

        return node;
    }

    /**
     * Main method for building the classification tree
     */
    buildClassificationTree() {
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
        this.impurityType = parseInt(event.target.value);
        this.datasetname = this.datasetname + '_impurity_' + this.impurityType;
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
            return <tr key={ this.state.dataset.ids[i] } id={ 'row_' + this.state.dataset.ids[i] } className='row-normal'>
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

        this.buildClassificationTree();
        let treeData;
        
        if (this.historyActive) {
            treeData = [JSON.parse(this.history[this.historyCount])];
        } else {
            treeData = this.createD3Data();
        }

        return (
            <div>
                <div className='container d-flex justify-content-center p-2'>
                    <h3><strong>Classification Trees</strong></h3>
                </div>
                <div className='container d-flex justify-content-center'>
                    <Link onClick={ () => this.handleOpenDocumentation() }><img src='./documentation-icon.jpeg' />See documentation</Link>
                </div>
                <ClassificationTreeDocumentation handleClose={ () => this.handleCloseDocumentation() } open={ this.open } />
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
                            <div className='col'>
                                <label className='form-label'>Choose impurity measure:</label>
                                <select className='form-control' onChange={ event => this.handleImpurityMeasureChange(event) }>
                                    {
                                        impurityMeasures.map((impurityMeasure, i) => (
                                            <option key={ `impurityMeasure_${i}` } value={ impurityMeasure }>{ impurityMeasureTexts[i] }</option>
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
                        <div className='col p-3' style={{ textAlign: "center" }}>
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
                            <div className='d-flex justify-content-center extended-'>
                                <DecisionTreeNode key={ this.datasetname } treeData={ treeData } />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClassificationTree;