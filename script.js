let addbtnContainer = document.querySelector(".add-sheets_container");
let sheetList = document.querySelector(".sheets-list");//parent class element of all the sheets
let firstSheet = document.querySelector(".sheet");
let Allcells = document.querySelectorAll(".grid .col");
let addressBox = document.querySelector(".address-box");
let formulaInput=document.querySelector(".formula-box");
let leftBtn = document.querySelector(".left");
let rightBtn = document.querySelector(".right");
let centerBtn = document.querySelector(".center");
let allAlignBtn = document.querySelectorAll(".alignment-container>*")   // ">*"  selects all 3 child of alignContainer and queryAll get all 3 not just 1 element 
let fontSizeBtn = document.querySelector(".font-size");
let buiContainer = document.querySelector(".BUI_container");
let colorBtn = document.querySelector('#color');
let bgColorBtn = document.querySelector('#bg-color');
let sheetDb = worksheetDb[0];  // will hold 1st sheet value by default



//function to get rid and cid using address as parameter **********************************************************************************************************************************************************************************************
const getRIdCId = (address) => {
    let charPart = address.charCodeAt(0);  //converts alphabet to ascii number
    let numberPart = address.slice(1);
    let cid = charPart - 65;
    let rid = Number(numberPart) - 1;
    return { rid, cid };
}


//creates new sheet on clicking plus button****************************************************************************************************************************************************************************************************
addbtnContainer.addEventListener("click", function () {
    let sheetsArr = document.querySelectorAll(".sheet");
    let lastSheetElem = sheetsArr[sheetsArr.length - 1];
    let idx = lastSheetElem.getAttribute("sheetIdx");
    idx = Number(idx);

    let NewSheet = document.createElement("div");
    NewSheet.setAttribute("class", "sheet");
    NewSheet.setAttribute("sheetIdx", idx + 1);
    NewSheet.innerText = `Sheet ${idx + 1}`;

    sheetList.appendChild(NewSheet);

    sheetsArr.forEach(function (sheet) {
        sheet.classList.remove("active-sheet");
    })
    sheetsArr = document.querySelectorAll(".sheet"); //after creating sheets.. sheet array length is changed.. henced fetched again
    sheetsArr[sheetsArr.length - 1].classList.add("active-sheet");

    initCurrentSheetDb();    //initializes new sheetDb to worksheetDb array
    sheetDb = worksheetDb[idx];  // sets sheetDb as the new sheet that is created

    //````````````````````^@##$@#^#$&%^%*&```````````` line below can be removed.. try
    initUi(); ////set deafult values to all the cells in frontend



    //event listener of clicking on the sheet
    NewSheet.addEventListener("click", handleActiveSheet);

});//it also has handle active sheet inside

firstSheet.addEventListener("click", handleActiveSheet);
//gives grey colour to active sheet 
function handleActiveSheet(e) {
    let MySheet = e.currentTarget;
    let sheetsArr = document.querySelectorAll(".sheet");
    sheetsArr.forEach((sheet) => {
        sheet.classList.remove("active-sheet");
    })
    if (!MySheet.classList[1]) {
        MySheet.classList.add("active-sheet")
    }
    ///above code shws clicked sheet as active sheet



    //code for fetching data of clicked sheet from databse and setting it on this sheet
    let sheetIdx = MySheet.getAttribute("sheetIdx");//gets index of current sheet
    sheetDb = worksheetDb[sheetIdx - 1]; //point sheetDb to the respective database // used +1 as sheets ui starts from 1 but indexing start from 0

    setUI(sheetDb);  //fetches all cells data from database and sets in the selected  sheet that is passed




}



//adds event listener to every cell ..clicking on it shows address in address box********************************************************************************************************************************************************************************
for (let i = 0; i < Allcells.length; i++) {
    Allcells[i].addEventListener("click", function () {
        // Allcells[i].
        let rid = Number(Allcells[i].getAttribute("rid"));
        let cid = Number(Allcells[i].getAttribute("cid"));
        let rowAdd = rid + 1;
        let colAdd = String.fromCharCode(cid + 65);

        let address = colAdd + rowAdd;   // puts selected row address in adress box
        addressBox.value = address;


        let cellObject = sheetDb[rid][cid];   //get object from sheetDb for rid and cid

        for (let i = 0; i < allAlignBtn.length; i++) {
            allAlignBtn[i].classList.remove("active-btn");   // removes active class from b u and i buttons... cauz can select only one button at a time
        }

        if (cellObject.halign == "left") {       // chnage button accoding to value of object for that cell
            leftBtn.classList.add("active-btn");
        } else if (cellObject.halign == "right") {
            rightBtn.classList.add("active-btn");

        }
        else if (cellObject.halign == "center") {
            centerBtn.classList.add("active-btn");

        }



    })
}
Allcells[0].click(); // clicks 1st cell by deafult when opening fr first time


// left right and center alignment*****************************************************************************************************************
leftBtn.addEventListener("click", function () {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "left";

    for (let i = 0; i < allAlignBtn.length; i++) {
        allAlignBtn[i].classList.remove("active-btn");   // removes active class from b u and i buttons... cauz can select only one button at a time
    }
    leftBtn.classList.add("acive-btn"); //add grey background class to left button

    let cellObject = sheetDb[rid][cid];//get sheetDb
    cellObject.halign = "left";    //set left property to sheetDb


})
rightBtn.addEventListener("click", function () {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "right";

    for (let i = 0; i < allAlignBtn.length; i++) {
        allAlignBtn[i].classList.remove("active-btn");   // removes active class from b u and i buttons... cauz can select only one button at a time
    }
    rightBtn.classList.add("active-btn");
    let cellObject = sheetDb[rid][cid];//get sheetDb
    cellObject.halign = "right";

})
centerBtn.addEventListener("click", function () {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "center";

    for (let i = 0; i < allAlignBtn.length; i++) {
        allAlignBtn[i].classList.remove("active-btn");   // removes active class from b u and i buttons... cauz can select only one button at a time
    }
    centerBtn.classList.add("active-btn");
    const cellObject = sheetDb[rid][cid];//get sheetDb
    cellObject.halign = "center";

})


//font size *****************************************************************************************************************************************************
fontSizeBtn.addEventListener("change", function () {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let fsize = fontSizeBtn.value;
    cell.style.fontSize = fsize + "px";
})

//bold italic underline******************************************************************************************************************************************
buiContainer.addEventListener("click", function buiFn(e) {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);

    let command = e.target.getAttribute("value");
    if (command == "B") {
        if (cell.classList.contains("b")) {
            cell.classList.remove("b");
        } else {
            cell.classList.add("b");
        }

    } else if (command == "U") {
        if (cell.classList.contains("u")) {
            cell.classList.remove("u");
        } else {
            cell.classList.add("u");
        }
    } else if (command == "I") {
        if (cell.classList.contains("i")) {
            cell.classList.remove("i");
        } else {
            cell.classList.add("i");
        }
    }
})

//font colour and background colour*******************************************************************************************************************************
colorBtn.addEventListener("input", function changeColorFn(e) {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let selectedColor = e.target.value;
    cell.style.color = selectedColor;
})
bgColorBtn.addEventListener("input", function changeColorFn(e) {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let selectedColor = e.target.value;
    cell.style.backgroundColor = selectedColor;
})


//`Syncing all cell's value with database
for (let i = 0; i < Allcells.length; i++) {
    Allcells[i].addEventListener("blur", function handleCell() {
        let { rid, cid } = getRIdCId(addressBox.value);
        let cellObject = sheetDb[rid][cid];     //on clicking on cell ... this gets the respective cell object from database
        let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);   // cell location on frontend
        cellObject.value = cell.innerText;      //syncs the innertext on frontend and database
    });
}
//`````````````````````````````````````````````````````


//set default values to all the cells using this function 
function initUi() {
    Allcells.forEach(function (eachCell) {
        eachCell.style.textAlign = "left";
        eachCell.innerText = "";
    })
}

function setUI(sheetDb) {
    for (let i = 0; i < sheetDb.length; i++) {
        for (let j = 0; j < sheetDb[0].length; j++) {
            let cell = document.querySelector(`.col[rid="${i}"][cid="${j}"]`); //get cell for every index
            let { halign, value } = sheetDb[i][j]; //get values from database


            cell.style.textAlign = halign;  //sets fetched value in the current sheet
            cell.innerText = value;
        }
    }
    console.log(worksheetDb);
}

formulaInput.addEventListener("keydown",function(e){
    if(e.key=="Enter" && formulaInput.value!=""){
        let formula=formulaInput.value;
        let evaluatedValue=evaluateFormula(formula);


        let { rid, cid } = getRIdCId(addressBox.value);  //get current rid cid from address box
        setUIByFormula(evaluatedValue,rid,cid);  //set calculated value at rid cid
    }
})



function evaluateFormula(formula){

    let formulaTokens=formula.split(" ");

    //formulaTokens looks like [(, A1, +, A2)]
    for(let i=0;i<formulaTokens.length;i++){
        let firstCharOfToken=formulaTokens[i].charCodeAt(0); //gets ascii value of 1st character
        if(firstCharOfToken>=65 && firstCharOfToken<=90){ //if its A-Z
            let {rid,cid}=getRIdCId(formulaTokens[i]);//get location of A1 or..

            let cellObject=sheetDb[rid][cid];
            //gettign resp value from db
            let {value}=cellObject;
            formula=formula.replace(formulaTokens[i],value);// replace A1 with 00 or A2 with 01 in "formula"

        }
    }

    //infix evaluation recommended
    let ans=eval(formula);
    return ans;

}

function setUIByFormula(value,rid,cid){ //add value at given rid,cid
    document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`).innerText=value;

}