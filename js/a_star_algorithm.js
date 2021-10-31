
let initialTable;

document.querySelector("#start_button").addEventListener("click", (event)=> {

    if(document.querySelector(".path_table")) {
        document.querySelector("#table_container").removeChild(document.querySelector(".path_table"));
    }

    //First save table
    initialTable = document.querySelector(".initial_table");
    initialTable.classList.add("hide_element");

    let pathTable = initialTable.cloneNode(true);
    pathTable.classList.add("path_table");
    pathTable.classList.remove("initial_table");
    pathTable.classList.remove("hide_element");

    document.querySelector("#table_container").appendChild(pathTable);

    //Run algorithm
    startAlgorithm();
    toggleControls();
})

function getNeighbors(node) {

    //The front Nodes will be the neighboring nodes on the left, on the right and above and below

    let table = document.querySelector(".path_table");
    let front_nodes = [];
    let cell_index = node.cellIndex;
    let row_Index = node.parentNode.rowIndex;

    //Above
    if (table.rows[row_Index-1]) {
        if(table.rows[row_Index-1].cells[cell_index]) {
            front_nodes.push(table.rows[row_Index-1].cells[cell_index]);
        }
    }

    //Below
    if (table.rows[row_Index+1]) {
        if(table.rows[row_Index+1].cells[cell_index]) {
            front_nodes.push(table.rows[row_Index+1].cells[cell_index]);
        }
    }

    //Left
    if(table.rows[row_Index].cells[cell_index-1]) {
        front_nodes.push(table.rows[row_Index].cells[cell_index-1]);
    }

    //Right
    if(table.rows[row_Index].cells[cell_index+1]) {
        front_nodes.push(table.rows[row_Index].cells[cell_index+1]);
    }

    return front_nodes;

}


function startAlgorithm(){
    let start_td = document.querySelector(`.path_table td[tile_type="start"]`);
    let end_td = document.querySelector(`.path_table td[tile_type="end"]`);

    let start_cell_index = start_td.cellIndex;
    let start_row_Index = start_td.parentNode.rowIndex;

    let end_cell_index = end_td.cellIndex;
    let end_row_Index = end_td.parentNode.rowIndex;

    let ancestry = new Map();
    let front_nodes = []; //Possible candidates
    let current_node;

    start_td.setAttribute("node_f", 0);
    start_td.setAttribute("cost", 0);
    start_td.setAttribute("g_cost_to_node", 0);
    front_nodes.push(start_td);

    while(current_node != end_td && front_nodes.length != 0) {

        //Pick the front node with the lowest f
        //And make it into current node

        let node_f_temp = 0;
        front_nodes.forEach(e => {

            let node_f = e.hasAttribute("node_f") ? Number(e.getAttribute("node_f")) : 0;

            if (node_f_temp == 0 || (node_f_temp != 0 && node_f < node_f_temp)) {
                node_f_temp = node_f;
                current_node = e;
            }

        })

        console.log("current_node ", current_node);
        let current_g = current_node.hasAttribute("g_cost_to_node") ? Number(current_node.getAttribute("g_cost_to_node")) : 0;
        let current_f = current_node.hasAttribute("node_f") ? Number(current_node.getAttribute("node_f")) : 0;

        //Find current node's neighbors
        //and move current node to the closed list
        let front_nodes_to_be = getNeighbors(current_node);
        front_nodes.splice(front_nodes.indexOf(current_node), 1);

        //Clear obstacle nodes
        front_nodes_to_be = front_nodes_to_be.filter(e => {
            let node_tile_type = e.hasAttribute("tile_type") ? e.getAttribute("tile_type") : "";
            return node_tile_type != "obstacle";
        })

        //If end node is included in the neighbors then the search is over
        if(front_nodes_to_be.includes(end_td)){
            console.log("End node included in front_nodes_to_be!", end_td);
            ancestry.set(end_td, current_node);
            current_node = end_td;
        } else {

            //Loop over the neighbor nodes and set their Parent to current if current node is a better origin
            front_nodes_to_be.forEach(e => {

                let g_cost_to_node = e.hasAttribute("g_cost_to_node") ? Number(e.getAttribute("g_cost_to_node")) : 0;
                let cost = e.hasAttribute("cost") ? Number(e.getAttribute("cost")) : 0;
                let g_cost_to_node_from_current = current_g + cost;

                //If g cost from current to this neighbor node is lower than previous paths
                //(or if it is the first time this node is being processed)
                //Keep this g score and make current its parent.

                if (g_cost_to_node == 0 || g_cost_to_node_from_current < g_cost_to_node) {

                    ancestry.set(e, current_node);
                    e.setAttribute("g_cost_to_node", g_cost_to_node_from_current);

                    let manhattan_distance_h = Math.abs(Number(e.cellIndex) - Number(end_cell_index)) + Math.abs(Number(e.parentNode.rowIndex) - Number(end_row_Index));
                    let node_f = manhattan_distance_h + g_cost_to_node_from_current;

                    e.setAttribute("node_f", node_f);
                    e.setAttribute("manhattan_distance_h", manhattan_distance_h);

                    if (!front_nodes.includes(e)) {
                        front_nodes.push(e);
                    }
                }

            })

            console.log("New Front nodes are ", front_nodes);
        }
    }

    if(current_node == end_td) {
    console.log("Finished search. End node is ", current_node);
    console.log("ancestry is ", ancestry);
    highlightPathOnCopy(ancestry, start_td, end_td);
    } else {
        alert("Δεν ήταν δυνατή η εύρεση μονοπατιού προς τον κόμβο «Τέλος");
    }

}

function highlightPath(ancestry, start_td, last_node){
    let parent = ancestry.get(last_node);
    //console.log("highlightPath: parent is ", parent);

    if(parent && parent != start_td) {
        parent.style.setProperty("background-color", "#FF0000");
        highlightPath(ancestry, start_td, parent);
    }

}

function highlightPathOnCopy(ancestry, start_td, last_node) {

    let parent = ancestry.get(last_node);
    let pathTable = document.querySelector(".path_table");

    if (parent && parent != start_td) {

        let row = pathTable.rows[parent.parentNode.rowIndex];
        let copy_td = row.cells[parent.cellIndex];
        copy_td.style.setProperty("background-color", "#FF0000");
        highlightPathOnCopy(ancestry, start_td, parent);
    }
}
