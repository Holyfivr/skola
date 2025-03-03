/*  Den här filen innehåller många olika funktioner. Jag övervägde att ha dem uppdelade i olika filer, 
    men beslutade mig för att försöka samla så många funktioner jag kunde i samma fil.
    Fördelar med detta är att jag inte behöver hålla koll på vilka sidor som hämtar vilka filer, 
    utan när jag behöver ändra en funktion finns den i denna fil. Nackdelen är att ibland kan det kännas enklare
    att ha en tydlig fil med namn som t.ex "skrollfunktion.js" och ha dem uppdelade. Men eftersom det är flera sidor
    som använder några av dessa funktionerna så tyckte jag det var lämpligt att samla dem så de kan länka till samma 
    fil istället för att ha typ 10 filer. Det är dessutom smidigare att kunna göra alla funktioner globala i samma fil
    så att de kan kommunicera med varandra direkt här i denna filen.
    
    Jag har använt mig av att skapa många funktioner som är omvandlade till asynkron kod, eftersom jag läst om att det är bättre när man jobbar med kod mot databaser.
    
    En notering. Jag kan ha överdrivit med kommentarerna i den här filen, och jag hoppas inte det är för mycket.
    Detta är inte bara för att enkelt förtydliga funktionerna för den som läser filen, men även för mig själv.
    Mycket av koden som jag använder är saker som jag aldrig använt tidigare (såklart) och när jag har skrivit kod
    har det varit viktigt för mig att enkelt hitta de olika "kod-bitarna" som gör vad. Det här har blivit en vana för mig
    efter att ha läst Java och Python, och jag tycker att jag lär mig bättre på detta sättet. 

    Det har varit mycket googlande för att hitta rätt metoder. Det svåraste för mig var att lista ut exakt hur man 
    pushar och connectar till firebase. Jag kände vid flertal tillfällen att jag tagit mig vatten över huvudet med det
    här projektet, men tyckte att det var kul att skapa en fullt funktionerande sida som faktiskt kan skapa och spara inlägg.

    För att man faktiskt skulle kunna ladda upp den här bloggen någonstans, så skulle det ju så klart krävas inloggning,
    men att fixa krypteringar är någonting som jag verkligen inte tror att jag skulle kunna lista ut på så här kort tid.
    */



/*  Importerar firebase konfigurationen från firebase.js för att göra det möjligt att ansluta 
    och få tillgång till databasen där inlägg sparas i form av JSON objekt */
import { bloggSokvag, databas } from "./fireBase.js";
import { push, get, remove, ref } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";


/* ############################################################################################################################################################# */

/* Funktion som hämtar datan från firebase och formaterar den så att de importeras som blogginlägg */

async function hamtaBloggInlagg() {

    /*Detta blocket hämtar information från firebase-databasen, 
    sparar information om alla objekt, och gör om dem till en array.
    Jag vänder även på ordningen för att de ska sorteras efter nyast inlägg längst upp på sidan. */
    let databas                     = await get(bloggSokvag);
    let dataVarden                  = databas.val();
    let objektLista                 = Object.values(dataVarden).reverse();   
    let existerandeElement          = document.getElementById("bloggInlagg"); // Platsen som blogginlägget ska placeras
    existerandeElement.innerHTML    = ""; // Rensar existerande inlägg
        
    // try-catch sats som försöker utföra själva funktionen som formaterar och visar inläggen på sidan
    try { 

        
        /*  for loop som kör x antal varv, beroende på hur många objekt som finns i databasen.
            Loopen inkrementerar inlaggsnummer varje varv, och jag använder detta för 
            att kunna ge varje inlägg ett unikt id när det laddas. Anledningen till 
            att detta behövs är för att man ska kunna interagera med ett ID i taget utan 
            att de andra ska påverkas. Dragspelsfunktionen, t.ex, hade inte fungerat som 
            den ska om inte varje knapp refererade till ett unikt id. */
        for (let inlaggsNummer = 0; inlaggsNummer < objektLista.length; inlaggsNummer++){
                     
        /*  let objekt får inför varje varv i loopen ett nytt värde. 
            Eftersom objektLista är en array, kan jag, tillsammans med
            inlaggningsnummer ge varje varv av loopen unika id:n.
            första varvet kommer objekt innehålla värdet av det första objektet i databasen,
            andra varvet kommer objekt innehålla värdet av det andra objektet, osv. */    
            let objekt = objektLista[inlaggsNummer];

            /* klipper av det aktuella objektets titel om det är längre än 45 tecken. */
            let trimmadTitel = objekt.title.slice(0, 55);
            if (trimmadTitel.length > 54) { trimmadTitel = trimmadTitel + "..."; };

            /* ändrar formatet på datum till yyyy/mm/dd istället för yyyy-mm-dd*/
            let omformateratDatum = objekt.date.replace(/-/g, "/");

            /* Skapar ett nytt div-element som jag sedan ska placera kod i */
            let nyttDivInlagg = document.createElement("div");

            /*  Formaterad html text för hur jag vill att själva inlägget ska se ut. 
                Här använder jag "inlaggsnummer" efter varje id i formateringen, och eftersom
                den inkrementeras varje varv så får varje element ett unikt id. */
            nyttDivInlagg.innerHTML = `
                <div style="width:40%; height: fit-content; margin: auto; margin-top: 3%;overflow: hidden;">                    
                    <div class="posttitel">   
                    <div class="datumheader">${omformateratDatum}</div>
                        <div class="titelheader" id="titelheader${inlaggsNummer}">${trimmadTitel}</div>                    
                        <div class="stangningsdiv" id="stangningsdiv${inlaggsNummer}">
                            <div>
                                <button id="stangningsknapp${inlaggsNummer}" onclick="stangPostExtra(event)">▲</button>
                            </div>                    
                        </div>
                    </div>
                    <div class="cover" id="cover${inlaggsNummer}"></div>
                    <div class="dragspel" id="dragspel${inlaggsNummer}">
                        <div class="doldtitel" id="doldtitel${inlaggsNummer}">${objekt.title}</div>
                        <div><button class="oppnahelskarm" id="oppnahelskarm${inlaggsNummer}" onclick="klick(${inlaggsNummer})">Enlarge</button></div>                        
                        <p style="padding:5px 20px 5px 20px;">${objekt.text}</p>
                    </div>                
                    <button class="oppnarknapp" id="oppnarknapp${inlaggsNummer}" onclick="oppnaPost(event)">
                    <div class="oppnare" id="oppnare${inlaggsNummer}">▼</div>
                    </button>
                </div>   
            `;
            existerandeElement.appendChild(nyttDivInlagg); // Lägger till inlägget på sidan
        }
    } catch (error) { console.error("Något gick fel vid hämtning av inlägg:", error); }
}

/*Denna biten gör att hamtablogginlagg startas så fort sidor med ett element med id "blogginlagg" laddas.
Detta gör att jag kan ha många funktioner i samma javascript fil som aktiveras on load, 
men inte på alla sidor som är länkade till javascript filen. Tidigare hade jag en if-sats 
som kollade om dessa förhållande möttes inne i funktionen och avbröt funktionen om de inte möttes.
Detta segade upp sidan eftersom varenda html dokument startade funktionen.*/
if (document.getElementById("bloggInlagg")){
    hamtaBloggInlagg();
};

/* Funktion för att ta bort inlägg. Först hämtar jag värde i parametern med det specifika id:nummer som klickats på i hamtablogginlagg funktionen.
    sedan hämtar jag databasen, reversar den, och hittar id:t som ligger på positionen som jag vill ta bort. 
    Sedan använder jag remove funktionen från firebase för att ta bort det hämtade id:t*/
async function taBortInlagg(inlaggId) {
    try {
        // hämtar JSONdatabasen från firebase
        let jsonDatabas = await get(bloggSokvag);
        let dataVarden = jsonDatabas.val();

        //  parar alla ID:n i "nycklar" (reversade för att få rätt värden matchande anropet)
        let nycklar = Object.keys(dataVarden).reverse(); // ID:n
        let fireBaseId = nycklar[inlaggId]; // Hämta rätt objekt-id från JSON databasen baserat på det mottagna värdet i funktionens "parameter"
        
        await remove(ref(databas, `projekt/blogPosts/${fireBaseId}`)); //försöker ta bort inlägget
        
        console.log(`Inlägget har tagits bort.`);
         //uppdaterar sidan och scrollmenyn efter att inlägg tagits bort.

    parent.document.getElementById("menyIFrame").contentWindow.location.reload();
    parent.document.getElementById("mainframe").contentWindow.location.reload();

    } catch (error) {
        console.error("Något gick fel, kunde inte ta bort inlägget:", error);
    }
}

/*  Här är en funktion till sidan som man kan ta bort inlägg ifrån. Grundstrukturen här är i princip samma som med den första funktionen.
    Jag hämtar alla JSON objekt och hanterar dem på det sätt jag vill att de ska visas. */
async function taBortMangaInlagg() {
    let databas                     = await get(bloggSokvag);
    let dataVarden                  = databas.val();
    let objektLista                 = Object.values(dataVarden).reverse();   
    let iDLista                     = Object.keys(dataVarden).reverse(); 
    let existerandeElement          = document.getElementById("deleteListan");
    existerandeElement.innerHTML    = "";
    let omsortering                 = objektLista.length + 1; 
    /* skapar en variabel som innehåller längden av objektlistan (+1 eftersom javascript börjar på index 0). Jag sänker värdet med den med 1 i varje varv av loopen, och 
    placerar på detta sätt ut nummer bredvid inläggen där senaste meddelandet har högst nummer. */
 
   try { 
        for (let inlaggsNummer = 0; inlaggsNummer < objektLista.length; inlaggsNummer++){
                let objekt = objektLista[inlaggsNummer];
                let nyttDivInlagg = document.createElement("div");
                omsortering--
     
                nyttDivInlagg.innerHTML = `
                        <div class="bortTagningsTabell">
                            <div class="deletekol2">${omsortering}</div>
                            <div class="deletekol1">${objekt.title}</div>
                            <div class="deletekol3">${iDLista[inlaggsNummer]}</div>
                            <div class="deletekol4">${objekt.date}</div>
                            <div class="deletekol5"><button onclick="taBortInlagg(${inlaggsNummer})">Delete</a></div>
                        </div>   
                    `
                    ;
                existerandeElement.appendChild(nyttDivInlagg); 
                }   
        }
        catch (error) {
            console.error("Något gick fel vid hämtning av listan", error); 
        }
}
if (document.getElementById("deleteListan")){
    taBortMangaInlagg()
}


/*  Den här funktionen gör att man kan förstora ett inlägg så att det täcker upp en större yta av skärmen,
    och tar tillfälligt bort de andra meddelandena. Den använder liknande metoder som den första funktionen.
    Den hämtar dock ett värden ur funktionerna hamtaBloggInlagg() och hamtaInlaggTillScrollMeny() som innehåller
    en knapp som skickar in numeriska värden i parametern "oppnahelskarm".
    Med detta importerade värde kan jag ge funktionen det anropade inläggets id, och "förstora" det.*/

async function klick(oppnaHelskarm) {

    let databas           = await get(bloggSokvag);
    let dataVarden        = databas.val();
    let objektLista       = Object.values(dataVarden).reverse();
    let inlagg            = objektLista[oppnaHelskarm];
    
/*  
    Den här funktionen anropas från flera olika sidor, så här behövs en if-sats eftersom elementet 
    "bloggInlagg" inte alltid kommer gå att hitta på samma sätt, eller alls, beroende på var anropet kommer ifrån.
    - Först skapar vi en variabel som antar att "bloggInlagg" existerar i samma dokument som anropet kom ifrån.  
    - Om elementet inte hittas returneras värdet "null". I detta fall betyder det att funktionen anropades från en iframe eller sida som 
    inte har direkt tillgång till elementet. Då "hoppar vi upp" ur iframen och letar i "mainframe" via parent.frames["mainframe"]. 
    - Om "bloggInlagg" fortfarande inte hittas, testar vi istället "stortInlaggPaInputSidan", som används i input.html.
    - Om inlägget fortfarande inte hittas, får vi till sist ett felmeddelande i konsollen och funktionen avslutas.
    Den här satsen kan enkelt utökas om fler sidor behöver kunna ta emot inlägg. 
*/
    
    let stortInlagg = document.getElementById("bloggInlagg");
    if (stortInlagg === null) {
        stortInlagg = parent.frames["mainframe"].document.getElementById("bloggInlagg");
        if (stortInlagg === null){
            stortInlagg = parent.frames["mainframe"].document.getElementById("stortInlaggPaInputSidan");
            if (stortInlagg === null) {
                console.error("Kunde inte hitta något element att pl acera inlägget i");
                return;
            }
        }
    } 
    let omformateratDatum = inlagg.date.replace(/-/g, "/");
    
    stortInlagg.innerHTML = `
            <div style="width:100%; height: fit-content; margin: auto; margin-top:25px;overflow: hidden;">
                <div class="posttitelsolo"> 
                    <div class="datumheader" style="width:190px;">
                        <button class="returnknapp" id="returnknapp" onclick="location.reload()"> ◄ Back</button>
                    </div>
                    <div class="titelheadersolo">${inlagg.title}</div> 
                    <div class="datumheader" style="width:120px !important;"><p><i>${omformateratDatum}</i></p></div>                        
                </div>                        
            </div>
            <div class="textinnehall" style="padding-left: 50px;">
                <p>${inlagg.text}</p>
            </div>
        `;
}

/* ############################################################################################################################################################# */

    /*  Den här funktionen hämtar informationen ur databasen på samma sätt som ovanstående funktioner, 
    och formaterar informationen på ett sådant sätt att den passar bra i scrollmenyn. */

    async function hamtaInlaggTillScrollMeny() {

        let divScrollRuta     = document.getElementById("scrollruta");
        let databas           = await get(bloggSokvag);
        let dataVarden        = databas.val();
        let objektLista       = Object.values(dataVarden).reverse();
        
        

        try {
            for (let inlaggsNummer = 0; inlaggsNummer < objektLista.length; inlaggsNummer++){
    
                let inlagg                  = objektLista[inlaggsNummer];                
                let nyttScrollElement       = document.createElement("div");
                let trimmatDatum            = inlagg.date.slice(5, 10);
                trimmatDatum = trimmatDatum.replace("-", "/");
                let trimmadTitel            = inlagg.title.slice(0, 20)
                if (trimmadTitel.length >  19) { trimmadTitel = trimmadTitel + "..."; };

                nyttScrollElement.innerHTML = `
                    <div class="posttitelscroller"> 
                        <div class="titelheaderscroller">
                            <a href="#" id="x" onclick="klick(${inlaggsNummer}), StangMeny(event); return false">${trimmadTitel}</a>
                        </div>       
                        <div class="datumheaderscroller">${trimmatDatum}</div>
                    </div>
                `;
                divScrollRuta.appendChild(nyttScrollElement);          
            } 
        } 
        catch(error) {
            console.log(error);
        };
    };
    /* startar endast funktionen i det dokument som innehåller id:t "scrollruta" */
    if (document.getElementById("scrollruta")) {
        hamtaInlaggTillScrollMeny();
    };

//Funktion som skapar nytt inlagg genom att hämta informationen från formulären och skicka den som data till firebase där den sparas i JSON format.
async function skapaInlagg() {

    let nyttInlagg = document.getElementById("nyttinlagg").value; // Hämtar information från textfältet med ID "nyttinlagg"
    let titel      = document.getElementById("titel").value;      // Hämtar från textfältet med ID "titel"

    /*  
    if-sats som förhindrar att man skickar tomma inlägg. nyttinlagg.trim() tar informationen från nyttinlagg, 
    tar bort eventuella mellanslag på slutet. Om fältet är tomt får man felmeddelande och funktionen avbryts*/
    if (nyttInlagg.trim() === "" | titel.trim() === "") {
        alert("You need a title and a text to post.");
        return;
    }
    if (titel.length > 55){
        alert("That title is way too long. Try something shorter.");
        return;
    }

    //Skapar variabel som innehåller inläggets värde och gör att radbrytningar formateras korrekt, så inlägg inte bara är en enda stor lång löpande text.
    let formateradText = nyttInlagg.replace(/\n/g, "<br>");

    //Skapar objektet som ska sparas i databasen, formaterat efter den struktur jag vill att den ska laddas upp i
    let inlaggData = {
        date: new Date().toLocaleDateString(),
        text: formateradText,
        title: titel
    };

    //Try/Catch-sats som försöker pusha objektet till databasen.
    try {
        /*  
        Await säkerställer att vi får ett svar från servern innan funktionen fortsätter. 
        Om pushen får rejection avbryts funktionen.*/
        await push(bloggSokvag, inlaggData);

        //Tömmer inmatningsfälten efter att inlägget laddats upp
        document.getElementById("titel").value      = "";
        document.getElementById("nyttinlagg").value = "";
    }
    catch (error) { alert("Couldn't create the post. Try again later."); return; };

    //laddar om iframen med scrollmenyn för att lägga till nyaste meddelandet.
    parent.frames["menyframe"].location.reload();

    //efter att meddelande skapats ändras utseendet på sidan och man kan välja att posta mer, eller gå tillbaks till start
    document.getElementById("stortInlaggPaInputSidan").innerHTML = `    
        <div class="nyttInlaggRam">
            <br><h2 class="h2">Your post has been saved!</h2><br>                
            <div class="textDivForInlagg"><h4><a class="savedInputLank" href="#" onclick="location.reload(); return false">Add more entries</a></h4></div>                
            <div class="textDivForInlagg"><h4><a class="savedInputLank" href="./main.html">Go to startpage</h4></a></div>               
        </div>
    `; 
};

/*  
Funktioner som gör att scrollmenyn går att expandera till en dropdown-meny. 
Inget avancerat att kommentera på här egentligen. Bara massa funktioner som ändrar
stil på existerande iframe, knapp, och div element. */

function dropDownMeny() {
    let skifta                               = document.getElementById("menyIFrame").contentWindow.document;
    let menyRam                              = document.getElementById("menyRam");
    let menyIFrame                           = document.getElementById("menyIFrame");
    let dropdownKnapp                        = document.getElementById("dropDownButton");
    menyIFrame.style.boxShadow               = "0px 7px 10px black";
    menyIFrame.style.maxHeight               = "350px";
    menyIFrame.style.minHeight               = "350px";
    menyIFrame.style.borderRadius            = "20px 0px 20px 20px";
    menyRam.style.overflow                   = "visible";
    menyRam.style.maxHeight                  = "403px";
    dropdownKnapp.innerHTML                  = "▲";
    dropdownKnapp.style.textShadow           = "0px -3px 2px white";
    skifta.body.style.backgroundSize         = "100% 100%";

    dropdownKnapp.setAttribute("onclick", "StangMeny(event)");
}
function StangMeny(event) {
    let skifta = "";
    let dropdownKnapp = "";
    let menyIFrame = "";

    //If-sats som kollar om funktionen kallas från scroller.html eller från knappen bredvid scrollmenyn, och justerar värden därefter.
    if (event.target.id === "x"){
        console.log("asd")
        skifta                                                      = parent.document.getElementById("menyIFrame").contentWindow.document;
        dropdownKnapp                                               = parent.document.getElementById("dropDownButton");
        menyIFrame                                                  = parent.document.getElementById("menyIFrame");
        parent.document.getElementById("menyRam").style.maxHeight   = "37px";
        parent.document.getElementById("menyRam").style.minHeight   = "37px";
    }
    else {
        skifta                                                      = document.getElementById("menyIFrame").contentWindow.document;
        dropdownKnapp                                               = document.getElementById("dropDownButton");
        menyIFrame                                                  = document.getElementById("menyIFrame");
        document.getElementById("menyRam").style.maxHeight          = "37px";
        document.getElementById("menyRam").style.minHeight          = "37px";
    };

    menyIFrame.style.boxShadow                                      = "none";
    menyIFrame.style.borderRadius                                   = "20px 0px 0px 20px";
    skifta.body.style.backgroundSize                                = "100% 40px";
    dropdownKnapp.style.textShadow                                  = "0px 3px 2px white";
    menyIFrame.style.maxHeight                                      = "37px";
    menyIFrame.style.minHeight                                      = "37px";
    dropdownKnapp.innerHTML                                         = "▼";
    
    dropdownKnapp.setAttribute("onclick", "dropDownMeny()");
};


/* 
Nedanför följer funktioner som öppnar och stänger blogginlägg.
Eftersom jag inkrementerar id:t på samtliga element i "hamtaBloggInlagg()" för varje objekt som hämtas ur JSON-datan
behöver jag också fixa så att den här funktionen fungerar på samtliga element. Därför har jag designat den
så att den dynamiskt hämtar id:t av varje element som klickas (med hjälp av event.target.id och closest.button).
Jag kommenterar inte så mycket på koden här. Det syns tydligt vad som händer. knappar klickas och utseende på olika element ändras när de klickas. :)
Jag hoppas inte det är för rörigt. Jag har försökt göra det så organiserat jag kunde.
*/

function oppnaPost(event) {
    let dragSpelsKnapp               = event.target.closest("button");
    let klickadKnapp                 = dragSpelsKnapp.id;                           //väljer den specifika knappens id som klickades
    let klickatNummer                = klickadKnapp.replace("oppnarknapp", "");         //Skapar en variabel som bara innehåller det värde i ID:t som ligger efter "oppnarknapp"
    let oppnare                      = document.getElementById(`oppnare${klickatNummer}`);  //öppnare med rätt ID
    let helskarm                     = document.getElementById(`oppnahelskarm${klickatNummer}`) //"helskärmsinlägg" med rätt ID
    let dragspel                     = document.getElementById(`dragspel${klickatNummer}`);         //dragspel med rätt ID
    let visaTitel                    = document.getElementById(`doldtitel${klickatNummer}`);            //etc..
    let doljTitel                    = document.getElementById(`titelheader${klickatNummer}`)
    let stangningsknapp              = document.getElementById(`stangningsdiv${klickatNummer}`); 
    helskarm.style.display           = "block";
    oppnare.innerHTML                = "▲";
    dragspel.style.maxHeight         = "4000px";
    dragspel.style.minHeight         = "200px";
    dragspel.style.boxShadow         = "none";
    helskarm.style.visibility        ="visible";
    helskarm.style.opacity           = "1";
    visaTitel.style.visibility       = "visible";
    visaTitel.style.opacity          = "1";
    visaTitel.style.display          = "block";
    doljTitel.style.visibility       = "invisible";
    doljTitel.style.opacity          = "0";
    stangningsknapp.style.visibility = "visible";
    stangningsknapp.style.opacity    = "1";
    stangningsknapp.style.display    = "block";

    dragSpelsKnapp.setAttribute("onclick", `stangPost(event)`);
}
function stangPost(event) {
    let dragSpelsKnapp               = event.target.closest("button");
    let klickadKnapp                 = dragSpelsKnapp.id;
    let klickatNummer                = klickadKnapp.replace("oppnarknapp", "");
    let oppnare                      = document.getElementById(`oppnare${klickatNummer}`);
    let helskarm                     = document.getElementById(`oppnahelskarm${klickatNummer}`)
    let dragspel                     = document.getElementById(`dragspel${klickatNummer}`);
    let visaTitel                    = document.getElementById(`doldtitel${klickatNummer}`);
    let doljTitel                    = document.getElementById(`titelheader${klickatNummer}`)
    let stangningsknapp              = document.getElementById(`stangningsdiv${klickatNummer}`);
    oppnare.innerHTML                = "▼";
    dragspel.style.maxHeight         = "125px";
    dragspel.style.minHeight         = "125px";
    dragspel.style.boxShadow         = "0px -50px 30px -15px inset var(--a)";
    helskarm.style.visibility        = "invisible";
    helskarm.style.opacity           = "0";
    visaTitel.style.visibility       = "invisible";
    visaTitel.style.opacity          = "0";
    doljTitel.style.visibility       = "visible";
    doljTitel.style.opacity          = "1";
    stangningsknapp.style.visibility = "invisible";
    stangningsknapp.style.opacity    = "0";

    dragSpelsKnapp.setAttribute("onclick", `oppnaPost(event)`);
}
function stangPostExtra(event) {
    let klickadKnapp                 = event.target.id;
    let klickatNummer                = klickadKnapp.replace("stangningsknapp", "");
    let oppnare                      = document.getElementById(`oppnare${klickatNummer}`);
    let helskarm                     = document.getElementById(`oppnahelskarm${klickatNummer}`)
    let dragspel                     = document.getElementById(`dragspel${klickatNummer}`);
    let visaTitel                    = document.getElementById(`doldtitel${klickatNummer}`);
    let doljTitel                    = document.getElementById(`titelheader${klickatNummer}`)
    let stangningsknapp              = document.getElementById(`stangningsdiv${klickatNummer}`);
    let visaOppningsKnapp            = document.getElementById(`oppnarknapp${klickatNummer}`);
    oppnare.innerHTML                = "▼";
    dragspel.style.maxHeight         = "125px";
    dragspel.style.minHeight         = "125px";
    dragspel.style.boxShadow         = "0px -50px 30px -15px inset var(--a)";
    helskarm.style.visibility        = "invisible";
    helskarm.style.opacity           = "0";
    visaTitel.style.visibility       = "invisible";
    visaTitel.style.opacity          = "0";
    doljTitel.style.visibility       = "visible";
    doljTitel.style.opacity          = "1";
    stangningsknapp.style.visibility = "invisible";
    stangningsknapp.style.opacity    = "0";

    visaOppningsKnapp.setAttribute("onclick", "oppnaPost(event)");
}



//Funktion som hanterar sökrutan
async function sokFunktion() {
  
    //hämtar sökresultat
    let sokFras = document.getElementById("sokruta").value;

    if (sokFras.trim(" ").length < 1){
        console.log("sad");
        alert("Enter a searchphrase");
        return;
    }
    //Hämtar JSON data 
    let databas                     = await get(bloggSokvag);
    let dataVarden                  = databas.val();
    let objektLista                 = Object.values(dataVarden).reverse();
    
    //hittar mainframe iframen och öppnar sokresultat.html i den
    let mainframe     = document.getElementById("mainframe");
    mainframe.src     = "./sokresultat.html";
    let platsAttPosta = "";

    //den här funktionen utförs när iframen laddat in sidan
    mainframe.onload = function() {

        //designerar det element som inlägg ska placeras i
        platsAttPosta = mainframe.contentWindow.document.getElementById("sokresultat");
        
        //om vi lyckas hitta elementet börjar loopen
        if (platsAttPosta) {
            platsAttPosta.innerHTML = " ";

            //löper igenom all data
            for (let inlaggsNummer = 0; inlaggsNummer < objektLista.length; inlaggsNummer++){
                let hamtatObjekt   = (objektLista[inlaggsNummer]);
                console.log(hamtatObjekt.title);
                    
                //om sökfrasen finns i någon av titlarna så utförs loopen nedanför 
                if (hamtatObjekt.title.toLowerCase().includes(sokFras.toLowerCase())){
                    let hittadeResultat = document.createElement("div");
                        
                    //Kortar av textinnehåll, tar bort radbrytningar, och lägger till "..." på slutet om innehållet är längre än 30 tecken. 
                    let avkortadText = hamtatObjekt.text.slice(0, 65).replace("<br>", " ");
                    if (avkortadText.length > 64){
                        avkortadText = avkortadText + "... ";
                    }
                        
                    //kortar av titel, tar bort, etc.
                    let avkortadTitel = hamtatObjekt.title.slice(0, 45).replace("<br>", " ");
                    if (avkortadTitel.length > 44){
                        avkortadTitel = avkortadTitel + "... ";
                    }
                        
                    //ändrar formatet på datum
                    let avkortadDatum = hamtatObjekt.date.slice(5,10);
                    avkortadDatum = avkortadDatum.replace("-", "/");   
                        
                    //ändrar värdet av variabeln nedan till de hittade värdena
                    hittadeResultat.innerHTML = `                    
                    <button onclick="klick(${inlaggsNummer})">
                    <div class="hittatinlagg">
                    <div class="hittatkolumn2">${avkortadDatum}</div>
                    <div class="hittatkolumn1">${avkortadTitel}</div>
                    <div class="hittatkolumn3">${avkortadText}</div>
                    </div></button>                    
                    `;
                        
                    //lägger till värdena på sidan
                    platsAttPosta.appendChild(hittadeResultat);                
                };       
            };
        };
    };
}


//Gör samtliga funktioner i denna fil globala, så att de kan hämta information ur varandra.
window.sokFunktion      = sokFunktion;
window.taBortInlagg     = taBortInlagg;
window.dropDownMeny     = dropDownMeny;
window.StangMeny        = StangMeny;
window.skapaInlagg      = skapaInlagg;
window.hamtaBloggInlagg = hamtaBloggInlagg;
window.stangPostExtra   = stangPostExtra;
window.oppnaPost        = oppnaPost;
window.stangPost        = stangPost;
window.klick            = klick;




