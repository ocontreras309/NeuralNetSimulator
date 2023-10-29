import React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { MathComponent } from 'mathjax-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

class ClassificationTreeDocumentation extends React.Component {
    constructor(props) {
        super(props);
    }

    handleOpen() {
        this.setState({
            ...this.state
        });
        this.open = true;
    }

    render() {
        return (
            <BootstrapDialog onClose={ () => this.props.handleClose() } aria-labelledby="customized-dialog-title" open={ this.props.open }>
                <div className='p-3 documentation-text'>
                    <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>Classification trees</DialogTitle>
                    <DialogContent>
                        <div style={{ textAlign: 'justify' }}>
                            These are by far among the most popular algorithms in supervised learning. The key 
                            insight of classification trees is to find the best partitions among all possibilities
                            in given dataset.
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            In order to determine the best possible partition for a given node, we must use a relevant partition metric. 
                            For classification trees, we have three possible partition metrics:
                            <div>
                                <MathComponent tex={ String.raw`\text{Entropy}=-\sum_{k=1}^K p(y_k)\log_2 p(y_k)` } />
                            </div>
                            <div>
                                <MathComponent tex={ String.raw`\text{Gini Index}=1-\sum_{k=1}^K p(y_k)^2` } />
                            </div>
                            <div>
                                <MathComponent tex={ String.raw`\text{Misclassification error}=1-\max(p(y_k))` } />
                            </div>
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            For example, in the following dataset:
                            <table style={{ width: '100%', borderStyle: 'solid' }} className='documentation-dataset'>
                                <tr>
                                    <th>
                                        X1
                                    </th>
                                    <th>
                                        X2
                                    </th>
                                    <th>
                                        Y
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        0
                                    </td>
                                    <td>
                                        0
                                    </td>
                                    <td>
                                        0
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        0
                                    </td>
                                    <td>
                                        1
                                    </td>
                                    <td>
                                        1
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        1
                                    </td>
                                    <td>
                                        0
                                    </td>
                                    <td>
                                        1
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        1
                                    </td>
                                    <td>
                                        1
                                    </td>
                                    <td>
                                        0
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            We would say that the entropy for X2=1 is:
                            <MathComponent tex={ String.raw`\text{Entropy}=-\frac 1 2\times \log_2\left(\frac 1 2\right)-\frac 1 2\times \log_2\left(\frac 1 2\right)=1` } />
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            This is because for X2=1, the dataset has two possible target values, 0 and 1. So each of these will appear with the same probability of 1/2.
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            It's worth pointing out that the maximum value for the entropy is 1, whereas both the Gini index and the misclassification error can have values
                            up to 0.5. For example, the Gini index calculation for the example above would be the following:
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            <MathComponent tex={ String.raw`\text{Gini Index}=1-\left(\frac 1 2\right)^2-\left(\frac 1 2\right)^2=0.5` } />
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            Finally, the decision tree for this particular dataset will be:
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <img src='./xor_tree.png' width={ "80%" } />
                        </div>
                    </DialogContent>
                </div>
            </BootstrapDialog>
        );
    }
}

export default ClassificationTreeDocumentation;
