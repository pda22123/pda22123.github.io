<!DOCTYPE html>
<html>
  <head>
    <title>Bake your cake</title>
    <meta name="description" content="Bake your cake">
    <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>

    <style>
      .start-ui {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        text-align: center;
      }

      .start-ui button {
        margin: 10px;
        padding: 15px 30px;
        font-size: 18px;
        cursor: pointer;
      }

      /* Cake choice tabs */
      #cakeChoices {
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        gap: 20px;
        z-index: 10;
      }

      .cake-tab {
        padding: 20px;
        border-radius: 10px;
        color: white;
        font-size: 20px;
        cursor: pointer;
        text-align: center;
        width: 180px;
        font-weight: bold;
      }

      #chocolateTab { background-color: #8B4513; } /* Light brown */
      #blueberryTab { background-color: #1E90FF; } /* Blue */
      #cherryTab { background-color: #FF69B4; }    /* Pink */

      /* Recipe panel */
      #recipePanel {
        position: absolute;
        top: 20%;
        left: 5%;
        padding: 20px;
        border-radius: 12px;
        font-family: sans-serif;
        font-size: 18px;
        display: none;
        z-index: 10;
        min-width: 200px;
        color: white;
      }

      #recipePanel h2 {
        margin-top: 0;
        font-size: 22px;
        text-align: center;
      }

      #recipePanel ul {
        list-style: none;
        padding: 0;
      }

      #recipePanel li {
        margin: 5px 0;
        font-weight: bold;
      }

      #recipePanel li.collected {
        color: lightgreen;
      }
    </style>

    <script>
      let selectedCake = null;
      const recipes = {
        blueberry: ["Flour", "Sugar", "Butter", "Milk", "Vanilla", "Blueberries", "Spatula"],
        chocolate: ["Flour", "Sugar", "Butter", "Milk", "Vanilla", "Chocolate", "Strawberries", "Spatula"],
        cherry: ["Flour", "Sugar", "Butter", "Milk", "Vanilla", "Cherries", "Spatula"]
      };

      function startGame() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('cakeChoices').style.display = 'flex';
      }

      function selectCake(cakeType) {
        selectedCake = cakeType;

        // Hide cake choices
        document.getElementById('cakeChoices').style.display = 'none';

        // Show A-Frame scene
        document.getElementById('scene').style.display = 'block';

        // Make all kitchen objects visible
        const entityIds = [
          'kitchenrightwall','blueberries','plate','strawberry','blackcabinet','blackplate',
          'bluebottle','bowl','clock','coffee','coffeemaker','counterfloorright','cuttingboard',
          'exhaustfan','faucet','floor','kitchenopenwall','kitchenroofslide','kitchenrooftop',
          'kitchenwallback','kniveholder','ladlesandspoonswall','light','mugs','pandeep','plant',
          'plantwindow','salt1','salt2','salt3','shelves','sink','slicefruitcake','soap','soap2',
          'spatula','stool','stove','stovecabinets','sugarbag','vanilla','wallclock','wallcountertop',
          'wallstove','whitebottle','windowbottom'
        ];
        entityIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.setAttribute('visible', true);
        });

        // Restart background music
        const music = document.querySelector('#mainmusic');
        if (music && music.components && music.components.sound) {
          music.components.sound.stopSound();
          music.components.sound.playSound();
        }

        // Show recipe panel
        const recipePanel = document.getElementById('recipePanel');
        recipePanel.style.display = 'block';

        // Set panel background to cake color
        if (cakeType === "blueberry") recipePanel.style.backgroundColor = "#1E90FF";
        if (cakeType === "chocolate") recipePanel.style.backgroundColor = "#8B4513";
        if (cakeType === "cherry") recipePanel.style.backgroundColor = "#FF69B4";

        // Fill recipe panel
        const ingredients = recipes[cakeType];
        recipePanel.innerHTML = `
          <h2>${cakeType.charAt(0).toUpperCase() + cakeType.slice(1)} Cake</h2>
          <ul>
            ${ingredients.map(item => `<li id="recipe-${item.toLowerCase()}">${item}</li>`).join('')}
          </ul>
        `;

        // Add clickable behavior for collectable ingredients
        document.querySelectorAll('.ingredient').forEach(el => {
          el.addEventListener('click', () => collectIngredient(el.id));
        });
      }

      function collectIngredient(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.setAttribute('visible', false);

        // Update recipe panel text
        const recipeItem = document.getElementById(`recipe-${id.toLowerCase()}`);
        if (recipeItem) {
          recipeItem.classList.add('collected');
          recipeItem.innerHTML = `✅ ${recipeItem.innerText}`;
        }
      }
    </script>
  </head>

  <body>
    <!-- Start Screen -->
    <div class="start-ui" id="startScreen">
      <h1>Bake your cake</h1>
      <button onclick="startGame()">Start</button>
      <button onclick="window.close()">Quit</button>
    </div>

    <!-- Cake choice tabs -->
    <div id="cakeChoices">
      <div id="chocolateTab" class="cake-tab" onclick="selectCake('chocolate')">Chocolate Cake</div>
      <div id="blueberryTab" class="cake-tab" onclick="selectCake('blueberry')">Blueberry Cake</div>
      <div id="cherryTab" class="cake-tab" onclick="selectCake('cherry')">Cherry Cake</div>
    </div>

    <!-- Recipe panel -->
    <div id="recipePanel"></div>

    <!-- A-Frame Scene -->
    <a-scene id="scene" vr-mode-ui="enabled: false" style="display:none;">
      <!-- Camera -->
      <a-entity id="cameraRig" position="0 0 0">
        <a-camera position="0 1.6 0">
          <a-cursor rayOrigin="mouse" material="color: black; shader: flat"></a-cursor>
        </a-camera>
      </a-entity>

      <!-- Lights -->
      <a-entity light="type: ambient; intensity: 0.5"></a-entity>
      <a-entity light="type: directional; intensity: 0.8" position="0 2 1"></a-entity>

      <!-- Kitchen objects (hidden initially) -->
      <a-entity id="kitchenrightwall" gltf-model="kitchenrightwall.glb" visible="false"></a-entity>

      <!-- Ingredients -->
      <a-entity id="blueberries" class="ingredient" gltf-model="blueberries.glb" visible="false"></a-entity>
      <a-entity id="plate" class="ingredient" gltf-model="plate.glb" visible="false"></a-entity>
      <a-entity id="strawberry" class="ingredient" gltf-model="strawberry.glb" visible="false"></a-entity>

      <!-- Sounds -->
      <a-sound id="mainmusic" src="baking cooking jazz.mp3" autoplay="false" loop="true"></a-sound>
    </a-scene>
  </body>
</html>
