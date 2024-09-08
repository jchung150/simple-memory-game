/*
  This JavaScript file contains code generated with assistance from ChatGPT,
  an AI language model developed by OpenAI.

  ChatGPT was used for advice on certain functionalities and structures in
  this project.

  For more information, visit: https://openai.com/chatgpt
*/

const buttonContainer = document.querySelector(".btn-container");

class Utility {
  static getRandomColor() {
    const letters = config.hexLetters;
    const color = config.baseColor;
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  static scramblePositions(
    buttonArray,
    containerWidth,
    containerHeight,
    buttonWidth,
    buttonHeight
  ) {
    const maxWidth = containerWidth - buttonWidth;
    const maxHeight = containerHeight - buttonHeight;

    for (let i = 0; i < buttonArray.length; i++) {
      const randomLeft = Math.floor(Math.random() * maxWidth);
      const randomTop = Math.floor(Math.random() * maxHeight);
      const button = buttonArray[i];
      button.style.position = "absolute";
      button.style.left = `${randomLeft}px`;
      button.style.top = `${randomTop}px`;
    }
  }
}

class Button {
  constructor(colour, index) {
    const button = document.createElement("button");
    button.className = `button`;
    button.style.position = "relative";
    button.style.backgroundColor = colour;
    button.innerText = index;
    return button;
  }
}

class Game {
  constructor() {
    this.buttonArray = [];
    this.clickIndex = 0;
    this.clickPhase = false;
    this.scrambleIntervalId = null;
    this.scrambleTimeoutId = null;
    this.handleClick = this.handleClick.bind(this);
  }

  startGame(nums) {
    clearInterval(this.scrambleIntervalId);
    clearTimeout(this.scrambleTimeoutId);
    this.resetEverything();
    this.displayButtons(nums);
    this.scrambleTimeoutId = setTimeout(() => {
      this.scrambleButtons(nums);
    }, nums * 1000);
  }

  resetEverything() {
    buttonContainer.innerHTML = "";
    this.buttonArray = [];
    this.clickIndex = 0;
    this.clickPhase = false;
    document.removeEventListener("click", this.handleClick);
  }

  displayButtons(nums) {
    for (let i = 0; i < nums; i++) {
      let colour = Utility.getRandomColor();
      const button = new Button(colour, i + 1);
      this.buttonArray.push(button);
      buttonContainer.appendChild(button);
    }
  }

  scrambleButtons(nums) {
    let scrambleCount = 0;
    const containerWidth = buttonContainer.offsetWidth;
    const containerHeight = buttonContainer.offsetHeight;
    const buttonWidth = 160; // 10em converted to pixel
    const buttonHeight = 80; // 5em converted to pixel

    this.scrambleIntervalId = setInterval(() => {
      if (scrambleCount < nums) {
        Utility.scramblePositions(
          this.buttonArray,
          containerWidth,
          containerHeight,
          buttonWidth,
          buttonHeight
        );
        scrambleCount++;
      } else {
        clearInterval(this.scrambleIntervalId);
        this.hideButtons();
        this.clickPhase = true;
        this.clickButtons();
      }
    }, 2 * 1000);
  }

  hideButtons() {
    for (let i = 0; i < this.buttonArray.length; i++) {
      const button = this.buttonArray[i];
      button.innerText = "";
      button.disabled = false;
      button.style.cursor = "pointer";
    }
  }

  clickButtons() {
    document.addEventListener("click", this.handleClick);
  }

  handleClick(e) {
    if (!this.clickPhase) {
      return;
    }
    if (!this.buttonArray.includes(e.target)) {
      return;
    }

    const clickedButton = e.target;
    const expectedButton = this.buttonArray[this.clickIndex];

    if (clickedButton.disabled) {
      return;
    }

    if (clickedButton === expectedButton) {
      clickedButton.innerText = this.clickIndex + 1;
      clickedButton.disabled = true;
      this.clickIndex++;

      if (this.clickIndex === this.buttonArray.length) {
        setTimeout(() => {
          alert(messages.excellentMemory);
          document.removeEventListener("click", this.handleClick);
        }, 100);
      }
    } else {
      alert(messages.wrongOrder);
      this.revealCorrectOrder();
      document.removeEventListener("click", this.handleClick);
    }
  }

  revealCorrectOrder() {
    for (let i = 0; i < this.buttonArray.length; i++) {
      const button = this.buttonArray[i];
      button.innerText = i + 1;
    }
  }
}

const game = new Game();

document.getElementById("start-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const buttonNums = document.getElementById("button-numbers").value;
  if (buttonNums.trim() === "" || buttonNums < 3 || buttonNums > 7) {
    alert(messages.invalidButtonNumber);
    return;
  }
  game.startGame(buttonNums);
});
