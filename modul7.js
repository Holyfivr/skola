
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Nedan följer funktion som byter tema på sidan från ljus till mörk eller vice versa.
function bytFarg() { //funktionens namn

    let aktuelltTema = document.getElementById("utseende"); //skapar en variabel vid namn aktuelltTema som innehåller värdet av elementet med ID:t "utseende", vilket är länken till CSS filen

    //skapar en try catch som försöker utföra koden nedan
    try {
        if (aktuelltTema.getAttribute("href") === "ljustema.css") { //om "href" attributen i elementet är lika med "ljustema.css" -
            aktuelltTema.setAttribute("href", "morktema.css") // - byter den så att den istället länkar till den andra css-filen med mörkt tema
        }
        else {
            aktuelltTema.setAttribute("href", "ljustema.css") // om href inte är ljustema.css, byter den och gör så att den blir ljustema.css
        }

        let temaForIframe = document.getElementById("mainframe"); // skapar en variabel som innehåller informationen från iframens element
        let temaForIframeInnehall = temaForIframe.contentWindow.document; // skapar en variabel med Iframens html dokument
        let sidansCSS = temaForIframeInnehall.getElementById("cssLankInutiIframeSidan") // skapar en variabel som innehåller link elementet med id:t "cssLankInutiIframeSidan" ur den hämtade sidan

        if (sidansCSS) {
            if (sidansCSS.getAttribute("href") === "ljustema.css") { //om sidans <link> element länkar till ljustema.css
                sidansCSS.setAttribute("href", "morktema.css"); //byter den till morktema.css
            }
            else {
                sidansCSS.setAttribute("href", "ljustema.css"); //annars byter den till ljustema.css
            }
        }
    }
    catch (error) {
        console.error("Någonting gick fel vid försöket att ändra tema.") //skickar felmeddelande i konsolen om något inte fungerar
    }


    if (aktuelltTema.getAttribute("href") === "ljustema.css") { // Om den aktuella css-filen som används på sidan (efter att funktionen ovanför löpts igenom) är "ljustema.css"
        document.getElementById("temaknapp").innerHTML = "Ändra till mörkt tema"; //byter knappen text till ändra till mörkt tema
    }
    else {
        document.getElementById("temaknapp").innerHTML = "Ändra till ljust tema"; //annars byter knappen text till ändra till ljust tema
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* 
Nedan är en funktion som används i de fönster som öppnas i iframen. 
Den kollar vilken css-fil som index-sidan använder sig av, och matchar den, så att de har samma tema. 
Den kallas i <body onload="temaKoll()"> på undersidorna.
*/
function temaKoll() {
    if (window.parent) { //kollar efter om det finns en "parent"
        let indexCSS = window.parent.document.getElementById("utseende"); //skapar en variabel med värdet av index-sidans CSS länk
        let aktuellCSS = document.getElementById("cssLankInutiIframeSidan"); //skapar en variabel med värdet av aktuella sidans CSS länk
        //nedan följer en try catch för att försöka synka css filerna
        try {
            let synkaCSS = indexCSS.getAttribute("href"); //skapar en variabel med href värdet av index-sidans CSS länk
            aktuellCSS.setAttribute("href", synkaCSS); //gör så att aktuella sidan har samma värde
        }
        //om någonting går fel får vi ett error meddelande i consolen
        catch (error) {
            console.error("Något gick fel vid synkning av CSS.")
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Nedanför finns funktioner för alla meddelanden som visas på den praktiska uppgiften.
//de är alla ganska självförklarande så jag kommenterar ingenting mer på koden nedanför.

function visaPopUp() {
    alert("Här är ett popup meddelande.");
}
function visaMeddelande() {
    document.getElementById("rutaformeddelande").style.display = "initial";
    document.getElementById("rutaformeddelande").innerHTML = `

        <div style="color: rgb(32, 32, 32);background-color:white; width:fit-content; margin:auto;margin-top:50px; border:1px solid black;">
        <center>
            Här är ett meddelande i ett div element.<br>
            <button onclick="doljMeddelande()">Dölj meddelandet igen.</button>
        </center>
        </div>
        `;
}

function doljMeddelande() {
    document.getElementById("rutaformeddelande").style.display = "none";
}

function musOverMeddelande() {
    document.getElementById("flytandemeddelande").style.visibility = "visible";
}

function musExitMeddelande() {
    document.getElementById("flytandemeddelande").style.visibility = "hidden";
}

function klickadePaKnappen() {
    document.getElementById("rutaformeddelande").style.display = "initial";
    document.getElementById("rutaformeddelande").innerHTML = `

        <div style="color: rgb(32, 32, 32);background-color:white; width:fit-content; margin:auto;margin-top:50px; border:1px solid black;">
        <center>
            Du kan klicka på den också om du har lust, men den gör samma sak som div-knappen :)<br>
            <button onclick="doljMeddelande()">Dölj meddelandet igen.</button>
        </center>
        </div>
        `;

}