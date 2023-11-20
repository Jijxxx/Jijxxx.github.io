let player = JSON.parse(localStorage.getItem('player')) || {
    level: 1,
    experience: 0,
    gold: 0,
    weapon: 'Zardzewiały Miecz',
    experienceToNextLevel: 100,
    monsterLevelRange: "1-5", // Default monster level range
};

function updateMonsterLevel() {
    let levelSelect = document.getElementById('level-select');
    let selectedRange = levelSelect.value;
    let minRequiredLevel = getMinRequiredLevel(selectedRange);

    if (player.level >= minRequiredLevel) {
        player.monsterLevelRange = selectedRange;
        
        // Optionally, you can reset player's stats when changing the monster level
        resetPlayerStats();

        // Update player information and reset result message
        updatePlayerInfo();
        let resultElement = document.getElementById('result');
        resultElement.textContent = "";
    } else {
        // Display a message indicating the minimum required level
        alert(`Musisz mieć co najmniej poziom ${minRequiredLevel} by wybrać polowanie na terenach ${selectedRange} poziomu.`);
        // Optionally, you can reset the dropdown to the default option or take other actions
        levelSelect.value = player.monsterLevelRange; // Reset the dropdown to the previous value
    }
}

function getMinRequiredLevel(range) {
    // Define minimum required levels for each range
    const minLevels = {
        "1-5": 1,
        "6-10": 6, // Adjust as needed for other ranges
        "11-15": 11,
        "16-20": 16,
        "21-30": 21,
        "31-50": 31

        // Add more options as needed
    };

    return minLevels[range] || 1; // Default to 1 if the range is not found
}

function hunt() {
    let huntButton = document.getElementById("huntButton");
    var resultXElement = document.getElementById("resultX");

    if (huntButton.disabled) {
        return;
      }

      huntButton.disabled = true;

      setTimeout(function() {


    let monsterLevelRange = player.monsterLevelRange.split('-');
    let minMonsterLevel = parseInt(monsterLevelRange[0]);
    let maxMonsterLevel = parseInt(monsterLevelRange[1]);


    // Symulacja walki i przyznawania punktów doświadczenia oraz złota
    let monsterLevel = Math.floor(Math.random() * (maxMonsterLevel - minMonsterLevel + 1)) + minMonsterLevel;
    let experienceGain = monsterLevel * 10; // Przyznane punkty doświadczenia
    let goldGain = monsterLevel * 5.5; // Przyznane złoto

    // Aktualizacja danych gracza
    player.experience += experienceGain;
    player.gold += goldGain;

    // Sprawdzenie czy gracz zdobył wystarczająco dużo doświadczenia na nowy poziom
    if (player.experience >= player.experienceToNextLevel) {
        player.level++;
        player.experienceToNextLevel = calculateExperienceToNextLevel();
    }

    // Zapis danych gracza w local storage
    localStorage.setItem('player', JSON.stringify(player));

    // Wyświetlenie wyniku walki
    let resultElement = document.getElementById('result');
    resultElement.textContent = `Walka z potworem poziomu ${monsterLevel}:
    Doświadczenie: +${experienceGain},
    Złoto: +${goldGain}`;
    resultElement.style.whiteSpace = "pre-line";



    // Aktualizacja interfejsu gracza
    updatePlayerInfo();
    
    // Do the hunting operation here
    resultXElement.textContent = "";
    huntButton.disabled = false;
    }, 2500);
    
}

// Funkcja do obliczania doświadczenia potrzebnego do następnego poziomu zgodnie z nowymi wymaganiami
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
    let expToNextLevelInfo = document.getElementById('exp-to-next-level-info');
  
    let experienceNeededForCurrentLevel = calculateExperienceToNextLevel();
    let experienceNeededForPreviousLevel = player.level === 1 ? 0 : calculateExperienceToNextLevel() - Math.ceil(calculateExperienceToNextLevel() / 1.5);
    let currentLevelExperience = player.level === 1 ? player.experience : player.experience - experienceNeededForPreviousLevel;
  
    let displayText = `${experienceNeededForCurrentLevel - currentLevelExperience}/${experienceNeededForCurrentLevel}`;
    let experiencePercentage = ((experienceNeededForCurrentLevel - currentLevelExperience) / experienceNeededForCurrentLevel) * 100;
  
    experienceBar.style.width = 100 - experiencePercentage + '%';
    expInfo.innerHTML = `Doświadczenie: <span id="current-exp">${currentLevelExperience}</span> / <span id="exp-needed">${experienceNeededForCurrentLevel}</span>`;


    let resultElement = document.getElementById('exp-info');
    resultElement.textContent = displayText;

    let levelInfo = document.getElementById('player-level');
    levelInfo.textContent = player.level;

    let goldAmount = document.getElementById('gold-amount');
    goldAmount.textContent = player.gold;

    expInfo.textContent = `Doświadczenie: ${player.experience} / ${player.experienceToNextLevel}`;

    let expToNextLevelPercentage = ((player.experienceToNextLevel - player.experience) / player.experienceToNextLevel) * 100;

    let levelContainer = document.getElementById('level-info');
    let previousLevel = parseInt(levelContainer.dataset.level || 1);
    
    if (player.level > previousLevel) {
        levelContainer.classList.add('level-up');

        setTimeout(() => {
            levelContainer.classList.remove('level-up');
        }, 500);

        // Update the data-level attribute to the current level
        levelContainer.dataset.level = player.level;
    }

}

updatePlayerInfo();

function resetLevel() {
    player.level = 1;
    player.experience = 0;
    player.gold = 0;
    player.experienceToNextLevel = 100;
    localStorage.setItem('player', JSON.stringify(player));
    let resultElement = document.getElementById('result');
    resultElement.textContent = `Zresetowano poziom gracza.`;
    updatePlayerInfo();
}



// Inicjalizacja gry
updatePlayerInfo();