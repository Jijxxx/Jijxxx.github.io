let player = JSON.parse(localStorage.getItem('player')) || {
    numHunts: 0,
    level: 1,
    experience: 0,
    gold: 0,
    currenthealth: 200,
    maxhealth: 200,
    stamina: 100,
    maxstamina: 100,
    hpregen: 2,
    energyregen: 1,
    luck: 1,
    defense: 1,
    regenTime: 3000,
    experienceToNextLevel: 100,
    experienceMultiplier: 1.0,
    loot: [],
    amulet: {
        level: 0,
        upgradeCost: 2000, 
        amuletExperienceMultiplier: 0.0,
    },
    monsterLevelRange: "1-5", // Dodaj tę linię z domyślną lokalizacją

};
const equippedItems = [];
const unequippedItems = [];

function getMonsterName(monsterLevel) {
    const monsterNames = {
        1: "Szczur", //bagna
        2: "Trujący Robak",
        3: "Moczarowy Ghul",
        4: "Błotny Ogar",
        5: "Gigantyczna Żaba",
        6: "Złowieszczy Wilk", //las
        7: "Zjawa Lasu",
        8: "Mroczny Łowca",
        9: "Cienista Bestia",
        10: "Potężny Gryf",
        11: "Skalny Golem", //jaskinie
        12: "Jaskiniowy Bazyliszek",
        13: "Kryształowy Nietoperz",
        14: "Mroczny Wąż",
        15: "Oślepiający Młotnik",
        16: "Chłodny Yeti", //góry
        17: "Górski Troll",
        18: "Mglisty Duch",
        19: "Latający Harpagon",
        20: "Skalny Smoczek",
        21: "Piaskowy Skarabeusz", // pustynia
        22: "Pustynny Żmijarz",
        23: "Burzowy Dżin",
        24: "Żywiołak Piasku",
        25: "Koralowy Skorpion",


        // 
    };

    return monsterNames[monsterLevel] || "Nieznana kreatura!";
}


// Dostępne lokalizacje
let currentLocationIndex = 0;

const locations = [
    { name: "Bagna", minLevel: 1 },
    { name: "Ciemny las", minLevel: 6 },
    { name: "Jaskinie", minLevel: 11 },
    { name: "Mgliste Góry", minLevel: 16 },
    { name: "Pustynia", minLevel: 21 }
];

function changeLocation(index) {
    const selectedLocation = locations[index];
    let minRequiredLevel = selectedLocation.minLevel;

    if (player.level >= minRequiredLevel) {
        currentLocationIndex = index;
        updateSelectedLocation();
        updateMinLevel();
        updateMonsterLevel();
        let resultElement = document.getElementById('result');
        resultElement.innerHTML = `
        Wybrano lokację: <span style="color: #ffe77d;">${selectedLocation.name}</span>

        `;
        resultElement.style.whiteSpace = "pre-line";
        

    } else {
        // Alert
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Musisz mieć co najmniej poziom ${minRequiredLevel} by wybrać polowanie na terenach ${selectedLocation.name}.`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
        let resultXElement = document.getElementById('result');
        resultXElement.innerHTML = `
        Zbyt mały poziom na lokację: <span style="color: #ffe77d;">${selectedLocation.name}</span>

        `;
        resultElement.style.whiteSpace = "pre-line";
    }
}

function updateSelectedLocation() {
    const selectedLocationElement = document.getElementById('selected-location');
    selectedLocationElement.textContent = locations[currentLocationIndex].name;

    // Dodane - usuwa klasę 'active' ze wszystkich przycisków
    document.querySelectorAll('.location-button').forEach(button => {
        button.classList.remove('active');
    });

    // Dodane - dodaje klasę 'active' do aktualnie klikniętego przycisku
    document.querySelector('.location-button:nth-child(' + (currentLocationIndex + 1) + ')').classList.add('active');
}

function updateMinLevel() {
    const minLevelElement = document.getElementById('min-level');
    if (minLevelElement) {
        minLevelElement.textContent = locations[currentLocationIndex].minLevel;
    }
}

function updateMonsterLevel() {
    const selectedLocation = locations[currentLocationIndex];
    let selectedRange = `${selectedLocation.minLevel}-${selectedLocation.minLevel + 4}`;
    player.monsterLevelRange = selectedRange; // Dodaj tę linię do zaktualizowania wartości

    // Pomocnicza funkcja getMinRequiredLevel - sprawdza minimalny poziom na podstawie zakresu
    function getMinRequiredLevel(range) {
        const minLevels = {
            "1-5": 1,
            "6-10": 6,
            "11-15": 11,
            "16-20": 16,
            "21-30": 21
        };
        return minLevels[range] || 1;
    }

    let minRequiredLevel = getMinRequiredLevel(selectedRange);

    if (player.level >= minRequiredLevel) {
        // Zaktualizuj info playera
        updatePlayerInfo();
        let resultElement = document.getElementById('result');
        resultElement.textContent = "";
    } else {
        // Alert
        alert(`Musisz mieć co najmniej poziom ${minRequiredLevel} by wybrać polowanie na terenach ${selectedRange} poziomu.`);
        // Przywróć poprzednią lokalizację, ponieważ nowa jest niedostępna
        currentLocationIndex = locations.findIndex(loc => loc.name === player.monsterLevelRange.split('-')[0]);
        updateSelectedLocation();
        updateMinLevel();
    }
}


// Inicjalizacja przycisków na stronie
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.location-button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => changeLocation(index));
    });
});

// Inicjalizacja przycisków na stronie
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.location-button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => changeLocation(index));
    });
});

function hunt() {

    let monsterLevelRange = player.monsterLevelRange.split('-');
    let minMonsterLevel = parseInt(monsterLevelRange[0]);
    let maxMonsterLevel = parseInt(monsterLevelRange[1]);

    // Symulacja walki i przyznawania punktów doświadczenia oraz złota
    let xpMulti = (player.experienceMultiplier).toFixed(2);
    let monsterLevel = Math.floor(Math.random() * (maxMonsterLevel - minMonsterLevel + 1)) + minMonsterLevel;
    let baseExperienceGain = Math.floor(monsterLevel * 10 * (xpMulti + player.amulet.experienceMultiplier));
    let randomFactor = 1.5 + Math.random() * 1.5;
    let amuletBonus = player.amulet.experienceMultiplier;
    let experienceGain = Math.floor((baseExperienceGain + amuletBonus) * randomFactor);
    let minGold = monsterLevel * 10;
    let maxGold = monsterLevel * 12;
    let goldGain = Math.floor(Math.random() * (maxGold - minGold)) + minGold; // Przyznane złoto
    let monsterAttack = monsterLevel * 7;
    let hplost = Math.max(monsterAttack - (player.defense - monsterLevel), 0);
    let energylost = Math.floor(5.0 + Math.random() * 10);

    if (player.stamina >= energylost ) {

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
        player.hpregen += 2;
        player.energyregen += 1;
        player.experienceToNextLevel = calculateExperienceToNextLevel();
    }
/*
    const lootPool = [
        { type: 'shield', name: 'Zwykła tarcza (obrona)', equipped: false, rarity: 1, boxShadow: '' },
        { type: 'helmet', name: 'Zwykły hełm (czas regeneracji)', equipped: false, rarity: 1, boxShadow: '' },
        { type: 'armor', name: 'Zwykła zbroja(HP)', equipped: false, rarity: 1, boxShadow: '' },
        { type: 'belt', name: 'Zwykły pasek(regeneracja HP)', equipped: false, rarity: 1, boxShadow: '' },
        { type: 'ring', name: 'Zwykły pierścień(regeneracja energii)', equipped: false, rarity: 1, boxShadow: '' },
        // tu dodaj więcej itemków
    ]; */
    
    function getRandomItem() {
        const rarityChances = {
            1: 20,
            2: 20,
            3: 20,
            4: 20,
            5: 20,
        };
    
        const rarity = getRandomRarity(rarityChances);
        const type = getRandomType();
        const itemsForRarity = lootPool[rarity];
        
        // Check if there are items defined for the selected rarity
        if (itemsForRarity && itemsForRarity.length > 0) {
            // Choose a random item from the predefined list for the selected rarity
            const randomIndex = Math.floor(Math.random() * itemsForRarity.length);
            const item = itemsForRarity[randomIndex];
    
            // Add logging to check the generated item
            console.log('Random item:', item);
    
            return item;
        } else {
            console.error(`No items defined for rarity ${rarity}`);
            return { name: 'Default Item', type: 'default', equipped: false, rarity: 1 }; // Provide a default item if no items are defined
        }
    }

    function getRandomRarity(chances) {
        const totalChances = Object.values(chances).reduce((total, chance) => total + chance, 0);
        let random = Math.floor(Math.random() * totalChances) + 1;
    
        for (const [rarity, chance] of Object.entries(chances)) {
            random -= chance;
            if (random <= 0) {
                return parseInt(rarity);
            }
        }
    }

    function getRandomType() {
        // Implement the logic to get a random type
        return ['shield', 'armor', 'belt', 'helmet', 'ring'][Math.floor(Math.random() * 5)];
    }

    const lootPool = {
        1: [
            { type: 'shield', name: 'Zwykła tarcza (obrona)', equipped: false, rarity: 1 },
            { type: 'helmet', name: 'Zwykły hełm (szczescie)', equipped: false, rarity: 1 },
            { type: 'armor', name: 'Zwykła zbroja (HP)', equipped: false, rarity: 1 },
            { type: 'belt', name: 'Zwykły pasek (regeneracja HP)', equipped: false, rarity: 1 },
            { type: 'ring', name: 'Zwykły pierścień (regeneracja energii)', equipped: false, rarity: 1 },
            // Add more items for rarity 1
        ],
        2: [
            { type: 'shield', name: 'Wzmocniona tarcza+1 (obrona)', equipped: false, rarity: 2 },
            { type: 'helmet', name: 'Wzmocniony hełm+1 (szczescie)', equipped: false, rarity: 2 },
            { type: 'armor', name: 'Wzmocniona zbroja+1 (HP)', equipped: false, rarity: 2 },
            { type: 'belt', name: 'Wzmocniony pasek+1 (regeneracja HP)', equipped: false, rarity: 2 },
            { type: 'ring', name: 'Wzmocniony pierścień+1 (regeneracja energii)', equipped: false, rarity: 2 },
            // Add more items for rarity 2
        ],
        3: [
            { type: 'shield', name: 'Magiczna tarcza+2 (obrona)', equipped: false, rarity: 3 },
            { type: 'helmet', name: 'Magiczny hełm+2 (szczescie)', equipped: false, rarity: 3 },
            { type: 'armor', name: 'Magiczna zbroja+2 (HP)', equipped: false, rarity: 3 },
            { type: 'belt', name: 'Magiczny pasek+2 (regeneracja HP)', equipped: false, rarity: 3 },
            { type: 'ring', name: 'Magiczny pierścień+2 (regeneracja energii)', equipped: false, rarity: 3 },

        ],
        4: [
            { type: 'shield', name: 'Legendarna tarcza+3 (obrona)', equipped: false, rarity: 4 },
            { type: 'helmet', name: 'Legendarny hełm+3 (szczescie)', equipped: false, rarity: 4 },
            { type: 'armor', name: 'Legendarna zbroja+3 (HP)', equipped: false, rarity: 4 },
            { type: 'belt', name: 'Legendarny pasek+3 (regeneracja HP)', equipped: false, rarity: 4 },
            { type: 'ring', name: 'Legendarny pierścień+3 (regeneracja energii)', equipped: false, rarity: 4 },

        ],
        5: [
            { type: 'shield', name: 'Mityczna tarcza+4 (obrona)', equipped: false, rarity: 5 },
            { type: 'helmet', name: 'Mityczny hełm+4 (szczescie)', equipped: false, rarity: 5 },
            { type: 'armor', name: 'Mityczna zbroja+4 (HP)', equipped: false, rarity: 5 },
            { type: 'belt', name: 'Mityczny pasek+4 (regeneracja HP)', equipped: false, rarity: 5 },
            { type: 'ring', name: 'Mityczny pierścień+4 (regeneracja energii)', equipped: false, rarity: 5 },

        ]
        // Add entries for other rarities
    };
    


    if (Math.random() < player.luck / 50) {
        if (!player.loot) {
            player.loot = [];
        }
    
        const randomItem = getRandomItem();
    
        if (randomItem && randomItem.name && randomItem.rarity) {
            
    
            let resultElement = document.getElementById('messages-output');
            let messageText = document.createElement('span');
            messageText.textContent = `Znalazłeś przedmiot: ${randomItem.name}!`;
            resultElement.innerHTML = '';
            resultElement.appendChild(messageText);
            messageText.style.whiteSpace = "pre-line";
            messageText.classList.add('fade-in-out');
            player.loot.push(randomItem);
        } else {
            console.error('Invalid randomItem:', randomItem);
            // Handle the case where randomItem is undefined or missing properties
        }
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
        messageText.textContent = `Masz za mało energii! Kup miksturę!`;
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
        requiredExperience += Math.ceil(requiredExperience++);
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

    let playerHPregen = document.getElementById('player-hpregen');
    playerHPregen.textContent = `${player.hpregen}`;
    let playerEnergyRegen = document.getElementById('player-energyregen');
    playerEnergyRegen.textContent = `${player.energyregen}`;

    //
    
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
                let resultElement = document.getElementById('messages-output');
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

    player.stamina += player.energyregen;

    // sprawdzenie czy nie przekracza maxa
    if (player.stamina > player.maxstamina) {
        player.stamina = player.maxstamina;
    }
    updatePlayerInfo();
}

// czas regeneracji


// Regeneracja HP
function regenerateHealth() {

    player.currenthealth += player.hpregen;

    // sprawdzenie czy nie przekracza maxa
    if (player.currenthealth > player.maxhealth) {
        player.currenthealth = player.maxhealth;
    }
    updatePlayerInfo();
}
setInterval(regenerateStamina, player.regenTime); // 1000ms = 1s
setInterval(regenerateHealth, player.regenTime); // 1000ms = 1s
updatePlayerInfo();
console.log(player.regenTime);

function upgradeAmulet() {
    
    if (player.gold >= player.amulet.upgradeCost) {
        
        player.gold -= player.amulet.upgradeCost;
        player.amulet.level++;

        player.amulet.upgradeCost = Math.floor(player.amulet.upgradeCost * 1.1);

        player.amulet.experienceMultiplier += 1; //
        updatePlayerInfo();
        localStorage.setItem('player', JSON.stringify(player));

        // Msg
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
            let resultElement = document.getElementById('messages-output');
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


function equipItem(item) {
    const existingEquippedItem = player.loot.find(
        (existingItem) => existingItem.type === item.type && existingItem.equipped
    );

    // Check if there is an existing equipped item of the same type
    if (existingEquippedItem) {
        // Check if the existing item has the same rarity
        if (existingEquippedItem.rarity === item.rarity) {
            console.log('Item of the same type and rarity already equipped.');
            return;
        }

        // Unequip currently equipped item of the same type, if any
        existingEquippedItem.equipped = false;

        // Remove bonuses based on the unequipped item
        removeItemBonuses(existingEquippedItem);
        updatePlayerInfo();
        displayInventoryItems();
    }

    // Equip the selected item
    item.equipped = true;

    // Apply bonuses based on the equipped item
    applyItemBonuses(item);

    // Update the player info and inventory display
    updatePlayerInfo();
    displayInventoryItems();

    // Add these console.log statements
    console.log('Equipped items:', equippedItems);
    console.log('Unequipped items:', unequippedItems);
}

function unequipItem(item) {

    // Check if the item is already equipped
    if (item.equipped) {
        // Unequip the item
        item.equipped = false;

        // Remove bonuses based on the unequipped item
        removeItemBonuses(item);

        // Update the player info and inventory display
        updatePlayerInfo();
        displayInventoryItems();

        // Add any additional logic you may need for handling unequipping
    }
}

function applyItemBonuses(item) {
    const rarityMultiplier = getRarityMultiplier(item.rarity);

    switch (item.type) {
        case 'shield':
            player.defense += 10 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'helmet':
            player.luck += 1 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'armor':
            player.maxhealth += 300 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'belt':
            player.hpregen += 3 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'ring':
            player.energyregen += 2 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        // Add other cases for different item types
    }
    player.defense = parseFloat(player.defense.toFixed(0));
    player.luck = parseFloat(player.luck.toFixed(0));
    player.maxhealth = parseFloat(player.maxhealth.toFixed(0));
    player.hpregen = parseFloat(player.hpregen.toFixed(0));
    player.energyregen = parseFloat(player.energyregen.toFixed(0));
}

// Function to get the rarity multiplier
function getRarityMultiplier(rarity) {
    // Define rarity multipliers based on your desired scaling
    const rarityMultipliers = {
        1: 1,
        2: 2,
        3: 3,
        4: 6,
        5: 10,
    };

    // Return the appropriate multiplier based on the rarity
    return rarityMultipliers[rarity] || 1;
}

// Function to remove item bonuses
function removeItemBonuses(item) {
    const rarityMultiplier = getRarityMultiplier(item.rarity);
    switch (item.type) {
        case 'shield':
            player.defense -= 10 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'helmet':
            player.luck -= 1 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'armor':
            player.maxhealth -= 300 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'belt':
            player.hpregen -= 3 * rarityMultiplier; // Adjust the bonus value as needed
            break;
        case 'ring':
            player.energyregen -= 2 * rarityMultiplier; // Adjust the bonus value as needed
            break;
    }
}



function displayInventoryItems() {
    let equippedItemsContainer = document.getElementById('equipped-items-container');
    let unequippedItemsContainer = document.getElementById('unequipped-items-container');
    equippedItemsContainer.innerHTML = '';
    unequippedItemsContainer.innerHTML = '';

    displayItemsByType(true); // Display equipped items
    displayItemsByType(false); // Display unequipped items

    function displayItemsByType(equipped) {
        if (player.loot && player.loot.length > 0) {
            for (let i = 0; i < player.loot.length; i++) {
                let item = player.loot[i];
                if (item.equipped === equipped) {
                    let itemElement = document.createElement('div');
                    itemElement.classList.add('inventory-item');

                    // Create an icon element with the bx icon class
                    let iconElement = document.createElement('i');

                    // Set the appropriate icon based on the item type
                    switch (item.type) {
                        case 'shield':
                            iconElement.className = 'bx bx-shield-alt bx-lg';
                            break;
                        case 'armor':
                            iconElement.className = 'bx bx-universal-access bx-lg';
                            break;
                        case 'belt':
                            iconElement.className = 'bx bx-toggle-left bx-lg';
                            break;
                        case 'helmet':
                            iconElement.className = 'bx bx-hard-hat bx-lg';
                            break;
                        case 'ring':
                            iconElement.className = 'bx bx-doughnut-chart bx-lg';
                            break;
                        // Add other cases for different potion types
                    }

                    // Set the box shadow based on rarity
                        switch (item.rarity) {
                        case 1:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px gray;';
                            break;
                        case 2:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px lightskyblue';
                            break;
                        case 3:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px gold';
                            break;
                        case 4:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px magenta';
                            break;
                        case 5:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px crimson';
                            break;
            // Add more cases for different rarities if needed
        }

                    itemElement.appendChild(iconElement);

                    // Set the title attribute for the item name (tooltip)
                    itemElement.title = item.name;
                    // Display equipped status and handle item click
                    if (item.equipped) {
                        itemElement.addEventListener('click', () => unequipItem(item));
                        itemElement.classList.add('equipped-item');
                        
                        equippedItemsContainer.appendChild(itemElement);
                    } else {
                        itemElement.addEventListener('click', () => equipItem(item));
                        unequippedItemsContainer.appendChild(itemElement);
                    }
                }
            }
        } else {
            // Error: empty inventory
            equippedItemsContainer.innerHTML = 'Brak założonych przedmiotów.';
            unequippedItemsContainer.innerHTML = 'Brak przedmiotów do założenia.';
        }
    }
}

function openInventory() {
    document.getElementById('inventory-modal').style.display = 'block';
    displayInventoryItems();
    updatePlayerInfo();
}

function closeInventory() {
    document.getElementById('inventory-modal').style.display = 'none';
    updatePlayerInfo();
}

function upgradeItemRarity(item) {
    // Check if the player has enough gold for the upgrade
    const upgradeCost = 2000; // Adjust the cost as needed
    if (player.gold >= upgradeCost) {
        player.gold -= upgradeCost;


        // Adjust color based on rarity
        switch (item.rarity) {
            case 2:
                item.boxShadow = 'inset 0px 0px 5px 5px rgba(3, 139, 253, 1)'; // Adjust the color for rarity 2
                break;
            case 3:
                item.boxShadow = 'inset 0px 0px 5px 5px rgb(3, 103, 253)'; // Adjust the color for rarity 3
                break;
            case 4:
                item.boxShadow = 'inset 0px 0px 5px 5px rgb(140, 3, 253)'; // Adjust the color for rarity 3
                break;
            case 5:
                item.boxShadow = 'inset 0px 0px 5px 5px rgb(253, 3, 3)'; // Adjust the color for rarity 3
                break;
            // Add more cases for higher rarities as needed
        }

        // Update player info and inventory display
        updatePlayerInfo();
        displayInventoryItems();

        // Display a success message
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Przedmiot został ulepszony!`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
    } else {
        // Display an error message if the player doesn't have enough gold

        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Nie masz wystarczająco złota na ulepszenie przedmiotu! (Koszt: ${upgradeCost} złota)`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
    }
}



updatePlayerInfo();

document.getElementById('admin-button').addEventListener('click', () => {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.style.visibility = adminPanel.style.visibility === 'hidden' ? 'visible' : 'hidden';
});


function adminAddGold(){
    player.gold += 99999;
    let resultElement = document.getElementById('messages-output');
    let messageText = document.createElement('span');
    messageText.textContent = `Dodano 99999 złota.`;
    resultElement.innerHTML = '';
    resultElement.appendChild(messageText);
    messageText.style.whiteSpace = "pre-line";
    messageText.classList.add('fade-in-out');
    updatePlayerInfo();
}

function adminAddLevel(){
    player.level++;
    player.experienceMultiplier += 0.2;
    player.luck += 1;
    player.defense += 1;
    let resultElement = document.getElementById('messages-output');
    let messageText = document.createElement('span');
    messageText.textContent = `Dodano 1 poziom.`;
    resultElement.innerHTML = '';
    resultElement.appendChild(messageText);
    messageText.style.whiteSpace = "pre-line";
    messageText.classList.add('fade-in-out');
    
    updatePlayerInfo();
}

function adminAddAmuletLvl(){
    player.amulet.level++;
    player.amulet.experienceMultiplier += 1;
    let resultElement = document.getElementById('messages-output');
    let messageText = document.createElement('span');
    messageText.textContent = `Ulepszono amulet o 1 poziom.`;
    resultElement.innerHTML = '';
    resultElement.appendChild(messageText);
    messageText.style.whiteSpace = "pre-line";
    messageText.classList.add('fade-in-out');
    updatePlayerInfo();
}
function adminAddHP(){
    player.maxhealth += 1000;
    player.currenthealth += 1000;
    let resultElement = document.getElementById('messages-output');
    let messageText = document.createElement('span');
    messageText.textContent = `Dodano 1000 HP.`;
    resultElement.innerHTML = '';
    resultElement.appendChild(messageText);
    messageText.style.whiteSpace = "pre-line";
    messageText.classList.add('fade-in-out');
    updatePlayerInfo();
}

function adminAddStamina(){
    player.maxstamina += 1000;
    player.stamina += 1000;
    let resultElement = document.getElementById('messages-output');
    let messageText = document.createElement('span');
    messageText.textContent = `Dodano 1000 energii.`;
    resultElement.innerHTML = '';
    resultElement.appendChild(messageText);
    messageText.style.whiteSpace = "pre-line";
    messageText.classList.add('fade-in-out');
    updatePlayerInfo();
}

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
    player.hpregen = 3;
    player.energyregen = 2;
    player.regenTime = 3000;
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
    player.monsterLevelRange = "1-5"; // Dodaj tę linię z domyślną lokalizacją
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