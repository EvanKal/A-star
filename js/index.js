const tile_types = {
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
        color: ["#FFA07A", "#FA8072", "#E9967A"],
        cost: [3,4,5],
        description: "hill",
        description_greek: "Λόφος"
    }
    ,
    mountain: {
        color: ["#C0C0C0", "#B3B3B3", "#A6A6A6", "#9A9A9A", "#8D8D8D", "#808080", "#737373", "#646464"],
        cost: [3,4,5,6,7,8,9,10],
        description: "mountain",
        description_greek: "Βουνό"
    }

}

document.querySelector("#draw_button").addEventListener("click", (event)=> {

    let rows = document.querySelector("#num_of_rows").value;
    let cols = document.querySelector("#num_of_columns").value;
    let table = document.querySelector("table");

    table.innerText = "";

    console.log("rows "+rows + "cols" + cols);

    if(rows && cols) {
        for(let i = 1; i <= rows; i++) {
            let row = document.createElement("tr");
            for(let j = 1; j <= cols; j++) {
                row.appendChild(document.createElement("td"));
            }

            table.appendChild(row);
            console.log(row);
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
                <div class="input_container"><input type="radio" name="color" value="${tile_types[t]}"/></div>
            </div>`;
    }

}

setUpColorRadios();