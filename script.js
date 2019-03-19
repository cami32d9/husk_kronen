document.addEventListener("DOMContentLoaded", start);
let choselValue = "";

function start() {
    console.log("start()");

    document.querySelectorAll(".choice").forEach(choice =>
        choice.addEventListener("click", function() {
            chosenValue = this.getAttribute("value");
        console.log(chosenValue);
    })
    );
}

function submit() {
    console.log("Submitted " + chosenValue);
}
