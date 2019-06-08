$(document).ready(function() {
    $("#remaining-time").hide();
    $("#start").on("click", game.startGame);
    $(document).on("click", ".option", game.guessChecker);
  });
  
  var game = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 15,
    timerOn: false,
    timerId: "",
    // questions options and answers:
    questions: {
      q1: "What did Rachel and Chandler eat off of the floor?",
      q2: "What does Phoebe get a tattoo of?",
      q3: "Who have been friends since high school?",
      q4: "Who does Phoebe end up with?",
      q5: "What does Monica do for work?",
      q6: "Which Friend dates Janice first?",
      q7: "What instrument does Phoebe play?",
      q8: "Which Friend gets thier identity stolen?",
      q9: "What game did Chandler make up to give Joey money?",
      q10: "Where do they all travel to when Ross is a key note speaker?"
    },
    options: {
      q1: ["Ice Cream", "Souffle", "Cream Cheese", "Cheesecake"],
      q2: ["A heart", "The sun", "The whole world", "A freckle"],
      q3: ["Phoebe and Rachel", "Ross and Chandler", "Monica and Rachel", "Chandler and Joey"],
      q4: ["Joey", "David", "Mike", "Duncan"],
      q5: ["Waitress", "Doctor", "Massesuse", "Chef"],
      q6: ["Joey", "Chandler", "Gunther", "Ross"],
      q7: ["Violin", "Ukulele", "Guitar", "Piano"],
      q8: ["Phoebe", "Rachel", "Monica", "Ursula"],
      q9: ["Bamboozle", "Yahtzee", "Cups", "Flip a coin"],
      q10: ["Maiami", "Jamaica", "Aruba", "Barbados"]
    },
    answers: {
      q1: "Cheesecake",
      q2: "The whole world",
      q3: "Monica and Rachel",
      q4: "Mike",
      q5: "Chef",
      q6: "Chandler",
      q7: "Guitar",
      q8: "Monica",
      q9: "Cups",
      q10: "Barbados"
    },
    // method to initialize game
    startGame: function() {
      // restarting game results
      game.currentSet = 0;
      game.correct = 0;
      game.incorrect = 0;
      game.unanswered = 0;
      clearInterval(game.timerId);
  
      // show game section
      $("#game").show();
  
      //  empty last results
      $("#results").html("");
  
      // show timer
      $("#timer").text(game.timer);
  
      // remove start button
      $("#start").hide();
  
      $("#remaining-time").show();
  
      // ask first question
      game.nextQuestion();
    },
    // method to loop through and display questions and options
    nextQuestion: function() {
      // set timer to 15 seconds each question
      game.timer = 15;
      $("#timer").removeClass("last-seconds");
      $("#timer").text(game.timer);
  
      // to prevent timer speed up
      if (!game.timerOn) {
        game.timerId = setInterval(game.timerRunning, 1000);
      }
  
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(game.questions)[game.currentSet];
      $("#question").text(questionContent);
  
      // an array of all the user options for the current question
      var questionOptions = Object.values(game.options)[game.currentSet];
  
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key) {
        $("#options").append(
          $('<button class="option btn btn-info btn-lg">' + key + "</button>")
        );
      });
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning: function() {
      // if timer still has time left and there are still questions left to ask
      if (
        game.timer > -1 &&
        game.currentSet < Object.keys(game.questions).length
      ) {
        $("#timer").text(game.timer);
        game.timer--;
        if (game.timer === 4) {
          $("#timer").addClass("last-seconds");
        }
      }
      // the time has run out and increment unanswered, run result
      else if (game.timer === -1) {
        game.unanswered++;
        game.result = false;
        clearInterval(game.timerId);
        resultId = setTimeout(game.guessResult, 1000);
        $("#results").html(
          "<h3>Out of time! The answer was " +
            Object.values(game.answers)[game.currentSet] +
            "</h3>"
        );
      }
      // if all the questions have been shown end the game, show results
      else if (game.currentSet === Object.keys(game.questions).length) {
        // adds results of game (correct, incorrect, unanswered) to the page
        $("#results").html(
          "<h3 style='color:blue;'>Thank you for playing!</h3>" +
            "<p>Correct: " +
            game.correct +
            "</p>" +
            "<p>Incorrect: " +
            game.incorrect +
            "</p>" +
            "<p>Unaswered: " +
            game.unanswered +
            "</p>" +
            "<p><strong>Please play again!</strong></p>"
        );
  
        // hide game sction
        $("#game").hide();
  
        // show start button to begin a new game
        $("#start").show();
      }
    },
    // method to evaluate the option clicked
    guessChecker: function() {
      // timer ID for gameResult setTimeout
      var resultId;
  
      // the answer to the current question being asked
      var currentAnswer = Object.values(game.answers)[game.currentSet];
  
      // if the text of the option picked matches the answer of the current question, increment correct
      if ($(this).text() === currentAnswer) {
        // turn button green for correct answer
        $(this)
          .addClass("btn-success")
          .removeClass("btn-info");
  
        game.correct++;
        clearInterval(game.timerId);
        resultId = setTimeout(game.guessResult, 1000);
        $("#results").html("<h3>Correct Answer!</h3>");
      }
      // else the user picked the wrong option, increment incorrect
      else {
        // turn button clicked red for incorrect answer
        $(this)
          .addClass("btn-danger")
          .removeClass("btn-info");
  
        game.incorrect++;
        clearInterval(game.timerId);
        resultId = setTimeout(game.guessResult, 1000);
        $("#results").html(
          "<h3>Better luck next time! " + currentAnswer + "</h3>"
        );
      }
    },
    // method to remove previous question results and options
    guessResult: function() {
      // increment to next question set
      game.currentSet++;
  
      // remove the options and results
      $(".option").remove();
      $("#results h3").remove();
  
      // begin next question
      game.nextQuestion();
    }
  };
  