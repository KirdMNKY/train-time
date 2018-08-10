/*
    Train Time
  - Mike Soto -
*/


$(document).ready(function(){


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD16x6AjY-OzSCWDvZqiXueue-TlG9CPDk",
        authDomain: "train-time-d635d.firebaseapp.com",
        databaseURL: "https://train-time-d635d.firebaseio.com",
        projectId: "train-time-d635d",
        storageBucket: "",
        messagingSenderId: "360938470386"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //variables
    var trainName = "";
    var destination = "";
    var startTime = "00:00";
    var frequency = "00";
    var minsAway = "";
    var nextArrival = "";

    $("#submit").on("click", function(event){
        event.preventDefault();

        //Get User Values
        trainName = $("#train-name").val().trim();
        destination = $("#train-destination").val().trim();
        startTime = $("#start-time").val().trim();
        frequency = $("#frequency").val().trim();

        //Calculate minsAway
        minsAway = calcMinsAway(startTime, frequency);

        //Calculate nextArrival
        nextArrival = calcNextArrival(startTime, frequency);

        //Set Values on DB
        database.ref().set({
            name: trainName,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
            nextArrival: nextArrival,
            minsAway: minsAway
        });

        //Firebase Updates
        database.ref().on("child_added", function(childsnapshot){
            //Create and Append Table Elements
            var newRow = $("<tr>");
            var NameTrain = $("<td>").text(childsnapshot.val().name);
            var DestinationTrain = $("<td>").text(childsnapshot.val().destination);
            var NextArrivalTrain = $("<td>").text(childsnapshot.val().nextArrival);
            var FrequencyTrain = $("<td>").text(childsnapshot.val().frequency);
            var MinsAwayTrain = $("<td>").text(childsnapshot.val().minsAway);

            //Append All Table Elements
            newRow.append(NameTrain);
            newRow.append(DestinationTrain);
            newRow.append(NextArrivalTrain);
            newRow.append(FrequencyTrain);
            newRow.append(MinsAwayTrain);
            
            $("#table-body").prepend(newRow);

        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);    
        });

        function calcMinsAway(startTime, frequency){
            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % frequency;
            console.log(tRemainder);

            // Minute Until Train
            var tMinutesTillTrain = frequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
            return tMinutesTillTrain;

        }

        function calcNextArrival(startTime, frequency){
            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % frequency;
            console.log(tRemainder);

            // Next Train
            var tMinutesTillTrain = frequency - tRemainder;
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
            return nextTrain;
        }


    });



});