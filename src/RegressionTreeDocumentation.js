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

class RegressionTreeDocumentation extends React.Component {
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
                    <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>Regression trees</DialogTitle>
                    <DialogContent>
                        <div style={{ textAlign: 'justify' }}>
                            Decision trees can be used for dealing with both regression and classification problems in the context of supervised learning.
                            Regression trees are trained in pretty much the same way as classification trees. However one key difference is
                            that instead of using classification metrics, such as the entropy in order to determine the best partitions,
                            we use the variance, whose mathematical expression is:
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            <MathComponent tex={ String.raw`\text{Variance}=\frac{\sum_k(y_i-\bar y)^2}{n}` } />
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            That is, for all target values belonging to a particular partition, we should calculate
                            their variance, and then use it as a metric for partitioning.
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            For example, in the following dataset:
                            <table style={{ width: '100%', borderStyle: 'solid' }} className='documentation-dataset'>
                                <tr>
                                    <th>
                                        Area
                                    </th>
                                    <th>
                                        Construction
                                    </th>
                                    <th>
                                        Price (Thousands of dollars)
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        40
                                    </td>
                                    <td>
                                        Adobe
                                    </td>
                                    <td>
                                        30
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        80
                                    </td>
                                    <td>
                                        Brick
                                    </td>
                                    <td>
                                        80
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        100
                                    </td>
                                    <td>
                                        Brick
                                    </td>
                                    <td>
                                        90
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        120
                                    </td>
                                    <td>
                                        Adobe
                                    </td>
                                    <td>
                                        45
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        150
                                    </td>
                                    <td>
                                        Adobe
                                    </td>
                                    <td>
                                        50
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            We would say that the variance for Areas greater than 90m2 is:
                            <MathComponent tex={ String.raw`\text{Variance}=\frac{(90-61.67)^2+(45-61.67)^2+(50-61.67)^2}{3}` } />
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                            Which gives us 405.56. Finally, the decision tree for this particular dataset will be:
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <img src='./housing_tree.png' width={ "80%" } />
                        </div>
                    </DialogContent>
                </div>
            </BootstrapDialog>
        );
    }
}

export default RegressionTreeDocumentation;
