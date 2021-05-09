// Made excel grid ui using js

let topRow = document.querySelector(".top-row");
let str = "";
for (let i = 0; i < 26; i++) {
    str += `<div class='col top-col'>${String.fromCharCode(65 + i)}</div>`;
}
topRow.innerHTML = str;

let leftCol = document.querySelector(".left-col");
str = ""
for (let i = 0; i < 100; i++) {
    str += `<div class='left-col_box'>${i + 1}</div>`
}
leftCol.innerHTML = str;



// 2d array*******************************************************************************************************************************************************************************************************************************************************
let grid = document.querySelector(".grid");
str = "";
for (let i = 0; i < 100; i++) {
    str += `<div class="row">`
    for (let j = 0; j < 26; j++) {
        str += `<div class='col' rid=${i} cid=${j} contenteditable="true"></div>`
    }
    str += "</div>";
}
grid.innerHTML = str;
//********************************************************************************************************************************************************






//sheet database************************************************************************************************************************************************************************************************************************************************************************************************************************
worksheetDb = [];  //made global 

function initCurrentSheetDb() {  //every time new sheet is created
    let sheetDb = [];
    for (let i = 0; i < 100; i++) {//100 coloumns

        let row = [];  // will store rows of 26 coloumns each
        for (let j = 0; j < 26; j++) {//26 columns
            let cell = {  //object having default properties for each cell
                halign: "left",
                //sets blank values everytime new sheet databse is created
                value: "" ,
                     



            }
            row.push(cell); //push 26 cells in the row
        }
        sheetDb.push(row); // push 100 rows in sheetDb
    }
    worksheetDb.push(sheetDb);
}
initCurrentSheetDb();