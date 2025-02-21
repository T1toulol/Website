// Affiche une alerte quand la page est chargée
/*window.onload = function() {
    alert(Bienvenue sur ropartz.net !);
};*/

// Change le texte du paragraphe quand on clique sur le bouton
document.addEventListener(DOMContentLoaded, function() {
    const button = document.getElementById(changeTextBtn);
    const message = document.getElementById(message);

    button.addEventListener(click, function() {
        message.textContent = "Texte modifié par du JavaScript frontend !";
    });
});

