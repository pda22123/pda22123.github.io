let currentIngredients = [];
let collectedIngredients = [];
let selectedCake = '';

// Listen for drag-drop event from super-hands on the mixing bowl
document.addEventListener('DOMContentLoaded', () => {
    const mixingBowl = document.getElementById('mixingbowl');
    mixingBowl.addEventListener('drag-drop', (e) => {
        const droppedEl = e.detail.dropped || (e.detail.hand && e.detail.hand.carried);
        if (!droppedEl || !droppedEl.classList.contains('grabbable')) return;

        const ingredientName = droppedEl.getAttribute('data-name');
        if (currentIngredients.includes(ingredientName) && !collectedIngredients.includes(ingredientName)) {
            collectedIngredients.push(ingredientName);

            const li = document.getElementById(`recipe-${ingredientName}`);
            if (li) {
                li.classList.add('collected');
            }

            droppedEl.setAttribute('visible', 'false');
            checkCompletion();
        }
    });
});

function startGame(){
    document.getElementById('startScreen').style.display='none';
    document.getElementById('cakeChoices').style.display='flex';
    const music = document.querySelector('#mainmusic');
    if(music && music.components.sound && !music.components.sound.isPlaying){
        music.components.sound.playSound();
    }
}

function chooseCake(cakeName){
    selectedCake = cakeName;
    document.getElementById('cakeChoices').style.display='none';
    document.getElementById('scene').style.display='block';
    const recipePanel = document.getElementById('recipePanel');
    recipePanel.style.display='block';
    recipePanel.className = cakeName;

    const baseIngredients = ["flour", "sugar", "butter", "milk", "egg"];
    if(cakeName === 'blueberry'){
        currentIngredients = [...baseIngredients, "blueberry"];
    } else if(cakeName === 'chocolate'){
        currentIngredients = [...baseIngredients, "chocolate"];
    } else if(cakeName === 'cherry'){
        currentIngredients = [...baseIngredients, "cherries"];
    }
    collectedIngredients = [];

    recipePanel.innerHTML = `<h2>${cakeName.charAt(0).toUpperCase() + cakeName.slice(1)} Cake</h2>
        <ul>${currentIngredients.map(i => `<li id="recipe-${i}">${i}</li>`).join('')}</ul>`;
}

function checkCompletion() {
    const allCollected = currentIngredients.length === collectedIngredients.length && 
                         currentIngredients.every(item => collectedIngredients.includes(item));
    if (allCollected) {
        setTimeout(showFinalCake, 1000);
    }
}

function showFinalCake() {
    // Hide all collectible ingredients
    const ingredientsToHide = document.querySelectorAll('.grabbable');
    ingredientsToHide.forEach(ing => {
        if (currentIngredients.includes(ing.dataset.name)) {
            ing.setAttribute('visible', 'false');
        }
    });
    document.getElementById('mixingbowl').setAttribute('visible', 'false');

    const finalCakeContainer = document.getElementById('final-cake-container');
    finalCakeContainer.setAttribute('visible', 'true');

    if (selectedCake === 'chocolate') {
        const cakeModel = document.getElementById('chocolatecake');
        cakeModel.setAttribute('visible', 'true');
    } else if (selectedCake === 'blueberry') {
        const cakeModel = document.getElementById('blueberrycake');
        cakeModel.setAttribute('visible', 'true');
    } else if (selectedCake === 'cherry') {
        document.getElementById('cherrycake1').setAttribute('visible', 'true');
        document.getElementById('cherrycake2').setAttribute('visible', 'true');
        document.getElementById('cherrycake3').setAttribute('visible', 'true');
        document.getElementById('cherrycake4').setAttribute('visible', 'true');
    }

    finalCakeContainer.setAttribute('animation', { property: 'scale', from: '0.01 0.01 0.01', to: '1 1 1', dur: 1500, easing: 'easeOutElastic' });
}
