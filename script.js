const ICONS = [
    'apple', 'big_win', 'cherry', 'lemon', 'lucky_seven', 'orange', 'watermelon',
];

/**
 * @type {number} The minimum spin time in seconds
 */
const BASE_SPINNING_DURATION = 2.7;

/**
 * @type {number} The additional duration to the base duration for each row (in seconds).
 */
const COLUMN_SPINNING_DURATION = 0.3;

var cols;

window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');
    setInitialItems();
});

function setInitialItems() {
    let baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3);
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="items/' + icon + '.png"></div>';
            elms += item;

            if (x < 3) firstThreeElms += item;
        }
        col.innerHTML = elms + firstThreeElms;
    }
}

function spin(elem) {
    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    elem.setAttribute('disabled', true);
    document.getElementById('container').classList.add('spinning');

    window.setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    window.setTimeout(function () {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
    }.bind(elem), duration * 1000);
}

function setResult() {
    let finalResults = [];

    for (let col of cols) {
        let results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];

        let icons = col.querySelectorAll('.icon img');

        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[(icons.length - 3) + x].setAttribute('src', 'items/' + results[x] + '.png');
        }

        finalResults.push(results);
    }

    checkWin(finalResults);
}

function checkWin(finalResults) {
    let firstCol = finalResults[0];

    let isWin = finalResults.every(col =>
        col[0] === firstCol[0] &&
        col[1] === firstCol[1] &&
        col[2] === firstCol[2]
    );

    let payout = 0;

    if (isWin) {
        payout = calculatePayout(firstCol);
        showMessage("🎉 YOU WIN! Payout: " + payout);
    } else {
        showMessage("No win — try again!");
    }
}

function calculatePayout(symbols) {
    let icon = symbols[0];

    switch (icon) {
        case 'lucky_seven': return 500;
        case 'big_win': return 200;
        case 'cherry': return 50;
        default: return 20; // generic 3-of-a-kind payout
    }
}

function showMessage(msg) {
    const box = document.getElementById("resultBox");
    box.innerText = msg;
    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}
