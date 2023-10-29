import d3 from 'd3';
import tippy from 'tippy.js';
import { MathfieldElement } from 'mathlive';

const DATASET_SIDE_LEFT = 'left';
const DATASET_SIDE_RIGHT = 'right';

var node = document.createElement('div');
var nodeAttributes = {};

d3.select(node);

// ************** Generate the tree diagram	 *****************
var margin = {top: 40, right: 0, bottom: 0, left: 100},
    width = window.innerWidth / 3 - margin.right - margin.left,
    height = window.innerHeight / 2 - margin.top - margin.bottom;
    
var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg;

/**
 * Define which side of the partition the given data belongs to
 * Mainly to decide on what colour should be assigned to specific rows
 */

function getDatasetSide(dataset, index, bestFeature, bestValue) {
    if (bestFeature === undefined) {
        return null;
    }

    return (dataset.datatypes[bestFeature] === 'continuous') ? 
                (dataset.data[bestFeature][index] <= bestValue) ? DATASET_SIDE_LEFT : DATASET_SIDE_RIGHT :
                (dataset.data[bestFeature][index] === bestValue) ? DATASET_SIDE_LEFT : DATASET_SIDE_RIGHT;
}

/**
 * Generate node generation data, including the dataset as well as impurity calculations
 */

function generateNodeData(reportId, impurityReport, dataset) {
    const div = document.createElement('div');
    const innerContent = document.createElement('div');
    innerContent.className = 'bg-light p-3';
    innerContent.style.width = '700px';

    innerContent.style.border = "solid";
    innerContent.style.borderWidth = "3px";
    innerContent.style.borderColor = "#058";
    innerContent.style.fontFamily = "Century Gothic";
    div.appendChild(innerContent);

    const title = document.createElement('h5');
    title.innerHTML = "<strong>Impurity calculation details:</strong><p class='small-directions'>Click anywhere to dismiss this dialog.</p>";

    const impurityCalculationLeft = document.createElement('div');
    impurityCalculationLeft.innerHTML = `<math-field>${impurityReport.impurityCalculationLeft}</math-field>`;

    const impurityCalculationRight = document.createElement('div');
    impurityCalculationRight.innerHTML = `<math-field>${impurityReport.impurityCalculationRight}</math-field>`;

    const impurityCalculationTotal = document.createElement('div');
    impurityCalculationTotal.innerHTML = `<math-field>\\text{Total impurity}=${impurityReport.impurityCalculationTotal}</math-field>`;

    innerContent.appendChild(title);
    innerContent.appendChild(impurityCalculationLeft);
    innerContent.appendChild(impurityCalculationRight);
    innerContent.appendChild(impurityCalculationTotal);

    let description = document.createElement('h5');
    description.innerHTML = 'Dataset that leads to this node:';

    innerContent.appendChild(description);

    const table = document.createElement('table');
    table.style.fontSize = '10pt';
    table.style.width = '100%';
    const firstRow = document.createElement('tr');

    const targetName = Object.keys(dataset.target)[0];

    for (const columnName in dataset.data) {
        const th = document.createElement('th');
        th.style.borderStyle = 'solid';
        th.style.borderWidth = '1px';
        th.style.borderColor = '#fff';
        th.style.textAlign = 'center';
        th.style.color = 'white';
        th.style.backgroundColor = '#058';
        th.innerHTML = columnName;

        firstRow.appendChild(th);
    }

    const thTarget = document.createElement('th');
    thTarget.style.borderStyle = 'solid';
    thTarget.style.borderWidth = '1px';
    thTarget.style.borderColor = '#fff';
    thTarget.style.textAlign = 'center';
    thTarget.style.backgroundColor = '#058';
    thTarget.style.color = 'white';
    thTarget.innerHTML = targetName;

    firstRow.appendChild(thTarget);
    table.appendChild(firstRow);

    for (const i in dataset.target[targetName]) {
        const row = document.createElement('tr');
        let side = getDatasetSide(dataset, i, impurityReport.bestFeature, impurityReport.bestFeatureValue);

        for (const columnName in dataset.data) {
            const td = document.createElement('td');
            td.style.borderStyle = 'solid';
            td.style.color = '#fff';
            td.style.borderWidth = '1px';
            td.style.borderColor = '#fff';
            td.style.textAlign = 'center';
            td.style.backgroundColor = (side === DATASET_SIDE_LEFT) ? '#a52' : '#32a';
            td.innerHTML = dataset.data[columnName][i];

            row.appendChild(td);
        }

        const tdTarget = document.createElement('td');
        tdTarget.style.borderStyle = 'solid';
        tdTarget.style.borderWidth = '1px';
        tdTarget.style.borderColor = '#fff';
        tdTarget.style.textAlign = 'center';
        tdTarget.style.color = '#fff';
        tdTarget.style.fontWeight = 'bold';
        tdTarget.style.backgroundColor = (side === DATASET_SIDE_LEFT) ? '#a52' : '#32a';
        tdTarget.innerHTML = dataset.target[targetName][i];
        row.appendChild(tdTarget);
        table.appendChild(row);
    }

    innerContent.appendChild(table);

    return div.innerHTML;
}

/**
 * Generate the tree graph
 */
function update(root, element) {    
    if (svg) {
        d3.select(element).select('svg').remove();
    }

    svg = d3.select(element).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height * 2 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 100; });
  
    // Declare the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("id", function(d) {
            return `node_${d.id}`;
        })
        .attr("class", "node")
        .style("opacity", function(d) { return (d.name) ? 1 : 0 })
        .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; 
        });

    nodeEnter.append("circle")
        .attr("r", 20)
        .style("fill", function(d) {
            return d.children || d._children ? '#26a' : '#6c2'; 
        });

    for (let id in nodeAttributes) {
        let node = document.querySelector(`#node_${id}`);
        let circle = document.querySelector(`#node_${id} > circle`);
        if (nodeAttributes[id].impurity !== undefined && node && node.style.opacity !== '0') {
            tippy(`#node_${id}`, {
                trigger: 'click',
                content: generateNodeData(`report_${id}`, nodeAttributes[id], nodeAttributes[id].dataset),
                allowHTML: true,
                placement: 'bottom',
                onShow(instance) {
                    circle.style.fill = '#38e';
                    nodeAttributes[id].dataset.ids.forEach(rowId => {
                        const row = document.querySelector(`#row_${rowId}`);
                        row.childNodes.forEach(child => {
                            child.className = 'row-glowing';
                        })
                    })
                },
                onHide(instance) {
                    circle.style.fill = '#26a';
                    nodeAttributes[id].dataset.ids.forEach(rowId => {
                        const row = document.querySelector(`#row_${rowId}`);
                        row.childNodes.forEach(child => {
                            child.className = 'row-normal';
                        })
                    })
                }
            });
        }
    }
  
    nodeEnter.append("text")
        .attr("y", function(d) { 
            return d.children || d._children ? -30 : 32; 
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1)
        .style("font-size", "10pt")
        .style("font-weight", "bold");
  
    // Declare the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
  
    // Enter the links.
    link.enter()
        .insert("path", "g")
        .attr("class", "link")
        .style("opacity", function(d) {
            return (d.target.name) ? 1 : 0;
        })
        .attr("d", diagonal);

    link.enter().append("text")
        .attr("x", function(d) {
            let position = (d.source.x + d.target.x) / 2;
            return (d.target.side === 'left') ? position - 15: position + 15;
        })
        .attr("y", function(d) {
            return (d.source.y + d.target.y) / 2
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            let node = document.querySelector(`#node_${d.target.id}`);

            if (!node || node.style.opacity === '0') {
                return '';
            }

            return (d.target.side === 'left') ? 'T': 'F';
        })
        .style("fill-opacity", 1)
        .style("font-size", "9pt")
        .style("font-weight", "bold");
}

export {node, nodeAttributes, update};