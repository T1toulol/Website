// Affiche une alerte quand la page est chargée
/*window.onload = function() {
    alert(Bienvenue sur ropartz.net !);
};*/
let listeLettres = [];
let listeSolution = [];
let listeMotsSolution = [];
let greencpt = 5;
//Chaque liste représente un mot (parfois sans les bords)
let listeIndice = [[0,1,2],[3,4,5],[1,6,7,8],[4,9,10,11],[12,8,13],[14,11,15]]

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

    setTimeout(afficherCarteBVN, 500); 
    window.addEventListener("load", afficherCarteBVN);

    cases.forEach(c => {
        if(c.classList.contains("green")){
            c.setAttribute("draggable", false);
        }
        else{
            c.setAttribute("draggable", true);
        } 

        //DEV
        /*c.addEventListener("click", (o) => {
            console.log(QuellesLettres(parseInt(c.querySelector('.lettre').getAttribute('data-info'))));
        });*/

        // Début du drag
        c.addEventListener("dragstart", (e) => {
            draggedElement = e.target;

            // Désactiver l'image fantôme par défaut
            e.dataTransfer.setData("text/plain", "");
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setDragImage(new Image(), 0, 0); // Supprime la prévisualisation native

            // Créer un clone
            clone = draggedElement.cloneNode(true);
            clone.classList.add("dragging-clone");
            document.body.appendChild(clone);

            // Rendre la case d'origine blanche
            setTimeout(() => draggedElement.classList.add("empty"), 50);
        });

        // Suivre la souris avec le clone
        document.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (clone) {
                clone.style.left = `${e.pageX}px`;
                clone.style.top = `${e.pageY}px`;
            }
        });
        
        // Quand on lâche la case sur une autre
        c.addEventListener("drop", (e) => {
            e.preventDefault();
            
            if (draggedElement && draggedElement !== c && !c.classList.contains("green")) {
                // Échange des contenus sur le plateau
                let lettreA = c.querySelector('.lettre').textContent;
                c.querySelector('.lettre').textContent = draggedElement.querySelector('.lettre').textContent;
                draggedElement.querySelector('.lettre').textContent = lettreA;

                //Echange des contenus dans la liste correspondante
                listeLettres[parseInt(draggedElement.querySelector('.lettre').getAttribute('data-info'))] = lettreA;
                listeLettres[parseInt(c.querySelector('.lettre').getAttribute('data-info'))] = c.querySelector('.lettre').textContent;
                
                //On revérifie le plateau
                verify(listeLettres,listeSolution);
                
                let scoreElement = document.getElementById('Score');
                scoreElement.textContent = parseInt(scoreElement.textContent) - 1;
                if (scoreElement.textContent <= 0){
                    afficherCarteFinie();
                    grilleSol.style.display = "grid";
                    document.querySelector(".full-width-line").style.display = "block";
                }

                if (greencpt===21){
                    afficherCarteFinie();
                    grilleSol.style.display = "grid";
                    document.querySelector(".full-width-line").style.display = "block";
                }
            }
        });
        
        // Fin du drag (qu'on drop ou non)
        c.addEventListener("dragend", () => {
            if (draggedElement) {
                draggedElement.classList.remove("empty");
                draggedElement = null;
            }
            if (clone) {
                clone.remove(); // Supprimer le clone
                clone = null;
            }
        });
    });

    function afficherCarteFinie() {
        overlay.style.display = "block";
        carteFinie.style.display = "block";
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
        if (event.target.classList.contains("fermer")) {
            foisfermees++;
            console.log("lol");
            masquerCarteBVN();
            masquerCarteFinie();
            if(foisfermees >= 2){
                cases.forEach( c => {
                    c.setAttribute("draggable", false);
                });
            }
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
    listeMotsSolution = motsSolution.slice();
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

