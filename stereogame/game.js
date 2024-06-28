let currentImageIndex = 0;
const stereograms = [
  { src: 'stereos/stereogram1.jpg', answer: 'rower' },
  { src: 'stereos/stereogram2.jpg', answer: 'samolot' },
  { src: 'stereos/stereogram3.jpg', answer: 'czaszka' },
  { src: 'stereos/stereogram4.jpg', answer: 'motyl' },
  { src: 'stereos/stereogram5.jpg', answer: 'klepsydra' },
  { src: 'stereos/stereogram6.jpg', answer: 'most' },
  { src: 'stereos/stereogram7.jpg', answer: 'świnia' },
  { src: 'stereos/stereogram8.jpg', answer: 'ryba' },
  { src: 'stereos/stereogram9.jpg', answer: 'budda' },
  // Dodaj więcej stereogramów i odpowiedzi tutaj
];

function startGame() {
  document.getElementById('large-header').style.filter = 'blur(5px)';
  document.getElementById('game-container').style.display = 'block';
  loadStereogram();
}

function loadStereogram() {
    if (currentImageIndex < stereograms.length) {
      const stereogram = stereograms[currentImageIndex];
      document.getElementById('stereogram').src = stereogram.src;
      document.getElementById('answer-input').value = '';
      document.getElementById('feedback').textContent = '';
      document.getElementById('stereogram').style.display = 'block';
      document.getElementById('answer-input').style.display = 'inline-block';
      document.getElementById('submit-button').style.display = 'inline-block';
    } else {
      document.getElementById('feedback').textContent = 'Gratulacje! Ukończyłeś grę!';
      document.getElementById('stereogram').style.display = 'none';
      document.getElementById('answer-input').style.display = 'none';
      document.getElementById('submit-button').style.display = 'none';
    }
  }

function checkAnswer() {
  const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
  const correctAnswer = stereograms[currentImageIndex].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    document.getElementById('feedback').textContent = 'Poprawna odpowiedź!';
    currentImageIndex++;
    setTimeout(loadStereogram, 2000); // Przeładowanie po 2 sekundach
  } else {
    document.getElementById('feedback').textContent = 'Niepoprawna odpowiedź, spróbuj ponownie.';
  }
}

document.getElementById('answer-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      checkAnswer();
    }
  });