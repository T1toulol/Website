import { Mistral } from 'https://cdn.jsdelivr.net/npm/@mistralai/mistralai/+esm';
// Affiche une alerte quand la page est chargée
/*window.onload = function() {
    alert(Bienvenue sur ropartz.net !);
};*/
let listeLettres = [];
let listeSolution = [];
let listeMotsSolution = [["",0],["",0],["",0],["",0],["",0],["",0]];
let greencpt = 5;
//Chaque liste représente un mot (parfois sans les bords)
let listeIndice = [[0,1,2],[3,4,5],[1,6,7,8],[4,9,10,11],[12,8,13],[14,11,15]]
const apiKey = "yIN4ilBGbmQjNRFQOHhE1A2btMkCCSHL";
const agentId = "ag:3fbc165d:20250321:dictionnaire:1aacd404";

function QuellesLettres(indice){
    let lettreTeste = listeLettres[indice];
    let rappel = [];
    let lettres = "";
    let i =0;
    for (i;i<listeIndice.length;i++){
        if (listeIndice[i].includes(indice)){
            rappel.push(i);
            listeIndice[i].forEach(lettre =>{
                if(lettre!=indice){
                    lettre = String(lettre).padStart(2, '0');
                    lettres = lettres.concat(document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).textContent);

                    //Si la lettre qu'on vient de trouver est la meme que la lettre testée, et n'a pas déja été visitée
                    if((document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).textContent === lettreTeste) && (document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).getAttribute('data-used') !== 'true')){
                        if ([1,4,8,11].includes(parseInt(lettre))){
                            if((document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).getAttribute('data-used') === 'false')){
                                document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).setAttribute('data-used',"faue");
                            }
                            else{
                                document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).setAttribute('data-used',"true");
                            }
                        }
                        else{
                            document.querySelector(`.caseSol > .lettre[data-info="${lettre}"]`).setAttribute('data-used',"true");
                        }
                        indice = String(indice).padStart(2, '0');
                        document.querySelector(`.case > .lettre[data-info="${indice}"]`).closest('.case').classList.add('yellow');
                    }
                }
            })
        }
    }
}

function AfficheDef(mot,numeroMot){
    console.log("Appel de AfficheDef avec :", mot, numeroMot); // Vérifier ici
    const client = new Mistral({
      apiKey: apiKey, // Remplacez par votre clé API
    });
    
    async function GenereMotMistral(mot){
        const response = await client.agents.complete({
        agentId: agentId,
        messages: [
            {
            role: 'user',
            content: 'Courte définition de ' + mot,
            },
        ],
        });
        return response.choices[0].message.content
    }

    GenereMotMistral(mot.toLowerCase()).then(definition => {
        const element = document.getElementById("def" + numeroMot);
        if (!element) {
            console.error("L'élément défini avec ID 'def" + numeroMot + "' n'existe pas !");
            return;
        }
        document.getElementById("def" + numeroMot).style.display = "block";
        document.getElementById("def" + numeroMot).querySelector('.definition').textContent = definition;
        document.getElementById("def" + numeroMot).querySelector('.mot').textContent = mot;
    });
}

function verify(listeLettres, listeSolution){
    const cases = document.querySelectorAll(".case");

    //Reinitialisation
    cases.forEach(c => {
        if (!(c.classList.contains('green'))){
            document.querySelector(`.caseSol > .lettre[data-info="${c.querySelector('.lettre').getAttribute('data-info')}"]`).setAttribute('data-used', "false");
        }
        c.classList.remove("yellow");
        c.classList.remove("empty");
    });

    //Test des cases vertes
    cases.forEach(c => {
        if((c.querySelector('.lettre').getAttribute('data-info')[0] !== 'A') && !(c.classList.contains('dragging-clone'))){
            if((listeLettres[parseInt(c.querySelector('.lettre').getAttribute('data-info'))] === listeSolution[parseInt(c.querySelector('.lettre').getAttribute('data-info'))]) && !(c.classList.contains('green')) ){
                c.classList.add("green");
                greencpt++;
                document.querySelector(`.caseSol > .lettre[data-info="${c.querySelector('.lettre').getAttribute('data-info')}"]`).setAttribute('data-used', "true");
                c.setAttribute("draggable", false);
            }
        }
    });

    //Test des cases jaunes
    cases.forEach(c => {
        if((c.querySelector('.lettre').getAttribute('data-info')[0] !== 'A') && !(c.classList.contains('dragging-clone'))){
            //if(document.querySelector(`.caseSol > .lettre[data-info="${c.querySelector('.lettre').getAttribute('data-info')}"]`).getAttribute('data-used') === "false"){
            if(!(c.classList.contains('green'))){
                QuellesLettres(parseInt(c.querySelector('.lettre').getAttribute('data-info')));
            }
        }
    });

    if(cases[1].classList.contains('green') && cases[2].classList.contains('green') && cases[3].classList.contains('green')){
        if(listeMotsSolution[0][1]==0){
            AfficheDef(listeMotsSolution[0][0],1);
            listeMotsSolution[0][1]=1;
        }
        console.log("mot1",'1');
    }

    if(cases[5].classList.contains('green') && cases[8].classList.contains('green') && cases[13].classList.contains('green')){
        if(listeMotsSolution[1][1]==0){
            AfficheDef(listeMotsSolution[1][0],2);
            listeMotsSolution[1][1]=1;
        }
        console.log("mot2",'2');
    }

    if(cases[2].classList.contains('green') && cases[6].classList.contains('green') && cases[14].classList.contains('green') && cases[18].classList.contains('green')){
        if(listeMotsSolution[2][1]==0){
            AfficheDef(listeMotsSolution[2][0],3);
            listeMotsSolution[2][1]=1;
        }
        console.log("mot3",'3');
    }

    if(cases[8].classList.contains('green') && cases[9].classList.contains('green') && cases[11].classList.contains('green') && cases[12].classList.contains('green')){
        if(listeMotsSolution[3][1]==0){
            AfficheDef(listeMotsSolution[3][0],4);
            listeMotsSolution[3][1]=1;
        }
        console.log("mot4",'4');
    }

    if(cases[17].classList.contains('green') && cases[18].classList.contains('green') && cases[19].classList.contains('green')){
        if(listeMotsSolution[4][1]==0){
            AfficheDef(listeMotsSolution[4][0],5);
            listeMotsSolution[4][1]=1;
        }
        console.log("mot5",'5');
    }

    if(cases[7].classList.contains('green') && cases[12].classList.contains('green') && cases[15].classList.contains('green')){
        if(listeMotsSolution[5][1]==0){
            AfficheDef(listeMotsSolution[5][0],6);
            listeMotsSolution[5][1]=1;
        }
        console.log("mot6",'6');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cases = document.querySelectorAll(".case");
    let draggedElement = null;
    let clone = null;
    let foisfermees=0;
    const overlay = document.querySelector(".overlay");
    const grilleSol = document.getElementById("grilleSol");
    const carteFinie = document.querySelector(".carteFinie");
    const carteBVN = document.querySelector(".carteBVN");
    let mot = "bugle"
    let def = "Instrument de musique à vent, de la famille des cuivres, avec une embouchure en forme de trompette."






    
    setTimeout(afficherCarteBVN, 500); 
    window.addEventListener("load", afficherCarteBVN);


    cases.forEach((c) => {
        if (c.classList.contains(".green")) {
            c.setAttribute("draggable", false);
        } else {
            c.setAttribute("draggable", true);
        }
    
        // Écouteurs pour PC (souris)
        c.addEventListener("mousedown", (e) => StartDrag(e, c));
    
        // Écouteurs pour Mobile (tactile)
        c.addEventListener("touchstart", (e) => StartDrag(e, c), { passive: false });
    });
    
    function StartDrag(e, c) {
        e.preventDefault(); // Bloque le comportement natif (ex: scroll)
        if (!c.classList.contains('green') && foisfermees<2){
            draggedElement = c;
        
            
            // Créer un clone
            clone = draggedElement.cloneNode(true);
            clone.classList.add("dragging-clone");
            document.body.appendChild(clone);
            
            draggedElement.classList.add("empty");
            draggedElement.querySelector('.lettre').classList.add('emptyLetter');
            
            // Position initiale du clone
            moveClone(e);
            
            // Ajouter les écouteurs pour suivre le mouvement
            if (e.type === "mousedown") {
                document.addEventListener("mousemove", moveClone);
                document.addEventListener("mouseup", dropClone);
            } else {
                // Bloquer le scroll de la page
                document.body.style.overflow = "hidden";
                document.addEventListener("touchmove", moveClone, { passive: false });
                document.addEventListener("touchend", dropClone);
            }
        }
    }
    
    function moveClone(e) {
        if (clone) {
            let x, y;
    
            // Vérifier si c'est un événement tactile ou souris
            if (e.type.startsWith("touch")) {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
                e.preventDefault(); // Bloque le scroll sur mobile
            } else {
                x = e.clientX;
                y = e.clientY;
            }
    
            clone.style.position = "fixed";
            clone.style.left = `${x}px`;
            clone.style.top = `${y}px`;
    
        }
    }
    
    function dropClone(e) {
        if (clone) {
            let x, y;
    
            // Vérifier si c'est un événement tactile ou souris
            if (e.type.startsWith("touch")) {
                x = e.changedTouches[0].clientX;
                y = e.changedTouches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }
    
            let target = document.elementFromPoint(x, y);
            if (target.classList.contains("lettre")) {
                target = target.parentNode;
            }
            if (target && (target.classList.contains("case") || target.classList.contains("lettre")) && target !== draggedElement && !target.classList.contains("green") && !target.classList.contains("blank")) {
                let lettreA = target.querySelector('.lettre').textContent;
                target.querySelector('.lettre').textContent = draggedElement.querySelector('.lettre').textContent;
                draggedElement.querySelector('.lettre').textContent = lettreA;
                
                listeLettres[parseInt(draggedElement.querySelector('.lettre').getAttribute('data-info'))] = lettreA;
                listeLettres[parseInt(target.querySelector('.lettre').getAttribute('data-info'))] = target.querySelector('.lettre').textContent;
                
                verify(listeLettres, listeSolution);
                
                let scoreElement = document.getElementById('Score');
                scoreElement.textContent = parseInt(scoreElement.textContent) - 1;
                if (scoreElement.textContent <= 0) {
                    afficherCarteFinie();
                    grilleSol.style.display = "grid";
                    document.querySelector(".full-width-line").style.display = "block";
                }
    
                if (greencpt === 21) {
                    afficherCarteFinie();
                    grilleSol.style.display = "grid";
                    document.querySelector(".full-width-line").style.display = "block";
                }
            }
    
            draggedElement.querySelector('.lettre').classList.remove('emptyLetter');
            draggedElement.classList.remove('empty');
    
            // Supprimer le clone
            clone.remove();
            clone = null;
        }
    
        // Supprimer les écouteurs
        document.removeEventListener("mousemove", moveClone);
        document.removeEventListener("mouseup", dropClone);
        document.removeEventListener("touchmove", moveClone);
        document.removeEventListener("touchend", dropClone);
    
        // Réactiver le scroll après le drag
        document.body.style.overflow = "";
    }
    function afficherCarteFinie() {
        overlay.style.display = "block";
        carteFinie.style.display = "block";
        let i;
        for(i=0;i<6;i++){
            if(listeMotsSolution[i][1]==0){
                AfficheDef(listeMotsSolution[i][0],i+1);
                listeMotsSolution[i][1]=1;
            }
        }
    }

    function masquerCarteFinie() {
        overlay.style.display = "none";
        carteFinie.style.display = "none";
    }

    function afficherCarteBVN() {
        overlay.style.display = "block";
        carteBVN.style.display = "block";
    }

    function masquerCarteBVN() {
        overlay.style.display = "none";
        carteBVN.style.display = "none";
    }

    document.addEventListener("click", (event) => {
        if(event.target.classList.contains("Regles")){
            afficherCarteBVN();
        }
        if(event.target.classList.contains("Parametres")){
            AfficheNavBar();
        }
        if (event.target.classList.contains("fermer")) {
            console.log("lol");
            masquerCarteBVN();
            masquerCarteFinie();
        }
    });
});

function CreerSolution(){
    return new Promise((resolve, reject) => {
        let listeMots,newListe1,newListe2,newListe3,newListe4,newListe5;
        let mot1, mot2, mot3, mot4, mot5, mot6;
        let reussite = 0, mots;

        fetch('../assets/words.txt') // Sous Windows
        .then(response => response.text())
        .then(data => {
            while(!reussite){
                listeMots = data.split(" ");
                //Nb de mots : 8061
                mot1 = listeMots[Math.floor(Math.random() * 8061)];

                //On chope le 2e mot
                newListe1 = listeMots.filter(word => word.startsWith(mot1[0]));
                mot2 = newListe1[Math.floor(Math.random()*newListe1.length)];

                //On chope le 3e mot
                newListe2 = listeMots.filter(word => word.startsWith(mot1[2]));
                mot3 = newListe2[Math.floor(Math.random()*newListe2.length)];

                //On chope le 4e mot
                mot4;
                newListe3 = listeMots.filter(word => word[0] === mot2[2] && word[2] === mot3[2]);
                if (newListe3.length>0){
                    mot4 = newListe3[Math.floor(Math.random()*newListe3.length)];
                }
                else {
                    mot4 = "ZZZZZ";
                }

                //On chope le 5e mot
                mot5;
                newListe4 = listeMots.filter(word => word[0] === mot2[4] && word[2] === mot3[4]);
                if (newListe4.length>0){
                    mot5 = newListe4[Math.floor(Math.random()*newListe4.length)];
                }
                else {
                    mot5 = "ZZZZZ";
                }

                //On chope le 6e mot
                mot6;
                newListe5 = listeMots.filter(word => word[0] === mot1[4] && word[2] === mot4[4] && word[4] === mot5[4]);
                if (newListe5.length>0){
                    mot6 = newListe5[Math.floor(Math.random()*newListe5.length)];
                }
                else {
                    mot6 = "ZZZZZ";
                }

                //Verification de la solution
                mots = [mot1, mot2, mot3, mot4, mot5, mot6];
                if( !((mots.some((item, index) => mots.indexOf(item) !== index)) || mots.includes("ZZZZZ"))){
                    reussite=1;
                }
            }
            //Ecriture de la solution : 
            let cases = document.querySelectorAll('.caseSol');
            
            cases[0].querySelector('.lettre').textContent = mot1[0];
            cases[1].querySelector('.lettre').textContent = mot1[1];
            cases[2].querySelector('.lettre').textContent = mot1[2];
            cases[3].querySelector('.lettre').textContent = mot1[3];
            cases[4].querySelector('.lettre').textContent = mot1[4];
            cases[5].querySelector('.lettre').textContent = mot2[1];
            cases[6].querySelector('.lettre').textContent = mot3[1];
            cases[7].querySelector('.lettre').textContent = mot6[1];
            cases[8].querySelector('.lettre').textContent = mot4[0];
            cases[9].querySelector('.lettre').textContent = mot4[1];
            cases[10].querySelector('.lettre').textContent = mot4[2];
            cases[11].querySelector('.lettre').textContent = mot4[3];
            cases[12].querySelector('.lettre').textContent = mot4[4];
            cases[13].querySelector('.lettre').textContent = mot2[3];
            cases[14].querySelector('.lettre').textContent = mot3[3];
            cases[15].querySelector('.lettre').textContent = mot6[3];
            cases[16].querySelector('.lettre').textContent = mot5[0];
            cases[17].querySelector('.lettre').textContent = mot5[1];
            cases[18].querySelector('.lettre').textContent = mot5[2];
            cases[19].querySelector('.lettre').textContent = mot5[3];
            cases[20].querySelector('.lettre').textContent = mot5[4];
            resolve(mots); // Retourne les mots à l'appelant
        }).catch(error => console.error("Erreur :", error));
    });
}

CreerSolution().then(motsSolution => {
    let shuffled;
    listeMotsSolution[0][0] = motsSolution[0];
    listeMotsSolution[1][0] = motsSolution[1];
    listeMotsSolution[2][0] = motsSolution[2];
    listeMotsSolution[3][0] = motsSolution[3];
    listeMotsSolution[4][0] = motsSolution[4];
    listeMotsSolution[5][0] = motsSolution[5];
    listeLettres = [motsSolution[0][1],motsSolution[0][2],motsSolution[0][3],motsSolution[1][1],motsSolution[1][2],motsSolution[1][3],motsSolution[2][1],motsSolution[2][3],motsSolution[2][4],motsSolution[3][1],motsSolution[3][3],motsSolution[3][4],motsSolution[4][1],motsSolution[4][3],motsSolution[5][1],motsSolution[5][3]];
    listeSolution = listeLettres.slice();
    for (let i = listeLettres.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listeLettres[i], listeLettres[j]] = [listeLettres[j], listeLettres[i]];
    }
    let cases = document.querySelectorAll('.case');
    cases[0].querySelector('.lettre').textContent = motsSolution[0][0];
    cases[1].querySelector('.lettre').textContent = listeLettres[0];
    cases[2].querySelector('.lettre').textContent = listeLettres[1];
    cases[3].querySelector('.lettre').textContent = listeLettres[2];
    cases[4].querySelector('.lettre').textContent = motsSolution[0][4];
    cases[5].querySelector('.lettre').textContent = listeLettres[3];
    cases[6].querySelector('.lettre').textContent = listeLettres[6];
    cases[7].querySelector('.lettre').textContent = listeLettres[14];
    cases[8].querySelector('.lettre').textContent = listeLettres[4];
    cases[9].querySelector('.lettre').textContent = listeLettres[9];
    cases[10].querySelector('.lettre').textContent = motsSolution[2][2];
    cases[11].querySelector('.lettre').textContent = listeLettres[10];
    cases[12].querySelector('.lettre').textContent = listeLettres[11];
    cases[13].querySelector('.lettre').textContent = listeLettres[5];
    cases[14].querySelector('.lettre').textContent = listeLettres[7];
    cases[15].querySelector('.lettre').textContent = listeLettres[15];
    cases[16].querySelector('.lettre').textContent = motsSolution[1][4];
    cases[17].querySelector('.lettre').textContent = listeLettres[12];
    cases[18].querySelector('.lettre').textContent = listeLettres[8];
    cases[19].querySelector('.lettre').textContent = listeLettres[13];
    cases[20].querySelector('.lettre').textContent = motsSolution[5][4];

    verify(listeLettres,listeSolution);
}).catch(error => {
    console.log("Erreur lors de la création de la solution :", error);
});
