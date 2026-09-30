const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const playerName = document.getElementById("playerName");
const playerDisplay = document.getElementById("playerDisplay");

const startBtn = document.getElementById("startBtn");
const shootBtn = document.getElementById("shootBtn");
const restartBtn = document.getElementById("restartBtn");

const power = document.getElementById("power");
const powerValue = document.getElementById("powerValue");

const roundDisplay = document.getElementById("roundDisplay");
const goalsDisplay = document.getElementById("goals");

const keeper = document.getElementById("keeper");
const ball = document.getElementById("ball");
const message = document.getElementById("message");
const flash = document.getElementById("flash");

const finalGoals = document.getElementById("finalGoals");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultIcon = document.getElementById("resultIcon");

const statGoals = document.getElementById("statGoals");
const statSaves = document.getElementById("statSaves");
const statShots = document.getElementById("statShots");

let currentRound = 1;
let goals = 0;
let saves = 0;
let shots = 0;
let selectedDirection = null;
let gameLocked = false;


/* اختيار الاتجاه */

document.querySelectorAll(".direction-btn").forEach(button => {

    button.addEventListener("click", () => {

        if (gameLocked) return;

        document.querySelectorAll(".direction-btn")
            .forEach(btn => btn.classList.remove("selected"));

        button.classList.add("selected");

        selectedDirection = button.dataset.direction;

        message.textContent = "تمام... الحين حدد قوة التسديدة ⚡";
    });

});


/* تغيير القوة */

power.addEventListener("input", () => {
    powerValue.textContent = power.value + "%";
});


/* بدء المباراة */

startBtn.addEventListener("click", () => {

    let name = playerName.value.trim();

    if (!name) {
        name = "اللاعب";
    }

    playerDisplay.textContent = name;

    currentRound = 1;
    goals = 0;
    saves = 0;
    shots = 0;

    updateScore();

    homeScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    gameScreen.classList.add("active");

    resetShot();

});


/* تنفيذ التسديدة */

shootBtn.addEventListener("click", () => {

    if (gameLocked) return;

    if (!selectedDirection) {
        message.textContent = "اختر اتجاه التسديدة أولًا ⚽";
        return;
    }

    gameLocked = true;
    shots++;

    const directions = ["left", "center", "right"];

    const keeperDirection =
        directions[Math.floor(Math.random() * directions.length)];

    const selectedPower = Number(power.value);

    keeper.className = "keeper " + keeperDirection;
    ball.className = "ball " + selectedDirection;

    let isGoal = false;

    /*
        كلما زادت القوة بشكل معقول
        تزيد فرصة التسجيل.
        لكن الحارس لديه فرصة تصدي.
    */

    const powerBonus =
        selectedPower >= 45 && selectedPower <= 85 ? 0.15 : 0;

    if (selectedDirection !== keeperDirection) {

        let chance = 0.78 + powerBonus;

        if (Math.random() < chance) {
            isGoal = true;
        }

    } else {

        if (selectedPower > 85 || selectedPower < 25) {
            isGoal = Math.random() < 0.15;
        } else {
            isGoal = Math.random() < 0.08;
        }

    }

    setTimeout(() => {

        flash.classList.add("show");

        setTimeout(() => {
            flash.classList.remove("show");
        }, 350);

        if (isGoal) {

            goals++;

            message.textContent = "⚽ جوووول! تسديدة رائعة 🔥";

        } else {

            saves++;

            message.textContent = "🧤 الحارس تصدى لها!";

        }

        updateScore();

    }, 500);


    setTimeout(() => {

        if (currentRound >= 5) {

            finishGame();

        } else {

            currentRound++;

            roundDisplay.textContent = currentRound;

            resetShot();

            gameLocked = false;

        }

    }, 1500);

});


/* تحديث النتيجة */

function updateScore() {

    goalsDisplay.textContent = goals;
    roundDisplay.textContent = currentRound;

}


/* إعادة وضع الكرة */

function resetShot() {

    selectedDirection = null;

    document.querySelectorAll(".direction-btn")
        .forEach(btn => btn.classList.remove("selected"));

    keeper.className = "keeper";
    ball.className = "ball";

    power.value = 60;
    powerValue.textContent = "60%";

    message.textContent = "اختر مكان التسديدة";

}


/* نهاية المباراة */

function finishGame() {

    setTimeout(() => {

        gameScreen.classList.remove("active");
        resultScreen.classList.add("active");

        finalGoals.textContent = goals;

        statGoals.textContent = goals;
        statSaves.textContent = saves;
        statShots.textContent = shots;

        if (goals === 5) {

            resultIcon.textContent = "🏆";
            resultTitle.textContent = "مباراة خرافية!";
            resultText.textContent =
                "ولا ركلة ضاعت! أداء ممتاز أمام الحارس.";

        } else if (goals >= 3) {

            resultIcon.textContent = "🔥";
            resultTitle.textContent = "أداء قوي!";
            resultText.textContent =
                "قدمت مباراة ممتازة وسجلت " + goals + " أهداف.";

        } else if (goals >= 1) {

            resultIcon.textContent = "⚽";
            resultTitle.textContent = "انتهت المباراة";
            resultText.textContent =
                "سجلت " + goals + " من أصل 5 ركلات.";

        } else {

            resultIcon.textContent = "🧤";
            resultTitle.textContent = "الحارس كان جاهز!";
            resultText.textContent =
                "هذه المرة الحارس تفوق عليك.";

        }

    }, 500);

}


/* إعادة اللعب */

restartBtn.addEventListener("click", () => {

    resultScreen.classList.remove("active");
    gameScreen.classList.add("active");

    currentRound = 1;
    goals = 0;
    saves = 0;
    shots = 0;

    updateScore();

    resetShot();

    gameLocked = false;

});
