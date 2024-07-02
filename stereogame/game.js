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
  { src: 'stereos/stereogram10.jpg', answer: 'twarz' },
  { src: 'stereos/stereogram11.jpg', answer: 'kaczka' },
  { src: 'stereos/stereogram12.jpg', answer: 'smok' },
  { src: 'stereos/stereogram13.jpg', answer: 'dinozaur' },
  { src: 'stereos/stereogram14.jpg', answer: 'osa' },
  { src: 'stereos/stereogram15.jpg', answer: 'niedźwiedź' },
  { src: 'stereos/stereogram16.jpg', answer: 'gitara' },
  { src: 'stereos/stereogram17.jpg', answer: 'auto' },
  { src: 'stereos/stereogram18.jpg', answer: 'armata' },
  { src: 'stereos/stereogram19.jpg', answer: 'fontanna' },
  { src: 'stereos/stereogram20.jpg', answer: 'serce' },
];
//addmoar
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
