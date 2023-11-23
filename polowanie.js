let player = JSON.parse(localStorage.getItem('player')) || {
    numHunts: 0,
    level: 1,
    experience: 0,
    gold: 0,
    currenthealth: 200,
    maxhealth: 200,
    stamina: 100,
    maxstamina: 100,
    luck: 1,
    defense: 1,
    weapon: 'Zardzewiały Miecz',
    experienceToNextLevel: 100,
    experienceMultiplier: 1.0,
    loot: [],
    monsterLevelRange: "1-5" // Default monster level range

};

function updateMonsterLevel() {
    let levelSelect = document.getElementById('level-select');
    let selectedRange = levelSelect.value;
    let minRequiredLevel = getMinRequiredLevel(selectedRange);

    if (player.level >= minRequiredLevel) {
        player.monsterLevelRange = selectedRange;
        
        // Opcjonalne
        resetPlayerStats();

        // Zaktualizuj info playera
        updatePlayerInfo();
        let resultElement = document.getElementById('result');
        resultElement.textContent = "";
    } else {
        // Alert
        alert(`Musisz mieć co najmniej poziom ${minRequiredLevel} by wybrać polowanie na terenach ${selectedRange} poziomu.`);
        levelSelect.value = player.monsterLevelRange;
    }
}

function getMonsterName(monsterLevel) {
    const monsterNames = {
        1: "Szczur",
        2: "Wąż",
        3: "Wilk",
        4: "Salamandra",
        5: "Drzewiec",
        6: "Wściekła wiewiórka",
        7: "Pijana sowa",
        8: "Dzika sarna",
        9: "Ślepy guziec",
        10: "Częstochowski Miszcz",
        11: "Troll jaskiniowy",
        12: "Jednoskrzydły nietoperz",
        13: "Kret z katarem",
        14: "Pełzacz",
        15: "Kapitan IPA",
        16: "placeholder",

        // 
    };

    return monsterNames[monsterLevel] || "Nieznana kreatura!";
}

function getMinRequiredLevel(range) {
    // Level minimalny
    const minLevels = {
        "1-5": 1,
        "6-10": 6,
        "11-15": 11,
        "16-20": 16,
        "21-30": 21,
        "31-50": 31

        // Dodać więcej
    };

    return minLevels[range] || 1; // Standardowo 1 jeżeli błąd wyżej
}

function hunt() {

    let monsterLevelRange = player.monsterLevelRange.split('-');
    let minMonsterLevel = parseInt(monsterLevelRange[0]);
    let maxMonsterLevel = parseInt(monsterLevelRange[1]);

    // Symulacja walki i przyznawania punktów doświadczenia oraz złota
    let xpMulti = (player.experienceMultiplier).toFixed(2);
    let monsterLevel = Math.floor(Math.random() * (maxMonsterLevel - minMonsterLevel + 1)) + minMonsterLevel;
    let experienceGain = Math.floor(monsterLevel * 10 * xpMulti); // Przyznane punkty doświadczenia
    let minGold = monsterLevel * 10;
    let maxGold = monsterLevel * 12;
    let goldGain = Math.floor(Math.random() * (maxGold - minGold)) + minGold; // Przyznane złoto
    let monsterAttack = monsterLevel * 5;
    let hplost = Math.max(monsterAttack - player.defense, 0);
    let energylost = 5;

    if (player.stamina >= 5 ) {

        if (player.currenthealth > hplost) {

        
    let huntButton = document.getElementById("huntButton");

    if (huntButton.disabled) {
        return;
      }
      let resultXElement = document.getElementById('resultX');
      resultXElement.textContent = `Trwa polowanie...`;
      huntButton.disabled = true;

      setTimeout(function() {

    // Aktualizacja danych gracza
    player.numHunts++;
    player.experience += experienceGain;
    player.gold += goldGain;
    player.stamina -= energylost;
    player.currenthealth -= hplost;

    // Sprawdzenie czy gracz zdobył wystarczająco dużo doświadczenia na nowy poziom
    if (player.experience >= player.experienceToNextLevel) {
        player.level++;
        player.experienceMultiplier += 0.2;
        player.maxhealth += 25;
        player.maxstamina += 10;
        player.luck += 1;
        player.defense += 1;
        player.experienceToNextLevel = calculateExperienceToNextLevel();
    }

    if (Math.random() < player.luck / 100) {
        if (!player.loot) {
            player.loot = [];
        }

        player.loot.push({ type: 'shield', name: 'Obronna tarcza(Obrona+5)', equipped: false });
        
        // Display a message about finding an item
        let resultElement = document.getElementById('result');
        alert('Znalazłeś przedmiot: Obronna Tarcza!');
        resultElement.style.whiteSpace = "pre-line";
    }

    // Zapis danych gracza w local storage
    localStorage.setItem('player', JSON.stringify(player));

    // Wyświetlenie wyniku walki
    let resultElement = document.getElementById('result');
    let monsterName = getMonsterName(monsterLevel);
    resultElement.innerHTML = `~ Walka z potworem: <span style="color: #ffe77d;">${monsterName}</span> (lvl: <span style="color: #7fc1ff;">${monsterLevel}</span>, atak: <span style="color: #ff7158;">${monsterAttack}</span>) ~<br>
        Twoja obrona: ${player.defense}, otrzymujesz <span style="color: rgb(255, 114, 58)">${hplost}</span> punktów obrażeń!<br>
        Zdobyto <span style="color: #ffa6008f;">${experienceGain}</span> doświadczenia<br>
        Znaleziono <span style="color: #ffd000bb;">${goldGain}</span> sztuk złota<br>
        Wykorzystano <span style="color: #cb7cff;">${energylost}</span> energii.`;
        resultElement.style.whiteSpace = "pre-line";


    let resultXElement = document.getElementById('resultX');
    resultXElement.textContent = "";

    // Aktualizacja interfejsu gracza
    updatePlayerInfo();
    huntButton.disabled = false;
    }, 500);

    } else {
    alert('Masz za mało zdrowia! Kup miksturę!');
    }

    } else {
    alert('Masz za mało energii! Kup miksturę!');
    }

}
    


// Funkcja do obliczania doświadczenia potrzebnego do następnego poziomu
    function calculateExperienceToNextLevel() {
    let requiredExperience = 100;

    for (let i = 2; i <= player.level; i++) {
        requiredExperience += Math.ceil(requiredExperience * 1.03);
    }

    return requiredExperience;
}
function updatePlayerInfo() {
    let experienceBar = document.getElementById('experience-bar');
    let expInfo = document.getElementById('exp-info');
  
    let experienceNeededForCurrentLevel = calculateExperienceToNextLevel();
    let experienceNeededForPreviousLevel = player.level === 1 ? 0 : calculateExperienceToNextLevel() - Math.ceil(calculateExperienceToNextLevel() / 1.5);
    let currentLevelExperience = player.level === 1 ? player.experience : player.experience - experienceNeededForPreviousLevel;
  
    let displayText = `${experienceNeededForCurrentLevel - currentLevelExperience}/${experienceNeededForCurrentLevel}`;
    let experiencePercentage = ((experienceNeededForCurrentLevel - currentLevelExperience) / experienceNeededForCurrentLevel) * 100;
  
    experienceBar.style.width = 100 - experiencePercentage + '%';
    expInfo.innerHTML = `Exp: <span id="current-exp">${currentLevelExperience}</span> / <span id="exp-needed">${experienceNeededForCurrentLevel}</span>`;


    let resultElement = document.getElementById('exp-info');
    resultElement.textContent = displayText;

    let levelInfo = document.getElementById('player-level');
    levelInfo.textContent = player.level;

    
    let healthInfo = document.getElementById('health-info');
    healthInfo.textContent = `HP: ${player.currenthealth} / ${player.maxhealth}`;


    let goldAmount = document.getElementById('gold-amount');
    goldAmount.textContent = player.gold;

    let staminaAmount = document.getElementById('stamina-amount');
    staminaAmount.textContent = `${player.stamina} / ${player.maxstamina}`;

    let playerAttack = document.getElementById('player-luck');
    playerAttack.textContent = `${player.luck}`;

    let playerDefense = document.getElementById('player-defense');
    playerDefense.textContent = `${player.defense}`;

    let numHuntsElement = document.getElementById('num-hunts');
    numHuntsElement.textContent = `${player.numHunts}`;



    expInfo.textContent = `Exp: ${player.experience} / ${player.experienceToNextLevel}`;


    let levelContainer = document.getElementById('level-info');
    let previousLevel = parseInt(levelContainer.dataset.level || 1);
    
    if (player.level > previousLevel) {
        levelContainer.classList.add('level-up');
        setTimeout(() => {
            levelContainer.classList.remove('level-up');
        }, 500);

        //
        levelContainer.dataset.level = player.level;
    }
}

function buyEnergy() {
    // Sprawdzenie czy gracz ma dość złota na zakup.
    if (player.gold >= 100) {

        let staminaToAdd = Math.floor(player.maxstamina*0.3);
            if (player.stamina === player.maxstamina) {
                let resultElement = document.getElementById('result');
                resultElement.textContent = `Masz maksymalną ilość energii!`;
                resultElement.style.whiteSpace = "pre-line"; 
                return;
            }

        if (player.stamina + staminaToAdd > player.maxstamina) {
            staminaToAdd = player.maxstamina - player.stamina;
        }

        // Wymiana
        player.gold -= 100;
        player.stamina += staminaToAdd;

        // Wiadomość
        let resultElement = document.getElementById('result');
        resultElement.textContent = `Zakupiono miksturę energii za 100 złota.`;
        resultElement.style.whiteSpace = "pre-line";

        // Push
        updatePlayerInfo();
    } else {
        // Error
        let resultElement = document.getElementById('result');
        resultElement.textContent = `Nie masz wystarczająco złota.`;
        resultElement.style.whiteSpace = "pre-line";
    }
}

// Regeneracja energii
function regenerateStamina() {

    player.stamina += 1;

    // sprawdzenie czy nie przekracza maxa
    if (player.stamina > player.maxstamina) {
        player.stamina = player.maxstamina;
    }


    updatePlayerInfo();
}

// czas regeneracji
setInterval(regenerateStamina, 2000); // 1000ms = 1s


// Regeneracja energii
function regenerateHealth() {

    player.currenthealth += 2;

    // sprawdzenie czy nie przekracza maxa
    if (player.currenthealth > player.maxhealth) {
        player.currenthealth = player.maxhealth;
    }


    updatePlayerInfo();
}

// czas regeneracji
setInterval(regenerateHealth, 5000); // 1000ms = 1s


function buyHP() {
    
    // Sprawdzenie czy gracz ma dość złota na zakup.
    if (player.gold >= 50) {

        let healthToAdd = Math.floor(player.maxhealth * 0.5);

        if (player.currenthealth === player.maxhealth) {
            let resultElement = document.getElementById('result');
            resultElement.textContent = `Masz maksymalną ilość zdrowia!`;
            resultElement.style.whiteSpace = "pre-line"; 
            return;
        }

        if (player.currenthealth + healthToAdd > player.maxhealth) {
            healthToAdd = player.maxhealth - player.currenthealth;
        }
                // Wymiana
                player.gold -= 50;
                player.currenthealth += healthToAdd;
        
                // Wiadomość
                let resultElement = document.getElementById('result');
                resultElement.textContent = `Zakupiono miksturę HP za 50 złota.`;
                resultElement.style.whiteSpace = "pre-line";  

        // Push
        updatePlayerInfo();
    
    } else {
        // Error
        let resultElement = document.getElementById('result');
        resultElement.textContent = `Nie masz wystarczająco złota.`;
        resultElement.style.whiteSpace = "pre-line";
    }
}

function openInventory() {
    document.getElementById('inventory-modal').style.display = 'block';
    displayInventoryItems();
}

function closeInventory() {
    document.getElementById('inventory-modal').style.display = 'none';
}

function displayInventoryItems() {
    let inventoryContent = document.getElementById('inventory-content');
    inventoryContent.innerHTML = '';

    // loot check
    if (player.loot && player.loot.length > 0) {
        for (let i = 0; i < player.loot.length; i++) {
            let item = player.loot[i];
            let itemElement = document.createElement('div');
            itemElement.classList.add('inventory-item');

            // Create an icon element with the bx icon class
            let iconElement = document.createElement('i');

            // Set the appropriate icon based on the potion type
            switch (item.type) {
                case 'health':
                    iconElement.className = 'bx bxs-flask bx-sm';
                    break;
                case 'stamina':
                    iconElement.className = 'bx bxs-drink bx-sm';
                    break;
                case 'talon':
                    iconElement.className = 'bx bxs-medal bx-sm';
                    break;
                case 'shield':
                    iconElement.className = 'bx bx-shield-alt bx-sm';
                    break;

                // Add other cases for different potion types
            }

            itemElement.appendChild(iconElement);

            // Set the title attribute for the item name (tooltip)
            itemElement.title = item.name;

            // Display equipped status and handle item click
            if (item.equipped) {
                itemElement.style.backgroundColor = '#bbbb'; // Set the background color for equipped items
                itemElement.style.color = 'black';
                itemElement.innerHTML += '<span class="equipped-asterisk">*</span>';
                itemElement.addEventListener('click', () => unequipItem(item));
            } else {
                itemElement.addEventListener('click', () => equipItem(item));
            }

            inventoryContent.appendChild(itemElement);
        }
    } else {
        // Error pusty plecak
        inventoryContent.innerHTML = 'Plecak jest pusty.';
    }
}

function equipItem(item) {

    const existingEquippedItem = player.loot.find((existingItem) => existingItem.type === item.type && existingItem.equipped);
    // Unequip currently equipped item of the same type, if any
    if (existingEquippedItem) {
        existingEquippedItem.equipped = false;

        // Remove bonuses based on the unequipped item
        if (existingEquippedItem.type === 'shield') {
            player.defense -= 5; // Adjust the bonus value as needed
        }
    }

    // Equip the selected item
    item.equipped = true;

    // Apply bonuses based on the equipped item
    if (item.type === 'shield') {
        player.defense += 5; // Adjust the bonus value as needed
    }

    // Update the player info and inventory display
    updatePlayerInfo();
    displayInventoryItems();
}

function unequipItem(item) {
    // Unequip the selected item
    item.equipped = false;

    // Remove bonuses based on the unequipped item
    if (item.type === 'shield') {
        player.defense -= 5; // Adjust the bonus value as needed
    }

    // Update the player info and inventory display
    updatePlayerInfo();
    displayInventoryItems();
}

updatePlayerInfo();

function resetLevel() {
    player.numHunts = 0;
    player.level = 1;
    player.experience = 0;
    player.gold = 0;
    player.experienceToNextLevel = 100;
    player.stamina = 100;
    player.maxstamina = 100;
    player.currenthealth = 200;
    player.maxhealth = 200;
    player.defense = 1;
    player.luck = 1;
    player.experienceMultiplier = 1.0;
    player.loot = [
        
    ]
    player.monsterLevelRange = "1-5";
    localStorage.setItem('player', JSON.stringify(player));
    let resultElement = document.getElementById('result');
    resultElement.textContent = `Zresetowano poziom gracza.`;
    updatePlayerInfo();
}




// Inicjalizacja gry
updatePlayerInfo();
