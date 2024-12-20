const tokens = [
    "✊",
    "🖐️",
    "✌️",
];

const jackpot = document.querySelector("#counter");
const hitButton = document.querySelector(".pushable");
const hitButtonText = document.querySelector("#pushable-text");
const amountToChange = document.querySelector("#amount-to-change");
const incrementer = document.querySelector("#incrementer");
const decrementer = document.querySelector("#decrementer");
const numOfTokens = 32;
const tokenSize = 150;
const totalSlots = 3;
const spinDuration = 6000;

let slotNumber = 1;
let slotTokensHeight = 0;

// Spin one slot at a time.
// When all slots have tokens, change to 'Clear' button,
// which will empty all slots but keep jackpot the same.
hitButton.addEventListener("click", (event) => {
    if (slotNumber <= totalSlots) {
        let slot = document.querySelector(`#slot-${slotNumber}`);
        fillSlot(slot);
        slot.animate(
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

        slotNumber += 1;
        slotTokensHeight = 0;

        if (slotNumber > totalSlots) {
            hitButtonText.textContent = "Clear";
        }
    } else  {
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
    hitButtonText.textContent = "Hit";
}