
      function checkLength(){
        var userInput = document.getElementById("userInput");
        var textOutput = document.getElementById("textOutput");
        var textLength = userInput.value.length;
        textOutput.value = textLength;
      }

      function validateForm() {
          var x = document.forms["testform"]["userInput"].value;
          if (x == null || x == "") {
              alert("Must input characters");
              return false;
          }
      }


      function getLetterCounts() {
        var userInput = document.getElementById("userInput");

        var lettersArray = userInput.value.split(""); // split string into array of chars
        var letterCount = {};
        for (var i=0;i<lettersArray.length;i++) { // loop over letters
          var currentLetter = lettersArray[i]; // current letter

          if (letterCount[currentLetter] == undefined)
            letterCount[currentLetter] = 1; // first time we see it, set it to one
          else
            letterCount[currentLetter]++; // we've already seen this letter, increase
        }
        return letterCount;
      }

      function printOutLetterCounts(letterCount) {
        // print out letters and their count in table
        var tableContent = document.getElementById("tableContent");
        var curRange = 0;
        // loop over letterCount object
        tableContent.innerHTML = ""; // empty it
        for (var currentLetter in letterCount) {
          tableContent.innerHTML += "<tr><td>"
            + currentLetter + "</td><td>"  // current letter
            + letterCount[currentLetter] + "</td><td>" // count of current letter
            + letterCount[currentLetter] / textOutput.value + "</td><td>" // probabilituy of current letter
            + Math.floor(curRange * 255) + "</td><td>" // decimal low range of current letter
            + Math.floor(((curRange + letterCount[currentLetter] / textOutput.value)*100)/100 * 255) + "</td><td>" // decimal high range of current letter
            + Math.floor((curRange * 255).toString(2)) + "</td><td>" // binary low range of current letter
            + (Math.floor(((curRange + letterCount[currentLetter] / textOutput.value)*100)/100 * 255)).toString(2) + "</td><td>" // binary high range of current letter
            + curRange + "</td><td>"  // low range number
            + Math.round((curRange + letterCount[currentLetter] / textOutput.value)*100)/100 + "</td></tr>"; // high range number
          curRange = Math.round((curRange + letterCount[currentLetter] / textOutput.value)*100)/100;
        }
      }

      function getRanges(letterCount) {
        var letterRange = {};
        var textOutput = document.getElementById("textOutput");
        for (var currentLetter in letterCount) {
          var probability = letterCount[currentLetter] / textOutput.value;
          letterRange[currentLetter] = probability;
        }
        return letterRange;
      }

      function makeRangeSet(ranges) {
        var previousRanges = 0; // used to hold the accumulated previous ranges
        var letterRangeSet = {}; // these should be the final ranges
        for (var currentLetter in ranges) {
          letterRangeSet[currentLetter] = [previousRanges, previousRanges + ranges[currentLetter]];
          previousRanges += ranges[currentLetter];
        }
        return letterRangeSet;
      }

      function visualizeRanges(ranges) {
        var rangeTableContent = document.getElementById("rangeTableContent");
        rangeTableContent.innerHTML = ""; // empty it
        for (var currentLetter in ranges) {
          var rangeStartAt = ranges[currentLetter][0] * 100; // first item in array is where the range starts
          var rangeLength = (ranges[currentLetter][1] - ranges[currentLetter][0]) * 100; // second item in array is where the range stops

          // we make the startAt a margin to the left of the block
          // we make the end of the range the length

          // print out
          rangeTableContent.innerHTML +=
            "<tr><td class='letter'>" + currentLetter + "</td><td colspan='3'>" +
            "<div class='range' style='width: " + rangeLength + "%;margin-left: "+rangeStartAt+"%'></div>" +
            "</td></tr>";

        }
      }


      // run when button is clicked
      function doCalculation() {
        checkLength();
        var letterCount = getLetterCounts();
        printOutLetterCounts(letterCount);
        var letterRange = getRanges(letterCount);
        var rangeSet = makeRangeSet(letterRange);

        visualizeRanges(rangeSet);

      }
