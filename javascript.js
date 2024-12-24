const tokens = [
    "✊",
    "🖐️",
    "✌️",
];

// Audio
const buttonPressSound = document.querySelector("#button-press-sound");
const clickSound = document.querySelector("#click-sound");
const coinsFalling = document.querySelector("#coins-falling");
const winner = document.querySelector("#winner");
// Jackpot
const jackpot = document.querySelector("#counter");
// Display
const winningMessage = document.querySelector("#winning-message");
// Spin button
const spinButton = document.querySelector(".pushable");
const spinButtonText = document.querySelector("#pushable-text");
// Jackpot incrementer/decrementer
const amountToChange = document.querySelector("#amount-to-change");
const incrementer = document.querySelector("#incrementer");
const decrementer = document.querySelector("#decrementer");
// Slots
const numOfTokens = 32;
const tokenSize = 150;
const totalSlots = 3;
const defaultSpinDuration = 6000;
// Override
const overrideButton = document.querySelector("#override");

let userWon = false;
let slotNumber = 1;
let slotTokensHeight = 0;
let lastToken = "";
let slotHeight = 0;
let winMsgAnimation;
let tempSlot;
let oldSlotHeight;
let currentToken = "";
let spinDuration = 6000;
let override = false;

// Configure slot spin behavior
spinButton.addEventListener("click", (event) => {
    buttonPressSound.play();
    if (spinButtonText.textContent !== "Clear") {
        if (override) {
            spinAllSlots();
            spinButtonText.textContent = "Clear";
        } else {
            spinButton.style.opacity = "50%";
            spinButton.disabled = true;
            const animation = spinSingleSlot();
            slotNumber--;
            
            animation.onfinish = () => {
                // Handle 3rd spin
                if (slotNumber === totalSlots) {
                    // All 3 tokens identical
                    if (lastToken === currentToken) {
                        winMsgAnimation = displayWinningMessage();
                        winner.play();
                        coinsFalling.play();
                        userWon = true;
                    }
                    spinButtonText.textContent = "Clear";
                } else { // Handle first 2 spins
                    // Round ends if first 2 tokens unidentical
                    if (lastToken && lastToken !== currentToken) {
                        spinButtonText.textContent = "Clear";
                    }
                }
                
                slotNumber++
                spinButton.style.opacity = "100%";
                spinButton.disabled = false;
            };
        }
    } else {
        if (userWon) {
            clearJackpot();
        }
        if (winMsgAnimation) {
            winMsgAnimation.cancel();
        }
        spinDuration = defaultSpinDuration;
        clearSlots();
    }
});

// Switch slot spin behavior between:
// - Spin all three
// - Spin one by one
overrideButton.addEventListener("click", () => {
    // Disable button in between rounds
    if (currentToken !== "") {
        return;
    }

    override = !override;
    const buttonText = overrideButton.textContent;
    if (buttonText[0] === "1") {
        overrideButton.textContent = `3${buttonText.slice(1)}`;
    } else if (buttonText[0] === "3") {
        overrideButton.textContent = `1${buttonText.slice(1)}`;
    }
});

// Button to add amount to jackpot
incrementer.addEventListener("click", (event) => {
    adjustJackpot("inc");
});

// Button to remove amount from jackpot
decrementer.addEventListener("click", (event) => {
    adjustJackpot("dec");
});

// Used by incrementer/decrementer to adjust jackpot amount
function adjustJackpot(adjustType) {
    const counterNum = Number(jackpot.textContent);
    const adjustBy = Number(amountToChange.value);

    let newCounter = 0;

    if (adjustType === "inc") {
        newCounter = counterNum + adjustBy;
    } else if (adjustType === "dec") {
        newCounter = counterNum - adjustBy;
        if (newCounter < 0) {
            newCounter = 0;
        }
    }

    jackpot.textContent = newCounter;
}

function clearJackpot() {
    jackpot.textContent = 0;
    userWon = false;
    amountToChange.value = "";
}

function getRandomToken() {
    const randomIndex = Math.floor(Math.random() * tokens.length);
    return tokens[randomIndex];
}

function createToken() {
    const randomToken = getRandomToken();
    const token = document.createElement("div");
    token.textContent = randomToken;
    token.style.fontSize = `${tokenSize}px`;
    return token;
}

// Append tokens to slot randomly, and update slotTokensHeight.
function fillSlot(slot) {
    for (let i = 0; i < numOfTokens; i++) {
        const token = createToken();
        slot.appendChild(token);
        slotTokensHeight += token.clientHeight;
    }
}

function clearSlots() {
    for (let i = 1; i <= totalSlots; i++) {
        const slot = document.querySelector(`#slot-${i}`);
        slot.replaceChildren();
    }

    slotNumber = 1;
    spinButtonText.textContent = "Spin";
    lastToken = "";
    currentToken = "";
    slotTokensHeight = 0;
}

function displayWinningMessage() {
    return winningMessage.animate(
        [
            { transform: "scale(0)", opacity: 0 },
            { transform: "scale(1.0)", opacity: 1 },
        ],
        {
            duration: 200,
            easing: "ease-in",
            fill: "forwards",
        },
    );
}

function getYPosition(slot) {
    return slot.getBoundingClientRect().y;
}

function playAudioPerToken() {
    const rect = tempSlot.getBoundingClientRect();
    const top = rect.top;

    if (Math.abs(top - oldSlotHeight) >= 245) {
        playClickSound();
        oldSlotHeight = top;
    }

    requestAnimationFrame(playAudioPerToken);
}

function playClickSound() {
    const soundClone = clickSound.cloneNode();
    soundClone.play();
}

function spinAllSlots() {
    for (let i = 1; i <= totalSlots; i++) {
        spinSingleSlot();
        spinDuration+= 800;
    }  
}

function spinSingleSlot() {
    const slot = document.querySelector(`#slot-${slotNumber}`);
    fillSlot(slot);
    lastToken = currentToken;
    currentToken = slot.lastChild.textContent;

    // For configuring slot tick sound timings
    tempSlot = slot;
    oldSlotHeight = getYPosition(slot) + (230 / 2);

    const animation = slot.animate(
        [
            { transform: "translateY(0)" },
            { transform: `translateY(-${slotTokensHeight - (slotTokensHeight / numOfTokens)}px)` },
        ],
        {
            duration: spinDuration,
            easing: "cubic-bezier(0.42, 0, 0.1, 1.03)",
            fill: "forwards",
        },
    );
    playAudioPerToken(slot);

    slotTokensHeight = 0;
    slotNumber += 1;

    return animation;
}