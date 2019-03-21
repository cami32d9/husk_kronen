document.addEventListener("DOMContentLoaded", start);

// Chosen value er det svar, vi man har valgt i quizzen
let choselValue = "";

// Questions loades fra json i getJson()
let questions = [];

// questionNumber tæller op for hvert spørgsmål man har svaret på, så det næste spørgsmål bliver loadet og vist.
// Den starter på 0, da loadQuestion() lægger et tal til allerede første gang, og dermed finder spørgsmål nr 1.
let questionNumber = 0;

let points = 0;

const questionContainer = document.querySelector(".question_container");

// Det eneste der sker, når siden loades, er, at json-filen loades. Spørgsmålene vises ikke endnu
function start() {
    console.log("start()");
    console.log("questionNumber: " + questionNumber);

    async function getJson() {
        console.log("getJson");
        let jsonData = await fetch("quiz.json");
        questions = await jsonData.json();
    }

    getJson();
}

// Når man trykker på "start_quiz" knappen køres funktionen; den skjuler knappen, gør spørgsmåls-vinduet synligt og kører
// næste function
function startQuiz() {
    document.querySelector(".start_quiz").classList.add("hidden");
    document.querySelector(".question_container").classList.remove("hidden");
    questionNumber = 0;
    points = 0;
    loadQuestion();
}

// loadQuestion() lægger ét tal til questionNumber, så den loader det næste spørgsmål. Hvis questionNumber fra script.js
// er ens med questionNumber fra quiz.json, vises spørgsmålet i questionContainer. Efter den viser spørgsmålet tilføjer
// den eventlisteners.
// Hvis questionNumber er højere end de eksisterende questionNumbers i json-filen, skriver den at quizzen er færdig i
// stedet for at loade et nyt spørgsmål.
function loadQuestion() {
    questionNumber++;
    console.log("questionNumber:" + questionNumber);
    questions.forEach(question => {
        if (questionNumber === question.questionNumber) {
            questionContainer.innerHTML = `
                        ${question.question}<br>
                            <input type="radio" class="choice" name="choice" value="${question.answerA}">${question.answerA}<br>
                            <input type="radio" class="choice" name="choice" value="${question.answerB}">${question.answerB}<br>
                            <input type="radio" class="choice" name="choice" value="${question.answerC}">${question.answerC}<br>
                            <input type="submit" onclick="loadAnswer()" value="Næste">
`;
        }

        else if (questionNumber > question.questionNumber) {
            let totalQuestionNumber = questionNumber - 1;
            questionContainer.innerHTML = "Quizzen er færdig. Du svarede rigtigt på " + points + "/" + totalQuestionNumber + " spørgsmål."
                // `<input type="submit" onclick="loadQuestion()" value="Næste">`
            ;
        }

    });
    addChoiceListeners();
}

// Når man trykker "næste" fra et spørgsmål, tjekker den igen questionNumber og hvilket svar den skal loade. Hvis
// chosenValue er lig med correctAnswer, skriver den, at det er rigtigt og loader det tilsvarende svar. Er chosenValue
// ikke lig med correctAnswer, viser den, at svaret er forkert.
function loadAnswer() {
    console.log("Submitted " + chosenValue);

    questions.forEach(question => {
        if (questionNumber === question.questionNumber) {
            if (chosenValue === question.correctAnswer) {
                questionContainer.innerHTML = `
                        <h2>Rigtigt svar!</h2>
                        <p>${question.answerIsCorrect}</p>
                        <input type="submit" onclick="loadQuestion()" value="Næste">
`;
                points++;
            }
            else {
                questionContainer.innerHTML = `
                        <h2>Forkert svar!</h2>
                        <p>${question.answerIsIncorrect}</p>
                        <input type="submit" onclick="loadQuestion()" value="Næste">
`;
            }
        }
    });

    console.log("Points:" + points);

    addChoiceListeners();
}


// -------------------------------


// Tilføjer eventListeners til valgene. Når man vælger et svar, ændrer den chosenValue til at stemme overens med valget.
function addChoiceListeners() {
    document.querySelectorAll(".choice").forEach(choice =>
        choice.addEventListener("click", function () {
            chosenValue = this.getAttribute("value");
            console.log("chosenValue: " + chosenValue);
        })
    );
}
