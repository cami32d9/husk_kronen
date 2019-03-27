document.addEventListener("DOMContentLoaded", start);

// Chosen value er det svar, vi man har valgt i quizzen. Når man ikke har valgt noget, er den sat til "null" for at
// submit-knapperne ved, at de ikke skal gøre noget, når chosenValue er "null".
let chosenValue = "null";

// questions loades fra json i getJson()
let questions = [];

// questionNumber tæller op for hvert spørgsmål man har svaret på, så det næste spørgsmål bliver loadet og vist.
let questionNumber = 1;

// points er antallet af spørgsmål man har svaret rigtigt på indtil videre.
let points = 0;

// div'en som indeholder alt i quizzen, bortset fra den første start-knap.
const questionContainer = document.querySelector(".question_container");

// Det eneste der sker, når siden loades, er, at json-filen loades. Spørgsmålene vises ikke endnu.
function start() {
    console.log("start()");

    async function getJson() {
        console.log("getJson");
        let jsonData = await fetch("quiz.json");
        questions = await jsonData.json();
    }

    getJson();
}

// Når man trykker på "start_quiz" knappen køres funktionen; den skjuler knappen, gør spørgsmåls-vinduet synligt og kører
// næste funktion
function startQuiz() {
    document.querySelector(".start_quiz").classList.add("hidden");
    document.querySelector(".question_container").classList.remove("hidden");
    questionNumber = 1;
    points = 0;
    loadQuestion();
}

// Når et nyt spørgsmål loades, sættes chosenValue til "null", så man ikke kan trykke videre før man har valgt et svar.
// Hvis questionNumber fra dette script matcher questionNumber fra quiz.json, vises spørgsmålet i questionContainer.
// Dvs. kun ét spørgsmål vises, med det rigtige questionNumber. Herefter tilføjes eventListeners til svarene og
// submit-knappen.
function loadQuestion() {
    chosenValue = "null";
    console.log("Value: " + chosenValue);
    console.log("questionNumber:" + questionNumber);
    questions.forEach(question => {
        if (questionNumber === question.questionNumber) {
            questionContainer.innerHTML = `
                        ${question.question}<br>
                        <hr>
                            <label><input type="radio" class="choice" name="choice" value="${question.answerA}">${question.answerA}<br></label>
                            <label><input type="radio" class="choice" name="choice" value="${question.answerB}">${question.answerB}<br></label>
                            <label><input type="radio" class="choice" name="choice" value="${question.answerC}">${question.answerC}<br></label>
                            <input type="submit" onclick="loadAnswer()" value="Svar">
`;
        }

    });
    addChoiceListeners();
}

// Tilføjer eventListeners til valgene. Når man vælger et svar, ændrer den chosenValue til at stemme overens med valget.
function addChoiceListeners() {
    document.querySelectorAll(".choice").forEach(choice =>
        choice.addEventListener("click", function () {
            chosenValue = this.getAttribute("value");
            console.log("chosenValue: " + chosenValue);
        })
    );
}

// Når man trykker "næste" fra et spørgsmål, tjekker den først om chosenValue er "null", altså om man ikke har valgt et
// svar. Er det tilfældet, gør functionen intet.
// Er chosenValue ikke "null", tjekker den igen questionNumber og hvilket svar den skal loade. Herefter tjekker den, om
// chosenValue er lig med correctAnswer (fra json), og skriver om svaret er rigtigt eller forkert og loader det
// tilsvarende svar fra json. Er chosenValue lig med correctAnswer, tilføjer den desuden ét point.
function loadAnswer() {
    console.log("Submitted " + chosenValue);
    if (chosenValue === "null") {
        document.querySelector(".error_text").innerHTML = `
        Du skal vælge et svar, før du kan gå videre!
`
    }

    else {
        questions.forEach(question => {
            if (questionNumber === question.questionNumber) {

                document.querySelector(".error_text").innerHTML = "";

                if (chosenValue === question.correctAnswer) {
                    questionContainer.innerHTML = `
                        <h2 class="correct">✓ Rigtigt svar!</h2>
                        `;
                    points++;
                }

                else {
                    questionContainer.innerHTML = `
                        <h2 class="incorrect">✗ Forkert svar!</h2>
`;
                }

                questionContainer.innerHTML += `
                        <p>${question.description}</p>
                        <input type="submit" onclick="continueQuiz()" value="Næste">
`;
                }

            })
        }
    }



// Når man går videre fra et svar, tilføjes én til questionNumber. Herefter tjekkes, som questionNumber herfra matcher
// et questionNumber fra json-filen. Passer dette, loader den det næste spørgsmål med loadQuestion().
// Hvs questionNumber nu er større end det største questionNumber i json, kører den loadEnd() i stedet, for at vise
// slutningen på quizzen.
function continueQuiz() {
    console.log("ContinueQuiz");
    questionNumber++;

    questions.forEach(question => {

        if (questionNumber === question.questionNumber) {
            loadQuestion();
        }

        else if (questionNumber > question.questionNumber) {
            loadEnd();
        }
    })
}

// Hvis questionNumber herfra er større end questionNumber fra json, bliver loadEnd kørt. Denne viser at quizzen er
// færdig, antallet af point og en knap til at starte quizzen forfra.
// questionNumber er nu 1 større end antallet af spørgsmål/det højeste questionNumber fra json. For at finde det totale
// antal sørgsmål, laver vi derfor variablen totalQuestionNumber = questionNumber - 1, og bruger denne i teksten.
function loadEnd() {
    let totalQuestionNumber = questionNumber - 1;
    questionContainer.innerHTML = `
                        <h2>Quizzen er slut!</h2>
                <p>Du svarede rigtigt på <b>${points} / ${totalQuestionNumber} spørgsmål.</b></p>
                <p>Var svarene, som du havde forventet?</p>
                <p>Mange danskere over 60 cykler regelmæssigt, og det er vigtigt for os alle, at vi passer på hinanden -
                og på os selv. Så husk at bruge hjelm, og vær opmærksom i trafikken.</p>
                <input type="submit" onclick="startQuiz()" value="Prøv quizzen igen">
`
}
