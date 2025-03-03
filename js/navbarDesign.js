/* Den här filen innehåller kod som anropas ifrån index.html. 
Den läser av id:t "storleksandrare" som jag lagt på den importerade bootstrapen som är navigeringsmenyn.
Navigeringsmenyn är själv inställd i bootstrapkoden att ändra storlek dynamiskt efter fönstrets storlek,
men eftersom jag själv lagt till egna element i navigeringen, så anpassas inte de automatiskt efter layouten 
som skapas när navigeringsmenyn ändrar storlek.

Den här koden skapar en ResizeObserver som ständigt övervakar navigeringsmenyns ID. När navigeringsmenyns bredd 
går över eller under 990 pixlar, så har jag lagt in kod som även ändrar utseendet på menyn för att bättre passa
ihop med mina egna element och layout på sidan.*/

let knapp      = document.getElementById("navbarCollapseButton");
let navbarFarg = document.getElementById("navbarSupportedContent")
let overvakare = new ResizeObserver(entries => {
  for (let entry of entries) {

    if (entry.contentRect.width > 990) {
      navbarFarg.style.background    = "none";
      navbarFarg.style.border        = "none";
      navbarFarg.style.marginTop     = "0px";
      navbarFarg.style.paddingBottom = "0px";
    }
    else {
      navbarFarg.style.background    = "linear-gradient( var(--d), var(--c), var(--b), var(--a))";
      navbarFarg.style.border        = "1px solid black";
      navbarFarg.style.borderTop     = "none";
      navbarFarg.style.borderRadius  = "10px 10px 10px 10px";
      navbarFarg.style.marginTop     = "50px";
      navbarFarg.style.paddingBottom = "20px";
    }
  }
});
overvakare.observe(document.getElementById("storleksandrare"));