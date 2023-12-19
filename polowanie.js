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
        upgradeCost: 1000, 
        amuletExperienceMultiplier: 0,
    },
    monsterLevelRange: "1-10",
    statPoints: 0,// Początkowa liczba punktów do rozdania
    strength: 0,
    vitality: 0,
    agility: 0,
    intelligence: 0,
    

};
const equippedItems = [];
const unequippedItems = [];
let goldAmount;
let statPoints = 0;
let strength = 0;
let vitality = 0;
let agility = 0;
let intelligence = 0;
let locationType = 'locations';

function getMonsterName(monsterLevel) {
    const monsterNames = {
        1: "Szczur", //bagna
        2: "Trujący Robak",
        3: "Moczarowy Ghul",
        4: "Błotny Ogar",
        5: "Gigantyczna Żaba",
        6: "Upiór Mokradłowy",
        7: "Brudny Zębacz",
        8: "Upiorna Larwa",
        9: "Bagnista Wiedźma",
        10: "Błotołaz",
        11: "Złowieszczy Wilk", //las
        12: "Zjawa Lasu",
        13: "Mroczny Łowca",
        14: "Cienista Bestia",
        15: "Potężny Gryf",
        16: "Dziki Wilkołak",
        17: "Złowieszczy Kruk",
        18: "Trujący Pająk",
        19: "Mściwa Wróżka",
        20: "Ponury Drzewiec",
        21: "Skalny Golem", //jaskinie
        22: "Jaskiniowy Bazyliszek",
        23: "Kryształowy Nietoperz",
        24: "Mroczny Wąż",
        25: "Oślepiający Młotnik",
        26: "Koralowe Widmo",
        27: "Skalny Demon",
        28: "Cienisty Gargulec",
        29: "Prastary Szkielet",
        30: "Mroczny Krasnolud",
        31: "Chłodny Yeti", //góry
        32: "Górski Troll",
        33: "Mglisty Duch",
        34: "Latający Harpagon",
        35: "Skalny Smoczek",
        36: "Zamarznięty Upiór",
        37: "Obsydianowy Łowca",
        38: "Śnieżny Żniwiarz",
        39: "Latający Jaszczur",
        40: "Tytan Gór",
        41: "Piaskowy Skarabeusz", // pustynia
        42: "Pustynny Żmijarz",
        43: "Burzowy Dżin",
        44: "Żywiołak Piasku",
        45: "Koralowy Skorpion",
        46: "Bestia Skalna",
        47: "Złodziej Cienia",
        48: "Pyłowy Duch",
        49: "Wilk Wiatru",
        50: "Piaskowy Sfinks",


        // 
    };

    return monsterNames[monsterLevel] || "Nieznana kreatura!";
}


// Dostępne lokalizacje
let currentLocationIndex = 0;

const locations = [
    { name: "Bagna", minLevel: 1 },
    { name: "Ciemny las", minLevel: 11 },
    { name: "Jaskinie", minLevel: 21 },
    { name: "Mgliste Góry", minLevel: 31 },
    { name: "Pustynia", minLevel: 41 },
    { name: "Dungeon1", minLevel: 20 },
    { name: "Dungeon2", minLevel: 20 },
    { name: "Dungeon3", minLevel: 20 },
];

function changeLocationType() {
    const selectedType = document.getElementById('location-type').value;
    locationType = selectedType;

    // Toggle the visibility of location buttons based on the selected type
    document.getElementById('locations-buttons').style.display = (selectedType === 'locations') ? 'block' : 'none';
    document.getElementById('dungeons-buttons').style.display = (selectedType === 'dungeons') ? 'block' : 'none';
}

function changeLocation(index) {
    const selectedLocation = locations[index];
    let minRequiredLevel = selectedLocation.minLevel;

    if (locationType === 'locations') {
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
}}


function calculateExperienceToNextLevel() { //exp do nastepnego levela
    let requiredExperience = 100;

    for (let i = 2; i <= player.level; i++) {
        requiredExperience += Math.ceil(requiredExperience*0.7);
    }

    return requiredExperience;
}

function dungeonHunt() {
        let dungeonLevel = player.level * 10;
        let randomFactor = 3 + Math.random() * 10;
        let dungeonExp = Math.floor((dungeonLevel * 1000) * randomFactor);
        let minGold = dungeonLevel * 100;
        let maxGold = dungeonLevel * 200;
        let goldGain = Math.floor(Math.random() * (maxGold - minGold)) + minGold; // Przyznane złoto
        let monsterAttack = dungeonLevel * 20;
        let hplost = Math.max(monsterAttack - (player.defense), 0);
        let energylost = Math.floor(dungeonLevel * 10);
        
        if (player.level >= 20){

        if (player.stamina >= energylost ) {
    
            if (player.currenthealth > hplost) {

        
        let dungeonButton = document.getElementById("dungeon-button");
        if (dungeonButton.disabled) {
            return;
          }
          dungeonButton.textContent = `⚔️ Trwa ⚔️`;
          dungeonButton.disabled = true;
          setTimeout(function() {
    
            player.experience += dungeonExp;
            player.gold += goldGain;
            player.stamina -= energylost;
            player.currenthealth -= hplost;
            

        // Zapis danych gracza w local storage
        localStorage.setItem('player', JSON.stringify(player));
    
        let resultElement = document.getElementById('result');
        resultElement.innerHTML = `
        Raport po walce w dungeonie: <span style="color: #ffe77d;">Podziemia 1</span>
        Pomyślnie ukończono walkę z wszystkimi potworami.
        Otrzymujesz <span style="color: rgb(255, 114, 58)">${hplost}</span> punktów obrażeń!
        Zdobyto <span style="color: rgb(30, 238, 30);">${dungeonExp}</span> doświadczenia
        Znaleziono <span style="color: #ffd000bb;">${goldGain}</span> sztuk złota<br>
        Wykorzystano <span style="color: #cb7cff;">${energylost}</span> energii.
        `;
        resultElement.style.whiteSpace = "pre-line";
    
    
        
        dungeonButton.disabled = false;
        dungeonButton.innerHTML =`🏰 Podziemia`;
        }, 1000 * 60 * 1); //cooldown dungeon
    
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
        displayInventoryItems();
        updatePlayerInfo();
        calculateExperienceToNextLevel();
    
    } else {
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `ZA NISKI LEVEL :)`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');
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
    let selectedRange = `${selectedLocation.minLevel}-${selectedLocation.minLevel + 9}`;
    player.monsterLevelRange = selectedRange; // Dodaj tę linię do zaktualizowania wartości

    // Pomocnicza funkcja getMinRequiredLevel - sprawdza minimalny poziom na podstawie zakresu
    function getMinRequiredLevel(range) {
        const minLevels = {
            "1-10": 1,
            "11-20": 11,
            "21-30": 21,
            "31-40": 31,
            "41-50": 41,
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

function hunt() {


    let monsterLevelRange = player.monsterLevelRange.split('-');
    let minMonsterLevel = parseInt(monsterLevelRange[0]);
    let maxMonsterLevel = parseInt(monsterLevelRange[1]);

    // Symulacja walki i przyznawania punktów doświadczenia oraz złota
    let xpMulti = (player.experienceMultiplier).toFixed(2);
    let monsterLevel = Math.floor(Math.random() * (maxMonsterLevel - minMonsterLevel + 1)) + minMonsterLevel;
    let baseExperienceGain = Math.floor( monsterLevel * 15 * (xpMulti + player.amulet.experienceMultiplier));
    let randomFactor = 1 + Math.random() * 2;
    let amuletBonus = player.amulet.experienceMultiplier;
    let displayExp = Math.floor(baseExperienceGain * randomFactor);
    let experienceGain = Math.floor((baseExperienceGain * randomFactor) + amuletBonus);
    let minGold = monsterLevel * 15;
    let maxGold = monsterLevel * 40;
    let goldGain = Math.floor(Math.random() * (maxGold - minGold)) + minGold; // Przyznane złoto
    let monsterAttack = monsterLevel * 7;
    let hplost = Math.max(monsterAttack - (player.defense - monsterLevel), 0);
    let energylost = Math.floor(10.0 + Math.random() * 20);

    if (player.stamina >= energylost ) {

        if (player.currenthealth > hplost) {

        
    let huntButton = document.getElementById("huntButton");
    if (huntButton.disabled) {
        return;
      }
      let resultZElement = document.getElementById('huntButton');
      resultZElement.textContent = `⚔️ Trwa polowanie... ⚔️`;
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
        player.maxhealth += 45;
        player.maxstamina += 20;
        player.luck += 0.25;
        player.defense += 2;
        player.hpregen += 5;
        player.energyregen += 3;
        player.experienceToNextLevel = calculateExperienceToNextLevel();
        player.statPoints += 2;
    }
    
    function getRandomItem() { // RZADKOŚĆ SZANSA DROPA
        const rarityChances = {
            1: 65,
            2: 20, //85
            3: 9, //94
            4: 4.5, //98.5
            5: 1, //99.5
            6: 0.5, //100
        };
    
        const rarity = getRandomRarity(rarityChances);
        const type = getRandomType();
        const itemsForRarity = lootPool[rarity];
        
        if (itemsForRarity && itemsForRarity.length > 0) {

            const randomIndex = Math.floor(Math.random() * itemsForRarity.length);
            const item = itemsForRarity[randomIndex];
    
            console.log('Random item:', item);
    
            return item;
        } else {
            console.error(`No items defined for rarity ${rarity}`);
            return { name: 'Default Item', type: 'default', equipped: false, rarity: 1 }; 
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
            { type: 'armor', name: 'Zwykła zbroja (HP&Energia)', equipped: false, rarity: 1 },
            { type: 'belt', name: 'Zwykły pasek (regeneracja HP)', equipped: false, rarity: 1 },
            { type: 'ring', name: 'Zwykły pierścień (regeneracja energii)', equipped: false, rarity: 1 },
            // Add 
        ],
        2: [
            { type: 'shield', name: 'Wzmocniona tarcza+1 (obrona)', equipped: false, rarity: 2 },
            { type: 'helmet', name: 'Wzmocniony hełm+1 (szczescie)', equipped: false, rarity: 2 },
            { type: 'armor', name: 'Wzmocniona zbroja+1 (HP&Energia)', equipped: false, rarity: 2 },
            { type: 'belt', name: 'Wzmocniony pasek+1 (regeneracja HP)', equipped: false, rarity: 2 },
            { type: 'ring', name: 'Wzmocniony pierścień+1 (regeneracja energii)', equipped: false, rarity: 2 },
            // Add 
        ],
        3: [
            { type: 'shield', name: 'Magiczna tarcza+2 (obrona)', equipped: false, rarity: 3 },
            { type: 'helmet', name: 'Magiczny hełm+2 (szczescie)', equipped: false, rarity: 3 },
            { type: 'armor', name: 'Magiczna zbroja+2 (HP&Energia)', equipped: false, rarity: 3 },
            { type: 'belt', name: 'Magiczny pasek+2 (regeneracja HP)', equipped: false, rarity: 3 },
            { type: 'ring', name: 'Magiczny pierścień+2 (regeneracja energii)', equipped: false, rarity: 3 },

        ],
        4: [
            { type: 'shield', name: 'Legendarna tarcza+3 (obrona)', equipped: false, rarity: 4 },
            { type: 'helmet', name: 'Legendarny hełm+3 (szczescie)', equipped: false, rarity: 4 },
            { type: 'armor', name: 'Legendarna zbroja+3 (HP&Energia)', equipped: false, rarity: 4 },
            { type: 'belt', name: 'Legendarny pasek+3 (regeneracja HP)', equipped: false, rarity: 4 },
            { type: 'ring', name: 'Legendarny pierścień+3 (regeneracja energii)', equipped: false, rarity: 4 },

        ],
        5: [
            { type: 'shield', name: 'Mityczna tarcza+4 (obrona)', equipped: false, rarity: 5 },
            { type: 'helmet', name: 'Mityczny hełm+4 (szczescie)', equipped: false, rarity: 5 },
            { type: 'armor', name: 'Mityczna zbroja+4 (HP&Energia)', equipped: false, rarity: 5 },
            { type: 'belt', name: 'Mityczny pasek+4 (regeneracja HP)', equipped: false, rarity: 5 },
            { type: 'ring', name: 'Mityczny pierścień+4 (regeneracja energii)', equipped: false, rarity: 5 },

        ],
        6: [
            { type: 'shield', name: 'Pierwotna tarcza+5 (obrona)', equipped: false, rarity: 6 },
            { type: 'helmet', name: 'Pierwotny hełm+5 (szczescie)', equipped: false, rarity: 6 },
            { type: 'armor', name: 'Pierwotna zbroja+5 (HP&Energia)', equipped: false, rarity: 6 },
            { type: 'belt', name: 'Pierwotny pasek+5 (regeneracja HP)', equipped: false, rarity: 6 },
            { type: 'ring', name: 'Pierwotny pierścień+5 (regeneracja energii)', equipped: false, rarity: 6 },

        ]
        // Add 
    };
    


    if (Math.random() < player.luck / 150) { //ogólna szansa na drop
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

        }
    }

    // Zapis danych gracza w local storage
    localStorage.setItem('player', JSON.stringify(player));

    // Wyświetlenie wyniku walki
    let resultElement = document.getElementById('result');
    let monsterName = getMonsterName(monsterLevel);
    resultElement.innerHTML = `~ Walka z potworem ~<br>
        <span style="color: #ffe77d;">${monsterName}</span> (lvl: <span style="color: #7fc1ff;">${monsterLevel}</span>, atak: <span style="color: #ff7158;">${monsterAttack}</span>) <br>
        Twoja obrona: ${player.defense}, otrzymujesz <span style="color: rgb(255, 114, 58)">${hplost}</span> punktów obrażeń!<br>
        Zdobyto <span style="color: rgb(30, 238, 30);">${displayExp}</span> doświadczenia<br>
        Bonus amuletu: <span style="color: rgb(30, 238, 30);">${amuletBonus}</span> doświadczenia<br>
        Znaleziono <span style="color: #ffd000bb;">${goldGain}</span> sztuk złota<br>
        Wykorzystano <span style="color: #cb7cff;">${energylost}</span> energii.`;
        resultElement.style.whiteSpace = "pre-line";


    let resultXElement = document.getElementById('resultX');
    resultXElement.textContent = "";

    
    
    updatePlayerInfo();
    let resultYElement = document.getElementById('huntButton'); //cooldown na polowanie
    huntButton.disabled = false;
    resultYElement.innerHTML =`⚔️ Poluj ⚔️`;
    }, 50);

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
    displayInventoryItems();


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
    healthInfo.textContent = `${player.currenthealth} / ${player.maxhealth}`;


    let goldAmount = document.getElementById('gold-amount');
    goldAmount.innerHTML = `${player.gold}`;

    let staminaAmount = document.getElementById('stamina-amount');
    staminaAmount.textContent = `${player.stamina} / ${player.maxstamina}`;

    let playerAttack = document.getElementById('player-luck');
    playerAttack.textContent = `${player.luck}`;

    let playerDefense = document.getElementById('player-defense');
    playerDefense.textContent = `${player.defense}`;

    let numHuntsElement = document.getElementById('num-hunts');
    numHuntsElement.textContent = `${player.numHunts}`;


    let amuMultiPlier = document.getElementById('amulet-multiplier');
    let amuletBonus = player.amulet.experienceMultiplier;
    let amuletLevel = player.amulet.level;
    amuMultiPlier.innerHTML = `Poziom: ${amuletLevel}
    Exp: +${amuletBonus}`
    amuMultiPlier.style.whiteSpace = "pre-line";

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
    goldAmount.innerHTML = `${player.gold}`;
    updateStatDisplay();
}
var statPts = player.statPoints;
function updateStatDisplay() {
    document.getElementById('stat-points').innerText = player.statPoints;
    document.getElementById('strength-value').innerText = player.strength;
    document.getElementById('vitality-value').innerText = player.vitality;
    document.getElementById('agility-value').innerText = player.agility;
    document.getElementById('intelligence-value').innerText = player.intelligence;

}

function increaseStat(stat) {
    if (player.statPoints > 0) {
        switch (stat) {
            case 'strength':
                player.strength++;
                player.defense += 6;
                break;
            case 'vitality':
                player.vitality++;
                player.maxhealth += 150;
                player.hpregen += 30;
                break;
            case 'agility':
                player.agility++;
                player.luck += 3;
                break;
            case 'intelligence':
                player.intelligence++;
                player.maxstamina += 80;
                player.energyregen += 15;
                break;
        }
        player.statPoints--;
        updateStatDisplay();
        updatePlayerInfo();
    }
}



function buyEnergy() {
    // Sprawdzenie czy gracz ma dość złota na zakup.
    if (player.gold >= player.maxstamina * 0.6 ) {

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
        player.gold -= staminaToAdd * 2;
        player.stamina += staminaToAdd;

        // Wiadomość
        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Zakupiono miksturę energii. ( -` + staminaToAdd + ` złota )` ;
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

document.addEventListener("keydown", function (event) {
    if (event.key === "1") {
        buyHP();
    }
    if (event.key === "2") {
        buyEnergy();
    }
    if (event.key === " ") {
        hunt();
    }
});

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

        player.amulet.upgradeCost = Math.floor(player.amulet.upgradeCost * 1.05);

        player.amulet.experienceMultiplier += 250; //
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

    messagesText.classList.add('fade-in-out');

    setTimeout(() => {
        messagesText.classList.remove('fade-in-out');
    }, 1000); // Adjust the duration as needed
}



function buyHP() {
    
    // Sprawdzenie czy gracz ma dość złota na zakup.
    if (player.gold >= player.maxhealth * 0.3) {

        let healthToAdd = Math.floor(player.maxhealth * 0.3);

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
                player.gold -= healthToAdd;
                player.currenthealth += healthToAdd;
        
                // Wiadomość
                let resultElement = document.getElementById('messages-output');
                let messageText = document.createElement('span');
                messageText.textContent = `Zakupiono miksturę HP ( -` + healthToAdd + ` złota )`;
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

    if (existingEquippedItem) {
        if (existingEquippedItem.rarity === item.rarity) {
            console.log('Item of the same type and rarity already equipped.');
            return;
        }

        existingEquippedItem.equipped = false;

        removeItemBonuses(existingEquippedItem);
        updatePlayerInfo();
        displayInventoryItems();
    }

    item.equipped = true;

    applyItemBonuses(item);

    updatePlayerInfo();
    displayInventoryItems();

    console.log('Equipped items:', equippedItems);
    console.log('Unequipped items:', unequippedItems);
}

function unequipItem(item) {

    if (item.equipped) {

        item.equipped = false;
        removeItemBonuses(item);
        updatePlayerInfo();
        displayInventoryItems();
    }
}

function applyItemBonuses(item) {
    const rarityMultiplier = getRarityMultiplier(item.rarity);

    switch (item.type) {
        case 'shield':
            player.defense += 5 * rarityMultiplier; // 
            break;
        case 'helmet':
            player.luck += 1 * rarityMultiplier; // 
            break;
        case 'armor':
            player.maxhealth += 300 * rarityMultiplier; // 
            player.maxstamina += 150 * rarityMultiplier;
            break;
        case 'belt':
            player.hpregen += 4 * rarityMultiplier; // 
            break;
        case 'ring':
            player.energyregen += 3 * rarityMultiplier; // 
            break;
        // Add 
    }
    player.defense = parseFloat(player.defense.toFixed(0));
    player.luck = parseFloat(player.luck.toFixed(0));
    player.maxhealth = parseFloat(player.maxhealth.toFixed(0));
    player.hpregen = parseFloat(player.hpregen.toFixed(0));
    player.energyregen = parseFloat(player.energyregen.toFixed(0));
}


function getRarityMultiplier(rarity) {
    const rarityMultipliers = {
        1: 1,
        2: 2,
        3: 3,
        4: 5,
        5: 7,
        6: 10,
    };

    return rarityMultipliers[rarity] || 1;
}

function removeItemBonuses(item) {
    const rarityMultiplier = getRarityMultiplier(item.rarity);
    switch (item.type) {
        case 'shield':
            player.defense -= 5 * rarityMultiplier; // 
            break;
        case 'helmet':
            player.luck -= 1 * rarityMultiplier; //
            break;
        case 'armor':
            player.maxhealth -= 300 * rarityMultiplier; //
            player.maxstamina -= 150 * rarityMultiplier;
            break;
        case 'belt':
            player.hpregen -= 4 * rarityMultiplier; // 
            break;
        case 'ring':
            player.energyregen -= 3 * rarityMultiplier; // 
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

                    // Tworzenie elementu obrazka
                    let imgElement = document.createElement('img');
                    imgElement.src = `icons/${item.type}.png`; // Załóż, że pliki są w folderze "icons"
                    imgElement.alt = item.type; // Dla dostępności

                    itemElement.appendChild(imgElement);

                    itemElement.title = item.name;

                        switch (item.rarity) {
                        case 1:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px gray;';
                            break;
                        case 2:
                            itemElement.style.boxShadow = 'inset 0px 0px 15px 2px lightskyblue';
                            break;
                        case 3:
                            itemElement.style.boxShadow = 'inset 0px 0px 15px 2px gold';
                            break;
                        case 4:
                            itemElement.style.boxShadow = 'inset 0px 0px 15px 2px magenta';
                            break;
                        case 5:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 3px crimson';
                            break;
                        case 6:
                            itemElement.style.boxShadow = 'inset 0px 0px 25px 4px lime';

                        // Add 
        }

                    itemElement.appendChild(imgElement);

                
                    itemElement.title = item.name;
                    
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
            // Error
            equippedItemsContainer.innerHTML = 'Brak założonych przedmiotów.';
            unequippedItemsContainer.innerHTML = 'Brak przedmiotów do założenia.';
        }
    }
}

// Inicjalizacja przycisków na stronie
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.location-button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => changeLocation(index));
    });
});

function calculateItemValue(rarity) {
    switch (rarity) {
        case 1:
            return 100;
        case 2:
            return 500;
        case 3:
            return 1500;
        case 4:
            return 10000;
        case 5:
            return 50000;
        default:
            return 0;
    }
}
// Funkcja sprzedająca przedmioty
function sellItems() {

    const itemsToSell = getUnwornItems();
    let totalGold = 0;

    itemsToSell.forEach(item => {
        totalGold += calculateItemValue(item.rarity);
    });

    if (totalGold != 0){

        player.gold += totalGold;

        let resultElement = document.getElementById('messages-output');
        let messageText = document.createElement('span');
        messageText.textContent = `Sprzedano nieużywane przedmioty za ${totalGold} złota.`;
        resultElement.innerHTML = '';
        resultElement.appendChild(messageText);
        messageText.style.whiteSpace = "pre-line";
        messageText.classList.add('fade-in-out');

        removeItemsFromInventory(itemsToSell);
        updatePlayerInfo();
        displayInventoryItems();
    } else {
            let resultElement = document.getElementById('messages-output');
            let messageText = document.createElement('span');
            messageText.textContent = `Nie masz nieużywanych przedmiotów.`;
            resultElement.innerHTML = '';
            resultElement.appendChild(messageText);
            messageText.style.whiteSpace = "pre-line";
            messageText.classList.add('fade-in-out');
    }


}

function getUnwornItems() {
    return player.loot.filter(item => !item.equipped);
}

function removeItemsFromInventory(items) {
    player.loot = player.loot.filter(item => !items.includes(item));
}

let isInventoryOpen = false;

function toggleInventory() {
    if (isInventoryOpen) {
        closeInventory();
    } else {
        openInventory();
    }
    isInventoryOpen = !isInventoryOpen;
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

let areStatsOpen = false;
function toggleStats() {
    if (areStatsOpen) {
        closeStats();
    } else {
        openStats();
    }
    areStatsOpen = !areStatsOpen;
}

function openStats() {
    document.getElementById('player-stats').style.display = 'block';

}

function closeStats() {
    document.getElementById('player-stats').style.display = 'none';

}

let isDevPanelOpen = false;
function toggleDevPanel() {
    if (isDevPanelOpen) {
        closeDevPanel();
    } else {
        openDevPanel();
    }
    isDevPanelOpen = !isDevPanelOpen;
}

function openDevPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}

function closeDevPanel() {
    document.getElementById('admin-panel').style.display = 'none';
}

let isPointsPanelOpen = false;
function togglePointsPanel() {
    if (isPointsPanelOpen) {
        showPointsPanel();
        updateStatDisplay();
    } else {
        hidePointsPanel();
        updateStatDisplay();
    }
    isPointsPanelOpen = !isPointsPanelOpen;
}

function showPointsPanel() {
    document.getElementById('stat-points-container').style.display = 'block';
}

function hidePointsPanel() {
    document.getElementById('stat-points-container').style.display = 'none';
}

updatePlayerInfo();


function muzyczka(){
    var audio = document.getElementById("myAudio");

    if (audio.paused) {
        audio.volume = 0.5;
        audio.play();
    } else {

        audio.pause();

    }
}
//devpanel

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
    player.amulet.experienceMultiplier += 100;
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
    player.gold = 0;
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
        upgradeCost: 1000, 
        experienceMultiplier: 0, 
    };
    player.statPoints = 0,// Początkowa liczba punktów do rozdania
    player.strength = 0,
    player.vitality = 0,
    player.agility = 0,
    player.intelligence = 0,
    player.monsterLevelRange = "1-10"; // Dodaj tę linię z domyślną lokalizacją


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
