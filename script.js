let addbtnContainer = document.querySelector(".add-sheets_container");
let sheetList = document.querySelector(".sheets-list");//parent class element of all the sheets
let firstSheet = document.querySelector(".sheet");
let Allcells = document.querySelectorAll(".grid .col");
let addressBox = document.querySelector(".address-box");
let formulaInput = document.querySelector(".formula-box");
let leftBtn = document.querySelector(".left");
let rightBtn = document.querySelector(".right");
let centerBtn = document.querySelector(".center");
let allAlignBtn = document.querySelectorAll(".alignment-container>*")   // ">*"  selects all 3 child of alignContainer and queryAll get all 3 not just 1 element 
let fontSizeBtn = document.querySelector(".font-size");
let fontFamilyBtn = document.querySelector(".font-family");
let buiContainer = document.querySelector(".BUI_container");
let boldBtn = document.querySelector(".bold");
let italicBtn = document.querySelector(".italic");
let underlineBtn = document.querySelector(".underline");
let colorBtn = document.querySelector('#color');
let bgColorBtn = document.querySelector('#bg-color');
let leftColSpecific = document.querySelectorAll(".left-col .left-col_box");
let gridContainer=document.querySelector(".grid_container");
let topLeftArea = document.querySelector(".top-left-block");
let sheetDb = worksheetDb[0];  // will hold 1st sheet value by default



//HELPER function to get rid and cid using address as parameter ****************************************************************************************
const getRIdCId = (address) => {
    let charPart = address.charCodeAt(0);  //converts alphabet to ascii number
    let numberPart = address.slice(1);
    let cid = charPart - 65;
    let rid = Number(numberPart) - 1;
    return { rid, cid };
}
//********************************************************************************************************************************************************






//SHEET CREATION ***************************************************************************************************************************************

//creates new sheet on clicking plus button
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

    sheetsArr.forEach(function (sheet) {   //remove active sheet clas from all sheets
        sheet.classList.remove("active-sheet");
    })
    sheetsArr = document.querySelectorAll(".sheet"); //after creating sheets.. sheet array length is changed.. henced fetched again
    sheetsArr[sheetsArr.length - 1].classList.add("active-sheet");  //add active sheet class on last sheet

    initCurrentSheetDb();    //initializes new sheetDb to worksheetDb array
    sheetDb = worksheetDb[idx];  // sets sheetDb as the new sheet that is created

    initUi(); ////set deafult values to all the cells in frontend

    Allcells[0].click();  //clicks on A1 after creating new sheet

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

    MySheet.classList.add("active-sheet");
    ///above code shws clicked sheet as active sheet giving grey bg



    //code for fetching data of clicked sheet from databse and setting it on this sheet
    let sheetIdx = MySheet.getAttribute("sheetIdx");//gets index of current sheet
    sheetDb = worksheetDb[sheetIdx - 1]; //point sheetDb to the respective database // used -1 as sheets ui starts from 1 but indexing start from 0

    setUI(sheetDb);  //fetches all cells data from database and sets in the selected  sheet that is passed


    Allcells[0].click();  //clicks on A1 after creating new sheet

}






//adds event listener to every cell ..*******************************************************************************************************************

//clicking on it shows resp. properties in menu bar
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

        //on cliking on a cell.. set the formula on the formula bar ui
        if (cellObject.formula != "") {   //if formula not emty in database
            formulaInput.value = cellObject.formula; //set it on ui
        } else if (cellObject.formula == "") {
            formulaInput.value = cellObject.value; //else set blank on formula bar UI
        }



        for (let i = 0; i < allAlignBtn.length; i++) {
            allAlignBtn[i].classList.remove("active-btn");   // removes active class from b u and i buttons... cauz can select only one button at a time
        }
        // chnage button accoding to value of object for that cell
        if (cellObject.halign == "left") {
            leftBtn.classList.add("active-btn");
        } else if (cellObject.halign == "right") {
            rightBtn.classList.add("active-btn");

        }
        else if (cellObject.halign == "center") {
            centerBtn.classList.add("active-btn");

        }

        //set font size  for that cell
        let fSize = cellObject.fontSize;
        fontSizeBtn.value = fSize;

        //set bold italic underline acc to cell
        (cellObject.bold) ? boldBtn.classList.add("active-btn") : boldBtn.classList.remove("active-btn");

        (cellObject.italic) ? italicBtn.classList.add("active-btn") : italicBtn.classList.remove("active-btn");

        (cellObject.underline) ? underlineBtn.classList.add("active-btn") : underlineBtn.classList.remove("active-btn");

        //set font name in ui acc to cell
        let dbFont = cellObject.fontFamily;
        (dbFont == "Arial") ? fontFamilyBtn.selectedIndex = 0
            : (dbFont == "Cambria") ? fontFamilyBtn.selectedIndex = 1
                : (dbFont == "Georgia") ? fontFamilyBtn.selectedIndex = 2
                    : (dbFont == "monospace") ? fontFamilyBtn.selectedIndex = 3
                        : (dbFont == "sans-serif") ? fontFamilyBtn.selectedIndex = 4
                            : fontFamilyBtn.selectedIndex = 5

    })


    Allcells[i].addEventListener("keydown", function (e) {
        let obj = Allcells[i].getBoundingClientRect();   //this gives a object which have all height width etc properties
        let height = obj.height;
        let { rid } = getRIdCId(addressBox.value);
        let reqLeftCol = leftColSpecific[rid];  //get the specific row of the left coloumn
        reqLeftCol.style.height = height + "px";
    });
}
Allcells[0].click(); // clicks 1st cell by deafult when opening fr first time











//MENU CONTAINER *****************************************************************************************************************************************

//font Family
fontFamilyBtn.addEventListener("change", function (e) {
    let fontOption = fontFamilyBtn.value;
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.fontFamily = fontOption;

    let cellObject = sheetDb[rid][cid];//get cell object from sheetDb
    cellObject.fontFamily = fontOption;    //set left property to sheetDb
})

// left right and center alignment*****************
leftBtn.addEventListener("click", function () {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    cell.style.textAlign = "left";

    for (let i = 0; i < allAlignBtn.length; i++) {
        allAlignBtn[i].classList.remove("active-btn");   // removes active class from b u and i buttons... cauz can select only one button at a time
    }
    leftBtn.classList.add("active-btn"); //add grey background class to left button

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

//font size *****************************************
fontSizeBtn.addEventListener("change", function () {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    let fsize = fontSizeBtn.value;
    cell.style.fontSize = fsize + "px";

    let cellObject = sheetDb[rid][cid];//get sheetDb
    cellObject.fontSize = fsize;    //set left property to sheetDb
})

//bold italic underline*******************************
buiContainer.addEventListener("click", function buiFn(e) {
    let { rid, cid } = getRIdCId(addressBox.value);
    let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
    const cellObject = sheetDb[rid][cid];//get sheetDb

    let command = e.target.getAttribute("value");
    if (command == "B") {
        if (cell.classList.contains("b")) {
            cellObject.bold = false;      //set bold property as false in database
            cell.classList.remove("b");   //removed bold property from cell
            boldBtn.classList.remove("active-btn");  //removed active clas from bold button
        } else {
            cellObject.bold = true;
            cell.classList.add("b");
            boldBtn.classList.add("active-btn");
        }

    } else if (command == "U") {
        if (cell.classList.contains("u")) {
            cellObject.underline = false;
            cell.classList.remove("u");
            underlineBtn.classList.remove("active-btn");
        } else {
            cellObject.underline = true;
            cell.classList.add("u");
            underlineBtn.classList.add("active-btn");
        }
    } else if (command == "I") {
        if (cell.classList.contains("i")) {
            cellObject.italic = false;
            cell.classList.remove("i");
            italicBtn.classList.remove("active-btn");
        } else {
            cellObject.italic = true;
            cell.classList.add("i");
            italicBtn.classList.add("active-btn");
        }
    }
})

//font colour and background colour*******************
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

//********************************************************************************************************************************************************











//`````````````````````````````````````````````````````


//set default values to all the cells using this function 
function initUi() {
    Allcells.forEach(function (eachCell) {
        eachCell.style.textAlign = "left";
        eachCell.innerText = "";
        eachCell.style.fontFamily = "Arial";
        eachCell.style.fontSize = "20px";
        eachCell.classList.remove("b");
        eachCell.classList.remove("i");
        eachCell.classList.remove("u");
    })

}
initUi();//call for 1st time setting of default values;


function setUI(sheetDb) {
    for (let i = 0; i < sheetDb.length; i++) {
        for (let j = 0; j < sheetDb[0].length; j++) {
            let cell = document.querySelector(`.col[rid="${i}"][cid="${j}"]`); //get cell for every index
            let { halign, value, fontFamily, fontSize, bold, italic, underline } = sheetDb[i][j]; //get values from database... DO THIS FOR ALL PROPERTIES OF OBJECT


            //set properties like this for all properties
            cell.style.textAlign = halign;  //sets fetched value in the current sheet
            cell.style.fontSize = fontSize + "px";
            cell.style.fontFamily = fontFamily;
            cell.innerText = value;

            (bold) ? cell.classList.add("b") : cell.classList.remove("b");
            (italic) ? cell.classList.add("i") : cell.classList.remove("i");
            (underline) ? cell.classList.add("u") : cell.classList.remove("u");
        }
    }



    console.log(worksheetDb);
}









//WOORKING WITH FORMULAS************************************************************************************************************************************
//`Syncing all cell's value with database
for (let i = 0; i < Allcells.length; i++) {
    Allcells[i].addEventListener("blur", function handleCell() {
        let { rid, cid } = getRIdCId(addressBox.value);
        let cellObject = sheetDb[rid][cid];     //on clicking on cell ... this gets the respective cell object from database
        let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);   // cell location on frontend

        /////////////////////////////
        //on changing value in the cell manually...  the formula should be removed and cell's address should be remobved from parent's children array

        if (cellObject.value == cell.innerText) {  //do nothing if new value enterd is same as database value
            return;
        }
        if (cellObject.formula) {  //if formula exists in database
            removeAddressFromParents(cellObject, addressBox.value);  //remove the formula and also remove address from parent's children aray
        }
        ///////////////////////////

        cellObject.value = cell.innerText;      //syncs the innertext on frontend and database by setting ui cell value in the database

        //ON EVERY BLUR/CHANGE IN VALUE... EVALUATE FUNCTIONS OF ALL THE CHILDREN AND DO RECURSIVELY FOR THERE CHILDREN
        changeChildren(cellObject);


    });
}


formulaInput.addEventListener("keydown", function (e) {
    if (e.key == "Enter" && formulaInput.value != "") {
        let newFormula = formulaInput.value;
        let { rid, cid } = getRIdCId(addressBox.value);  //get current rid cid from address box

        let cellObj = sheetDb[rid][cid];
        let prevFormula = cellObj.formula;

        if (prevFormula == newFormula) {
            return; // dont run evaluate if new formula entered is same as stored in database
        }
        if (prevFormula != "" && prevFormula != newFormula) {  //if formula in database is not empty and newFormula is different.. then remove the cell's address from the parents and empty the formula in db
            removeAddressFromParents(cellObj, addressBox.value);
        }



        let evaluatedValue = evaluateFormula(newFormula);

        setFormula(evaluatedValue, newFormula, rid, cid, addressBox.value);   // explaination in function comment

    }
})


function evaluateFormula(formula) {
    let formulaTokens = formula.split(" ");

    //formulaTokens looks like [(, A1, +, A2)]
    for (let i = 0; i < formulaTokens.length; i++) {
        let firstCharOfToken = formulaTokens[i].charCodeAt(0); //gets ascii value of 1st character
        if (firstCharOfToken >= 65 && firstCharOfToken <= 90) { //if its A-Z
            let { rid, cid } = getRIdCId(formulaTokens[i]);//get location of A1 and A2 that are parents

            let cellObject = sheetDb[rid][cid];
            //gettign resp value from db
            let { value } = cellObject;
            formula = formula.replace(formulaTokens[i], value);// replace A1 with 00 or A2 with 01 in "formula"

        }
    }

    //infix evaluation recommended (will remove the need of spaces in formula)
    let ans = eval(formula); ////^^&($&^&(^^^%^^^(////////////////////////////////////////////////////%$%$#%&%$@$%&$#&$#&#$#$

    return ans;

}

function setFormula(value, formula, rid, cid, address) {
    //```````````````````````
    //sets value at rid cid on the UI
    document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`).innerText = value;
    //``````````````````````````



    let cellObj = sheetDb[rid][cid];
    cellObj.value = value;   //set value and formula in database
    cellObj.formula = formula;

    //set this cell's ADDRESS in ==> PARENT's chindren array (so when parent changes ..the addresses in children array get evaluated again)
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let firstCharOfToken = formulaTokens[i].charCodeAt(0); //gets ascii value of 1st character
        if (firstCharOfToken >= 65 && firstCharOfToken <= 90) { //if its A-Z
            let parentRidCid = getRIdCId(formulaTokens[i]);//get location of A1 and A2 that are parents
            let parentCellObject = sheetDb[parentRidCid.rid][parentRidCid.cid];   //fetch parent object

            parentCellObject.children.push(address);  //push child address in parent's children array




        }
    }


}

function changeChildren(cellObject) {
    let childrens = cellObject.children;

    childrens.forEach(function (chAddress) {

        let chRICIObj = getRIdCId(chAddress);
        let chObj = sheetDb[chRICIObj.rid][chRICIObj.cid]; //get child object
        let evaluatedValue = evaluateFormula(chObj.formula);  // get the child's formula and evaluates it to get value

        document.querySelector(`.col[rid="${chRICIObj.rid}"][cid="${chRICIObj.cid}"]`).innerText = evaluatedValue;  // sets the new value on the UI
        chObj.value = evaluatedValue;   // sets the new value in database

        changeChildren(chObj);  //recursive call on children of chObject

    })
}

function removeAddressFromParents(cellObj, address) {
    let formula = cellObj.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let firstCharOfToken = formulaTokens[i].charCodeAt(0); //gets ascii value of 1st character
        if (firstCharOfToken >= 65 && firstCharOfToken <= 90) { //if its A-Z
            let parentRIDCIDobj = getRIdCId(formulaTokens[i]);//get parents rid and cid
            let parentObject = sheetDb[parentRIDCIDobj.rid][parentRIDCIDobj.cid];  //get parent object

            let childrens = parentObject.children;
            let idx = childrens.indexOf(address);   //look for the index of address in children array of parent object
            childrens.splice(idx, 1); //remove the address at that index
        }
    }

    cellObj.formula = "";  //reset the formula of cellObj
}




//reaaranging left col, top row and top left block according to sroll******************************************************************************
gridContainer.addEventListener("scroll", function () {
    let top = gridContainer.scrollTop;   //pixels scrolled away from top
    let left = gridContainer.scrollLeft; ////pixels scrolled away from left
    setTimeout(function(){
        topRow.style.top = top + "px";
        leftCol.style.left = left + "px";
        topLeftArea.style.left = left + "px";
        topLeftArea.style.top = top + "px";
    },0)


})