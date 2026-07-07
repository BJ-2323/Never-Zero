function changeFormat() {

    const format = document.getElementById("format").value;
    const period = document.getElementById("period");
    const length = document.getElementById("periodLength");


    period.innerHTML = "";


    if (format === "quarters") {

        length.value = "8:00";

        period.innerHTML += "<option>1st Quarter</option>";
        period.innerHTML += "<option>2nd Quarter</option>";
        period.innerHTML += "<option>3rd Quarter</option>";
        period.innerHTML += "<option>4th Quarter</option>";

    } 

    else {

        length.value = "18:00";

        period.innerHTML += "<option>1st Half</option>";
        period.innerHTML += "<option>Halftime</option>";
        period.innerHTML += "<option>2nd Half</option>";

    }

}




function convertTime(timeText) {

    if (timeText.includes(":")) {

        let parts = timeText.split(":");

        let minutes = Number(parts[0]);
        let seconds = Number(parts[1]);

        return minutes + (seconds / 60);

    }

    else {

        return Number(timeText);

    }

}





function calculateProbability() {


    let teamA = Number(document.getElementById("teamA").value);
    let teamB = Number(document.getElementById("teamB").value);

    let difference = teamA - teamB;


    let totalScore = teamA + teamB;



    let format = document.getElementById("format").value;
    let period = document.getElementById("period").value;


    let length = convertTime(
        document.getElementById("periodLength").value
    );


    let currentTime = convertTime(
        document.getElementById("timeRemaining").value
    );



    let possession = document.getElementById("possession").value;



    let remainingGameTime;



    if(format === "quarters") {


        let quarter = Number(period.charAt(0));


        remainingGameTime =
        ((4 - quarter) * length) + currentTime;


    }


    else {


        if(period.includes("1st Half")) {

            remainingGameTime =
            length + currentTime + length;

        }

        else if(period.includes("Halftime")) {

            remainingGameTime = length;

        }

        else {

            remainingGameTime = currentTime;

        }

    }




    let totalGameTime;


    if(format === "quarters") {

        totalGameTime = length * 4;

    }

    else {

        totalGameTime = length * 2;

    }




    let timeRemainingPercent = remainingGameTime / totalGameTime;



    let timeMultiplier;


    if(timeRemainingPercent > 0.75) {

        timeMultiplier = 0.8;

    }

    else if(timeRemainingPercent > 0.50) {

        timeMultiplier = 1.2;

    }

    else if(timeRemainingPercent > 0.25) {

        timeMultiplier = 2;

    }

    else {

        timeMultiplier = 4;

    }




    let probabilityA = 50 + (difference * timeMultiplier);





    // Possession adjustment

    let possessionImpact;


    if(timeRemainingPercent > 0.50) {

        possessionImpact = 1;

    }

    else if(timeRemainingPercent > 0.25) {

        possessionImpact = 2;

    }

    else {

        possessionImpact = 3;

    }



    if(possession === "teamA") {

        probabilityA += possessionImpact;

    }

    else {

        probabilityA -= possessionImpact;

    }




    /*
   Scoring environment adjustment

   A 5 point lead in a 15 point game
   is much bigger than a 5 point lead in a 135 point game.
*/


let relativeLead = 0;


if(totalScore > 0) {

    relativeLead = Math.abs(difference) / totalScore;

}



let leadAdjustment = 0;


// Low scoring games make each point matter more

if(relativeLead > 0.30) {

    leadAdjustment = 4;

}

else if(relativeLead > 0.20) {

    leadAdjustment = 3;

}

else if(relativeLead > 0.10) {

    leadAdjustment = 1;

}

else {

    leadAdjustment = 0;

}



if(difference > 0) {

    probabilityA += leadAdjustment;

}

else if(difference < 0) {

    probabilityA -= leadAdjustment;

}





    if(probabilityA > 95) {

        probabilityA = 95;

    }


    if(probabilityA < 5) {

        probabilityA = 5;

    }



    let probabilityB = 100 - probabilityA;



    document.getElementById("result").innerHTML =

    `
    <h3>Never Zero Prediction</h3>

    Team A Win Probability:
    <strong>${probabilityA.toFixed(0)}%</strong>

    <br><br>

    Team B Win Probability:
    <strong>${probabilityB.toFixed(0)}%</strong>

    `;


}






function resetCalculator() {


    document.getElementById("teamA").value = "";

    document.getElementById("teamB").value = "";

    document.getElementById("timeRemaining").value = "";

    document.getElementById("possession").value = "teamA";

    document.getElementById("result").innerHTML = "";


}






window.onload = function() {

    changeFormat();

};