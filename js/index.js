let mousedown = false;
let tile_type_selected;


const tile_types = {
    start: {
        color: "#00FA9A",
        description: "start",
        description_greek: "Εκκίνηση"
    },
    end: {
        color: "#FF1493",
        description: "end",
        description_greek: "Τέλος"
    },
    obstacle: {
        color: "#000000",
        description: "obstacle",
        description_greek: "Εμπόδιο"
    },
    road: {
        color: "#FFE4B5",
        cost: 1,
        description: "road",
        description_greek: "Δρόμος"

    },
    grass: {
        color: "#B2FF66",
        cost: 2,
        description: "grass",
        description_greek: "Χορτάρι"
    },
    forest: {
        color: "#008000",
        cost: 3,
        description: "forest",
        description_greek: "Δάσος"
    },
    river: {
        color: "#6495ED",
        cost: 4,
        description: "river",
        description_greek: "Ποτάμι"
    },
    hill: {
        color: ["#994C00", "#CC6600", "#FF8000"],
        cost: [5,4,3],
        description: "hill",
        description_greek: "Λόφος"
    }
    ,
    mountain: {
        color: ["#4D4D4D", "#5A5A5A", "#666666", "#737373", "#808080", "#8D8D8D", "#9A9A9A", "#A6A6A6"],
        //color: ["#4D4D4D", "#5A5A5A", "#666666", "#737373", "#808080", "#8D8D8D", "#9A9A9A", "#A6A6A6"],
        //color: ["#C0C0C0", "#B3B3B3", "#A6A6A6", "#9A9A9A", "#8D8D8D", "#808080", "#737373", "#646464"],
        cost: [10,9,8,7,6,5,4,3],
        description: "mountain",
        description_greek: "Βουνό"
    }

}

document.querySelector("#draw_button").addEventListener("click", (event)=> {

    let rows = document.querySelector("#num_of_rows").value;
    let cols = document.querySelector("#num_of_columns").value;
    let table = document.querySelector("table");

    table.innerText = "";

    if(rows && cols) {
        for(let i = 1; i <= rows; i++) {
            let row = document.createElement("tr");
            for(let j = 1; j <= cols; j++) {
                row.appendChild(document.createElement("td"));
            }

            table.appendChild(row);
        }
    }

})

function setUpColorRadios() {
    let draw_areas_controls_container = document.querySelector("#draw_areas_controls_container");

    for(const t in tile_types) {

        draw_areas_controls_container.innerHTML = draw_areas_controls_container.innerHTML +
            `<div class="control_container_color_area">
                <div class="color_container">
                    <div class="color" style="background-color: ${Array.isArray(tile_types[t].color) ? tile_types[t].color[0] : tile_types[t].color}  "></div>
                </div>
                <div class="label_container"><p>${tile_types[t].description_greek} ${tile_types[t].cost ? Array.isArray(tile_types[t].cost) ? "(Κ="+tile_types[t].cost[0]+"-"+tile_types[t].cost[tile_types[t].cost.length-1]+")" : "(Κ="+tile_types[t].cost+")" : ""}</p></div>
                <div class="input_container"><input type="radio" name="color" value="${t}"/></div>
            </div>`;
    }

}

function setUpTdAttributes(target_td, tile_type){

    target_td.setAttribute("tile_type", tile_type.description);
    target_td.setAttribute("cost", tile_type.cost);
    target_td.style.setProperty("background-color", tile_type.color);

}

document.querySelector("table").addEventListener("mousedown", (e) => {

    if (e.target.nodeName == "TD") {

        let radio = document.querySelector("input[name=\"color\"]:checked");

        if(!radio) {
            alert("Επιλέξτε είδος περιοχής.");
        }

        tile_type_selected = document.querySelector("input[name=\"color\"]:checked").value;

        if(Array.isArray(tile_types[tile_type_selected].cost)) {
            let radius = tile_types[tile_type_selected].cost.length -1;
            let cellsByRadius = getNeighbourCells(e.target, radius);
            console.log(cellsByRadius);

            for(const item in cellsByRadius) {
                let index = item;
                let arrayOfElements = cellsByRadius[item];
                console.log(index);

                for(const elem in arrayOfElements) {
                    //console.log("arrayOfElements", arrayOfElements);

                    arrayOfElements[elem].setAttribute("tile_type", tile_types[tile_type_selected].description);
                    arrayOfElements[elem].setAttribute("cost", tile_types[tile_type_selected].cost[index]);
                    arrayOfElements[elem].style.setProperty("background-color", tile_types[tile_type_selected].color[index]);

                    console.log(tile_types[tile_type_selected].color[index]);

                    //debugger;

                }
            }


        } else {
            setUpSingleCell(e.target);
        }

    }

})

document.querySelector("table").addEventListener("mousemove", (e) => {

    if(mousedown && e.target.nodeName == "TD"){
        if(e.target.value != tile_type_selected) {
            setUpTdAttributes(e.target, tile_types[tile_type_selected]);
        }

    }
})

function getNeighbourCells(target_td, radius){
    let table = document.querySelector("table");
    let cellIndex = target_td.cellIndex;
    let rowIndex = target_td.parentNode.rowIndex;

    let cellsByRadius = {};
    let allcells = [];

    //Target cell added with a radius index of zero enclosed in an array
    cellsByRadius[0] = [target_td];

    for (let i = 1; i <= radius; i++) {
        let array = [];
        let row_offset = i;
        let cell_count_on_the_left_side = i;
        let cell_count_on_the_right_side = i;
        
        for(let k = row_offset; k >= 1; k--) {

            //Get neighbours above row
            if (table.rows[rowIndex - k]) {

                let row = table.rows[rowIndex - k];

                //Get row cells on the left hand side
                for (let j = 1; j <= cell_count_on_the_left_side; j++) {
                    if (row.cells[cellIndex - j]) {

                        let cell = row.cells[cellIndex - j];
                        if(!cellsByRadius[i-1].includes(cell)){
                            array.push(cell);
                        }

                    }
                }

                //Get row cell above
                if (row.cells[cellIndex]) {

                    let cell = row.cells[cellIndex];
                    if(!cellsByRadius[i-1].includes(cell)){
                        array.push(cell);
                    }
                }

                //Get row cells on the right hand side
                for (let j = 1; j <= cell_count_on_the_right_side; j++) {
                    if (row.cells[cellIndex + j]) {

                        let cell = row.cells[cellIndex + j];
                        if(!cellsByRadius[i-1].includes(cell)){
                            array.push(cell);
                        }
                    }
                }

            }

            //Get neighbours same row
            let row = table.rows[rowIndex];

            //Get row cells on the left hand side
            for (let j = 1; j <= cell_count_on_the_left_side; j++) {
                if (row.cells[cellIndex - j]) {

                    let cell = row.cells[cellIndex - j];
                    if(!cellsByRadius[i-1].includes(cell)){
                        array.push(cell);
                    }
                }
            }

            //No need to collect current cell

            //Get row cells on the right hand side
            for (let j = 1; j <= cell_count_on_the_right_side; j++) {
                if (row.cells[cellIndex + j]) {

                    let cell = row.cells[cellIndex + j];
                    if(!cellsByRadius[i-1].includes(cell)){
                        array.push(cell);
                    }

                }
            }

            if (table.rows[rowIndex + k]) {

                let row = table.rows[rowIndex + k];

                //Get row cells on the left hand side
                for (let j = 1; j <= cell_count_on_the_left_side; j++) {
                    if (row.cells[cellIndex - j]) {

                        let cell = row.cells[cellIndex - j];
                        if(!cellsByRadius[i-1].includes(cell)){
                            array.push(cell);
                        }

                    }
                }

                //Get row cell above
                if (row.cells[cellIndex]) {

                    let cell = row.cells[cellIndex];
                    if(!cellsByRadius[i-1].includes(cell)){
                        array.push(cell);
                    }

                }

                //Get row cells on the right hand side
                for (let j = 1; j <= cell_count_on_the_right_side; j++) {
                    if (row.cells[cellIndex + j]) {

                        let cell = row.cells[cellIndex + j];
                        if(!cellsByRadius[i-1].includes(cell)){
                            array.push(cell);
                        }
                    }
                }

            }

        }


        //array contains elements from offsets that should not be included
        //filtering is needed
        let array1 = array.filter(function(ele){
            return !allcells.includes(ele);
        });

        cellsByRadius[i] = Array.from(new Set(array1)); //Clean up array of duplicates
        allcells = allcells.concat(array);

    }

    return cellsByRadius;

}

function setUpSingleCell(target) {
    if(tile_type_selected != "start" && tile_type_selected != "end" ) {
        mousedown = true;

    } else {

        //Reset old start/end cell before seting up the new one
        let unique_node = document.querySelector(`td[tile_type="${tile_types[tile_type_selected].description}"]`);
        if(unique_node) {
            unique_node.setAttribute("tile_type", "");
            unique_node.setAttribute("cost", "");
            unique_node.style.setProperty("background-color", "");
        }

    }

    setUpTdAttributes(target, tile_types[tile_type_selected]);
}

document.querySelector("table").addEventListener("mouseup", (e) => {

    if(mousedown && e.target.nodeName == "TD"){
        mousedown=false;
    }
})


///////////////////////////////////////////////////////////
setUpColorRadios();

document.querySelector("#draw_button").click();
//document.querySelector(".input_container input[value=\"start\"]").click();
let tds = document.querySelectorAll("table td");
setUpTdAttributes(tds[0], tile_types["start"]);
setUpTdAttributes(tds[tds.length-1], tile_types["end"]);

