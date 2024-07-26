const livesDisplay = document.querySelector(".lives");
const lettersContainer = document.querySelector(".letters");
const inputSection = document.querySelector(".input-section");
const wordDisplay = document.getElementById("word-display");
const startButton = document.getElementById("start-button");
const canvas = document.getElementById("hangmanCanvas");
const context = canvas.getContext("2d");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const guessSection = document.querySelector(".guess-section");
const guessedLettersBox = document.getElementById("guessed-letters-box");
const randomWordButton = document.getElementById("random-word-button");
let wrongGuessedLetters = new Set();
let word = "";
let guessedLetters = new Set();
let lives = 6; // Set initial lives

const random = [
      "Giant African mammal",
      "Tall African animal",
      "Vast body of water",
      "Towering landform",
      "Popular fast food item",
      "All of space and time",
      "Intelligent sea creature",
      "Where the sky meets land",
      "Tiny water droplet",
      "Sweet red fruit",
      "Outdoor evening fire",
      "Volcanic eruption",
      "Gentle wind",
      "Flowing water body",
      "Bright yellow flower",
      "Artistic creator",
      "Court game with a ball",
      "Collection of books",
      "Tropical fruit",
      "Colorful circus celebration",
      "Exciting experience",
      "Floating party decoration",
      "Wax stick with a wick",
      "Barren sandy landscape",
      "Large bird of prey",
      "Festive gathering",
      "Shining like gold",
      "Peaceful agreement",
      "Ice house",
      "Personal writing book",
      "Flying toy on a string",
      "Portable light source",
      "Reflective glass surface",
      "Natural world around us",
      "Delicate flowering plant",
      "Soft head support",
      "Silent atmosphere",
      "Colorful arch in the sky",
      "Unique ice crystal",
      "Football score",
      "Related to the city",
      "Small rural community",
      "Wind-powered structure",
      "Christmas abbreviation",
      "Luxurious sailing vessel",
      "Striped African animal"
];

// Generate letter buttons
for (let letter of alphabet) {
      const button = document.createElement("button");
      button.addEventListener("click", () => handleGuess(letter));
      button.classList.add("letter");
      button.textContent = letter;
      lettersContainer.appendChild(button);
}

function startGame() {
      if (word.trim() === "") {
            word = getRandomWord();
      }

      word = word.toUpperCase();

      if (!word.match(/^[A-Za-z\s]+$/)) {
            showModal("Please enter a valid word - no symbols.");
            return;
      }

      inputSection.style.display = "none";
      guessSection.style.display = "inline-block";

      updateWordDisplay();
      clearCanvas();

      // Draw gallows
      context.strokeStyle = "#000";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(20, 230);
      context.lineTo(180, 230);
      context.moveTo(100, 230);
      context.lineTo(100, 20);
      context.lineTo(150, 20);
      context.lineTo(150, 50);
      context.stroke();
}

function updateWordDisplay() {
      wordDisplay.innerHTML = "";
      let correctLetters = 0;

      for (let letter of word) {
            if (guessedLetters.has(letter)) {
                  const h3 = document.createElement("h3");
                  h3.textContent = letter;
                  wordDisplay.appendChild(h3);
                  correctLetters++;
            } else if (letter === " ") {
                  const h1 = document.createElement("h1");
                  h1.style.padding = "8px";
                  wordDisplay.appendChild(h1);
            } else {
                  const h3 = document.createElement("h3");
                  h3.textContent = "_";
                  wordDisplay.appendChild(h3);
            }
      }
}

function handleGuess(guess) {
      if (word === "") {
            showModal("Error: Please enter or select a word first!");
            return;
      }

      // Normalize input to uppercase
      guess = guess.toUpperCase();

      if (guess.length === 1 && alphabet.includes(guess)) {
            // Single letter guess
            if (!guessedLetters.has(guess)) {
                  guessedLetters.add(guess);

                  if (!word.includes(guess)) {
                        lives--;
                        livesDisplay.textContent = `Lives left: ${lives}`;
                        wrongGuessedLetters.add(guess);
                        updateWrongGuessedLettersDisplay();
                        drawHangman(lives);

                        // Check game end condition after updating display
                        checkGameEnd();
                  }
            }
      } else if (guess.length === word.length && guess.match(/^[A-Za-z\s]+$/)) {
            // Full word guess
            if (guess === word) {
                  endGame(true); // Correctly guessed the entire word
            } else {
                  lives--;
                  livesDisplay.textContent = `Lives left: ${lives}`;
                  drawHangman(lives);

                  // Check game end condition after updating display
                  checkGameEnd();
            }
      } else {
            showModal("Please enter a valid letter or word.");
      }

      updateWordDisplay(); // Refresh the displayed word status
}

function drawHangman(lives) {
      // Draw hangman based on remaining lives
      context.strokeStyle = "#333333";
      context.lineWidth = 2;
      if (lives === 5) {
            context.beginPath();
            context.arc(150, 80, 30, 0, Math.PI * 2);
            context.stroke();
            // Draw head
      }
      if (lives === 4) {
            context.beginPath();
            context.moveTo(150, 110);
            context.lineTo(150, 170);
            context.stroke();
            // Draw body
      }

      if (lives === 3) {
            context.beginPath();
            context.moveTo(150, 120);
            context.lineTo(130, 140);
            context.stroke();
            // Draw left arm
      }

      if (lives === 2) {
            context.beginPath();
            context.moveTo(150, 120);
            context.lineTo(170, 140);
            context.stroke();
            // Draw right arm
      }

      if (lives === 1) {
            context.beginPath();
            context.moveTo(150, 170);
            context.lineTo(130, 190);
            context.stroke();
            // Draw left leg
      }

      if (lives === 0) {
            context.beginPath();
            context.moveTo(150, 170);
            context.lineTo(170, 190);
            context.stroke();
            // Draw right leg
      }
}

function clearCanvas() {
      context.clearRect(0, 0, canvas.width, canvas.height);
}

function resetGame() {
      guessedLetters.clear();
      wrongGuessedLetters.clear();
      lives = 6;
      livesDisplay.innerHTML = `Lives left: ${lives}`;
      word = "";
      guessInput.value = "";
      inputSection.style.display = "inline-block"; // Show input section
      guessSection.style.display = "none";
      updateWordDisplay();
      updateWrongGuessedLettersDisplay();
      clearCanvas();
}

document.addEventListener("keypress", function (event) {
      if (event.target.tagName.toLowerCase() !== "input") {
            handleGuess(event.key);
      }
});

function checkGameEnd() {
      if (lives === 0) {
            endGame(false); // Lost
      } else if (!wordDisplay.textContent.includes("_")) {
            endGame(true); // Won
      }
}

function endGame(won) {
      let message;
      if (won) {
            message = "Congratulations! You won!";
      } else {
            message = "Game over! You lost!";
      }
      message += `The word was ${word}`;
      resetGame();
      showModal(message);
}

// Initialize word display with underscores
updateWordDisplay();
updateWrongGuessedLettersDisplay(); // Initialize guessed letters display

function updateWrongGuessedLettersDisplay() {
      guessedLettersBox.textContent = Array.from(wrongGuessedLetters).join(", ");
}

randomWordButton.addEventListener("click", () => {
      word = getRandomWord();
      startGame();
});

function getRandomWord() {
      return randomWords[Math.floor(Math.random() * randomWords.length)];
}

function showModal(message) {
      document.getElementById("modal-message").textContent = message;
      document.getElementById("modal").style.display = "block";
      document.body.classList.add("no-scroll"); // Disable page scrolling
}

function closeModal() {
      document.getElementById("modal").style.display = "none";
      document.body.classList.remove("no-scroll"); // Enable page scrolling
}

guessInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
            let guess = guessInput.value;
            checkEntireWord(guess);
            guessInput.value = "";
      }
});

guessButton.addEventListener("click", () => {
      let guess = guessInput.value;
      if (!/^[A-Za-z\s]+$/.test(guess)) {
            showModal("Please enter a valid letter or space");
      } else {
            checkEntireWord(guess);
            guessInput.value = "";
      }
});

function checkEntireWord(guess) {
      guess = guess.toUpperCase();

      if (word === guess) {
            endGame(true);
      } else {
            lives--;
            livesDisplay.innerHTML = `Lives left: ${lives}`;
            drawHangman(lives);
      }
}
