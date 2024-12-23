const tokens = [
    "✊",
    "🖐️",
    "✌️",
];

const jackpot = document.querySelector("#counter");
const winningMessage = document.querySelector("#winning-message");
const spinButton = document.querySelector(".pushable");
const spinButtonText = document.querySelector("#pushable-text");
const amountToChange = document.querySelector("#amount-to-change");
const incrementer = document.querySelector("#incrementer");
const decrementer = document.querySelector("#decrementer");
const numOfTokens = 32;
const tokenSize = 150;
const totalSlots = 3;
const spinDuration = 6000;

let winMsgAnimation;
let userWon = false;
let slotNumber = 1;
let slotTokensHeight = 0;
let lastToken = "";

// Spin one slot at a time.
// When all slots have tokens, change to 'Clear' button,
// which will empty all slots but keep jackpot the same.
spinButton.addEventListener("click", (event) => {
    if (spinButtonText.textContent !== "Clear") {
        spinButton.style.opacity = "50%";
        spinButton.disabled = true;
        const slot = document.querySelector(`#slot-${slotNumber}`);
        fillSlot(slot);
        const currentToken = slot.lastChild.textContent;
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

        animation.onfinish = () => {
            // Handle 3rd spin
            if (slotNumber === totalSlots) {
                // All 3 tokens identical
                if (lastToken === currentToken) {
                    winMsgAnimation = displayWinningMessage();
                    userWon = true;
                }

                spinButtonText.textContent = "Clear";
            } else { // Handle first 2 spins
                // Round ends if first 2 tokens unidentical
                if (lastToken && lastToken !== currentToken) {
                    spinButtonText.textContent = "Clear";
                } else { // Continue round if first 2 tokens identical
                    slotTokensHeight = 0;
                    lastToken = currentToken;
                    slotNumber += 1;
                }
            }
            
            spinButton.style.opacity = "100%";
            spinButton.disabled = false;
        };
    } else { // When button text becomes 'Clear'
        if (userWon) {
            clearJackpot();
        }
        if (winMsgAnimation) {
            winMsgAnimation.cancel();
        }
        clearSlots();
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