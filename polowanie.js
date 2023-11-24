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
    amulet: {
        level: 0,
        upgradeCost: 2000, 
        amuletExperienceMultiplier: 0.0,
    },
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
        5: "Głowicowiec",
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
    let experienceGain = Math.floor(monsterLevel * 10 * xpMulti + player.amulet.experienceMultiplier); // Przyznane punkty doświadczenia
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
      let resultZElement = document.getElementById('huntButton');
      resultZElement.textContent = `Trwa polowanie...`;
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
        
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Znalazles przedmiot: Obronna Tarcza!`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
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
    let resultYElement = document.getElementById('huntButton');
    huntButton.disabled = false;
    resultYElement.innerHTML =`Poluj`;
    let amuletInfo = document.getElementById('amulet-info');
    amuletInfo.textContent = `Amulet Level: ${player.amulet.level}`;
    }, 500);

    } else {
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Masz za mało zdrowia! Kup miksturę!`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
    }

    } else {
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Masz za mało zdrowia! Kup miksturę!`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
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

    let amuletIcon = document.getElementById('amulet-icon');
    amuletIcon.innerHTML = '<i class="bx bxs-analyse bx-md"></i>';
        
    let amuletLevel = document.getElementById('amulet-level');
    amuletLevel.textContent = `Poziom: ${player.amulet.level}`;
    let amuletMulti = document.getElementById('amulet-multiplier');
    amuletMulti.textContent = `Exp +${player.amulet.experienceMultiplier}%`;
    



    


    let levelContainer = document.getElementById('level-info');
    let previousLevel = parseInt(levelContainer.dataset.level || 1);
    expInfo.textContent = `Exp: ${player.experience} / ${player.experienceToNextLevel}`;

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
                let messageText = document.createElement('span');
                messageText.textContent = `Masz maksymalną ilość energii!`;
                resultElement.innerHTML = '';
                resultElement.appendChild(messageText);
                messageText.style.whiteSpace = "pre-line";
                messageText.classList.add('fade-in-out');
                return;
            }

        if (player.stamina + staminaToAdd > player.maxstamina) {
            staminaToAdd = player.maxstamina - player.stamina;
        }

        // Wymiana
        player.gold -= 100;
        player.stamina += staminaToAdd;

        // Wiadomość
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Zakupiono miksturę energii za 100 złota.`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');

        // Push
        updatePlayerInfo();
    } else {
        // Error
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Nie masz wystarczająco złota.`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
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

function upgradeAmulet() {
    // Check if the player has enough gold to upgrade
    if (player.gold >= player.amulet.upgradeCost) {
        // Deduct the gold for the upgrade
        player.gold -= player.amulet.upgradeCost;

        // Increase the amulet level
        player.amulet.level++;

        // Increase the upgrade cost for the next level
        player.amulet.upgradeCost = Math.floor(player.amulet.upgradeCost * 1.5);

        // Increase the experience multiplier
        player.amulet.experienceMultiplier += 1; // You can adjust the multiplier as needed

        // Update player info and save to localStorage
        updatePlayerInfo();
        localStorage.setItem('player', JSON.stringify(player));

        // Display a message about the upgrade
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Amulet został ulepszony do poziomu ${player.amulet.level}!`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');

        
    } else {
        // Display an error message if the player doesn't have enough gold
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Nie masz wystarczająco złota na ulepszenie Amuletu! (${player.amulet.upgradeCost} złota)`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
    }
}

function showMessage(message) {
    let messagesText = document.getElementById('messages-output');
    messagesText.textContent = message;

    // Add and remove a class to trigger the animation
    messagesText.classList.add('fade-in-out');

    // Remove the class after the animation duration (in milliseconds)
    setTimeout(() => {
        messagesText.classList.remove('fade-in-out');
    }, 1000); // Adjust the duration as needed
}



function buyHP() {
    
    // Sprawdzenie czy gracz ma dość złota na zakup.
    if (player.gold >= 50) {

        let healthToAdd = Math.floor(player.maxhealth * 0.5);

        if (player.currenthealth === player.maxhealth) {
            let messageText = document.createElement('span');
            messageText.textContent = `Masz maksymalną ilość zdrowia!`;
            resultElement.innerHTML = '';
            resultElement.appendChild(messageText);
            messageText.style.whiteSpace = "pre-line";
            messageText.classList.add('fade-in-out');
            return;
        }

        if (player.currenthealth + healthToAdd > player.maxhealth) {
            healthToAdd = player.maxhealth - player.currenthealth;
        }
                // Wymiana
                player.gold -= 50;
                player.currenthealth += healthToAdd;
        
                // Wiadomość
                let resultElement = document.getElementById('messages-output');
                let messageText = document.createElement('span');
                messageText.textContent = `Zakupiono miksturę HP za 100 złota.`;
                resultElement.innerHTML = '';
                resultElement.appendChild(messageText);
                messageText.style.whiteSpace = "pre-line";
                messageText.classList.add('fade-in-out');

        // Push
        updatePlayerInfo();
    
    } else {
        // Error
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Nie masz wystarczająco złota.`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
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
                itemElement.style.backgroundColor = 'rgba(157, 224, 255, 0.856)'; // Set the background color for equipped items
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
    player.gold = 99999;
    player.experienceToNextLevel = 100;
    player.stamina = 100;
    player.maxstamina = 100;
    player.currenthealth = 200;
    player.maxhealth = 200;
    player.defense = 1;
    player.luck = 1;
    player.experienceMultiplier = 1;
    player.loot = [
        
    ];
    player.amulet = {
        level: 0,
        upgradeCost: 2000, // Initial upgrade cost
        experienceMultiplier: 0.0, // Initial multiplier
    };
    player.monsterLevelRange = "1-5";
    localStorage.setItem('player', JSON.stringify(player));
    let resultElement = document.getElementById('messages-output');
    let messageText = document.createElement('span');
    messageText.textContent = `Zresetowano poziom gracza.`;
    resultElement.innerHTML = '';
    resultElement.appendChild(messageText);
    messageText.style.whiteSpace = "pre-line";
    messageText.classList.add('fade-in-out');
    updatePlayerInfo();
}




// Inicjalizacja gry
updatePlayerInfo();