const tokens = [
    "✊",
    "🖐️",
    "✌️",
];

const counter = document.querySelector("#counter");
const hitButtonText = document.querySelector("#pushable-text");
const amountToChange = document.querySelector("#amount-to-change");
const incrementer = document.querySelector("#incrementer");
const decrementer = document.querySelector("#decrementer");
const numOfTokens = 32;
const totalSlots = 3;
const spinDuration = 6000;

let slotNumber = 1;
let slotTokensHeight = 0;

// Clicking the 'Hit!' button will spin one slot at a time.
// Button will change into 'Clear' when all slots are full,
// which will empty all slots but keep jackpot the same.
hitButtonText.addEventListener("click", (event) => {
    if (slotNumber <= totalSlots) {

        let slot = document.querySelector(`#slot-${slotNumber}`);

        fillElement(slot, tokens, numOfTokens);

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
        )

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
    adjustCounter(amountToChange, "inc");
});

// Button to remove amount from jackpot
decrementer.addEventListener("click", (event) => {
    adjustCounter(amountToChange, "dec");
});

// Used by incrementer/decrementer to adjust jackpot amount
function adjustCounter(valueString, type) {
    const counterNum = Number(counter.textContent);
    const adjustBy = Number(amountToChange.value);

    let newCounter = 0;

    if (type === "inc") {
        newCounter = counterNum + adjustBy;
    } else if (type === "dec") {
        newCounter = counterNum - adjustBy;
        if (newCounter < 0) {
            newCounter = 0;
        }
    }

    counter.textContent = newCounter;
}

// Append children to element with items of an
// array randomly, and update slotTokensHeight.
function fillElement(element, array, numOfChild) {
    for (let i = 0; i < numOfChild; i++) {
        const randomItem = getRandomItem(array);
        const div = document.createElement("div");
        div.textContent = randomItem;
        div.style.fontSize = "150px";
        div.style.textAlign = "center";
        element.appendChild(div);
        slotTokensHeight += div.clientHeight;
    }
}

function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function removeChildren(element) {
    element.removeChildren();
}

function clearSlots() {
    for (let i = 1; i <= totalSlots; i++) {
        const slot = document.querySelector(`#slot-${i}`);
        slot.replaceChildren();
    }

    slotNumber = 1;
    hitButtonText.textContent = "Hit";
}