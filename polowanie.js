let player = JSON.parse(localStorage.getItem('player')) || {
    level: 1,
    experience: 0,
    gold: 0,
    currenthealth: 200,
    maxhealth: 200,
    stamina: 100,
    weapon: 'Zardzewiały Miecz',
    experienceToNextLevel: 100,
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
        4: "placeholder",
        5: "placeholder",
        6: "placeholder",
        7: "placeholder",
        8: "placeholder",
        9: "placeholder",
        10: "placeholder",
        11: "placeholder",
        12: "placeholder",
        13: "placeholder",
        14: "placeholder",
        15: "placeholder",
        16: "placeholder",

        // Add more as needed
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
    if (player.stamina >= 5) {

    let huntButton = document.getElementById("huntButton");
    
    if (huntButton.disabled) {
        return;
      }
      let resultXElement = document.getElementById('resultX');
      resultXElement.textContent = `Trwa polowanie...`;
      huntButton.disabled = true;

      setTimeout(function() {


    let monsterLevelRange = player.monsterLevelRange.split('-');
    let minMonsterLevel = parseInt(monsterLevelRange[0]);
    let maxMonsterLevel = parseInt(monsterLevelRange[1]);


    // Symulacja walki i przyznawania punktów doświadczenia oraz złota
    let monsterLevel = Math.floor(Math.random() * (maxMonsterLevel - minMonsterLevel + 1)) + minMonsterLevel;
    let experienceGain = monsterLevel * 10; // Przyznane punkty doświadczenia
    let goldGain = monsterLevel * 5.5; // Przyznane złoto
    let hplost = monsterLevel * 5;
    let energylost = 5;


    // Aktualizacja danych gracza
    player.experience += experienceGain;
    player.gold += goldGain;
    player.stamina -= energylost;
    player.currenthealth -= hplost;

    // Sprawdzenie czy gracz zdobył wystarczająco dużo doświadczenia na nowy poziom
    if (player.experience >= player.experienceToNextLevel) {
        player.level++;
        player.experienceToNextLevel = calculateExperienceToNextLevel();
    }

    // Zapis danych gracza w local storage
    localStorage.setItem('player', JSON.stringify(player));

    // Wyświetlenie wyniku walki
    let resultElement = document.getElementById('result');
    let monsterName = getMonsterName(monsterLevel);
    resultElement.textContent = `~ Walka z potworem: ${monsterName} (lvl: ${monsterLevel}) ~
        ${monsterName} zadaje ${hplost} punktów obrażeń!
        Zdobyto ${experienceGain} doświadczenia 
        Znaleziono ${goldGain} sztuk złota
        Wykorzystano ${energylost} energii.`
    resultElement.style.whiteSpace = "pre-line";


    let resultXElement = document.getElementById('resultX');
    resultXElement.textContent = "";

    // Aktualizacja interfejsu gracza
    updatePlayerInfo();
    huntButton.disabled = false;
    }, 2500);


} else {
    alert('Masz za mało energii!');
}
    
}

// Funkcja do obliczania doświadczenia potrzebnego do następnego poziomu
    function calculateExperienceToNextLevel() {
    let requiredExperience = 100;

    for (let i = 2; i <= player.level; i++) {
        requiredExperience += Math.ceil(requiredExperience * 1.05);
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
    staminaAmount.textContent = player.stamina;





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

        // Wymiana
        player.gold -= 100;
        player.stamina += 50;

        // Wiadomość
        let resultElement = document.getElementById('result');
        resultElement.textContent = `Zakupiono +50 energii za 100 złota.`;
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

function buyHP() {
    // Sprawdzenie czy gracz ma dość złota na zakup.
    if (player.gold >= 50) {

        // Wymiana
        player.gold -= 50;
        player.currenthealth += 50;

        // Wiadomość
        let resultElement = document.getElementById('result');
        resultElement.textContent = `Zakupiono +50 HP za 50 złota.`;
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

updatePlayerInfo();

function resetLevel() {
    player.level = 1;
    player.experience = 0;
    player.gold = 0;
    player.experienceToNextLevel = 100;
    player.stamina = 100;
    player.currenthealth = 200;
    player.maxhealth = 200;
    localStorage.setItem('player', JSON.stringify(player));
    let resultElement = document.getElementById('result');
    resultElement.textContent = `Zresetowano poziom gracza.`;
    updatePlayerInfo();
}



// Inicjalizacja gry
updatePlayerInfo();