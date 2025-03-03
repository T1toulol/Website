// Affiche une alerte quand la page est chargée
/*window.onload = function() {
    alert(Bienvenue sur ropartz.net !);
};*/


console.log("Script chargé !");


let score=0;
const scoreElement = document.getElementById("score");
const button = document.getElementById("lol");

button.addEventListener("click", () => {
    score++;
    scoreElement.innerText = score;

    if (score>100){
        document.getElementById("message").style.display = "block";
    }
})
