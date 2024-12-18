const counter = document.querySelector("#counter");
const amountToChange = document.querySelector("#amount-to-change");
const incrementer = document.querySelector("#incrementer");
const decrementer = document.querySelector("#decrementer");

incrementer.addEventListener("click", (event) => {
    adjustCounter(amountToChange, "inc");
});

decrementer.addEventListener("click", (event) => {
    adjustCounter(amountToChange, "dec");
});

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