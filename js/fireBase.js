/*############################# KOD SOM HANTERAR TILLGÅNG TILL OCH FRÅN FIREBASE #############################*/

/* Importerar nödvändiga funktioner för att använda Firebase. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

/* All information jag behöver för att ansluta till firebase-projektet. */
const firebaseConfig = {
    apiKey: "AIzaSyDN-vxsfdywQzLTGlwXwTThfPGN6axjeP8",
    authDomain: "blogg-65861.firebaseapp.com",
    databaseURL: "https://blogg-65861-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "blogg-65861",
    storageBucket: "blogg-65861.firebasestorage.app",
    messagingSenderId: "387422807509",
    appId: "1:387422807509:web:0c945aae222468c37b895c",
    measurementId: "G-19VBJ3LQ5Y"
};

//Skapar en variabel som startar firebase-appen.
const startaFireBase = initializeApp(firebaseConfig);

//Variabel som etablerar vad jag vill göra (ansluta databasen).
const databas = getDatabase(startaFireBase);

//Variabel som innehåller sökvägen för det specifika firebase-projektet.
const bloggSokvag = ref(databas, "projekt/blogPosts");

/*  
Exporterar informationen så det kan användas i andra filer. Jag hade kunnat ha den här koden i andra
js filer, men tyckte det kändes bättre att separera den.*/
export { databas, bloggSokvag };

