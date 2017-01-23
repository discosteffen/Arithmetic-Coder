var END = "end of string";

function tSymbolFrequencies(s) {
    var frequencies = {};

    for (var i = 0; i < s.length; i++) {
        var sym = s[i];

        if (!frequencies[sym])
            frequencies[sym] = 0;

        frequencies[sym]++;
    }

    return frequencies;
}

function tSum(freqs) {
    var sum = 0;
    for (var letter in freqs)
        sum += freqs[letter];

    return sum;
}

function tRanges(freqs) {
    var ranges = {};
    var total = tSum(freqs);

    var lo = 0;
    for (letter in freqs) {
        var hi = lo + freqs[letter] / total;
        ranges[letter] = [lo, hi];
        lo = hi;
    }

    return ranges;
}

function tEncode(ranges, s) {
    var lo = 0;
    var hi = 1;

    var table = document.getElementById("tableContent2")
    var graph = document.getElementById("rangeTableContent2");
    table.innerHTML += ('<tr><td colspan=9 align=center><strong>Steps Involved</strong></td></tr>');
    tableContent2.innerHTML = ""; // empty it
        table.innerHTML += ('<tr><td colspan=9 align=center><strong>Encode letter</strong></td></tr>');
    graph.innerHTML = ""; // empty it
    for (var i = 0; i < s.length; i++) {

        var sym = s[i];
        var range = ranges[sym];

        var len = hi - lo;
        var slo = lo + range[0] * len;
        var shi = lo + range[1] * len;
//        table.innerHTML += ('<tr><td colspan=9 align=center>Before Swapping</td></tr>');
//        table.innerHTML += ('<tr><td colspan=9>String: ' + s[i] + '<br />Lo: ' + lo + '<br />Hi: ' + hi + '</td></tr>');
        lo = slo;
        hi = shi;

        table.innerHTML += ('<tr><td colspan=4><table border=0 width=100%><tr><td width="100">Character: ' + s[i] + '</td><td  width="150">Low: ' + lo + '</td><td>High: ' + hi + '</td><td>'+ (lo.toPrecision(17) % lo) +'</td></tr></table></td></tr>'); // underflow not right yet.
        graph.innerHTML += ('<tr><td class="letter">' + s[i] + '</td><td colspan="3"><div class="range" style="width: ' + len*100 + '%; margin-left: ' + lo*100 + '%"></div></td></tr>'); // Draws the steps. There is a bug here.
//  graph.innerHTML += ('<tr><td class="letter">' + s[i] + '</td><td colspan="3"><div class="range" style="width: ' + hi*100 + '%; margin-left: ' + lo*100 + '%"></div></td></tr>'); // Draws the steps. There is a bug here.
    }

    return lo;
}

function tSymAtPoint(ranges, x) {
    for (var sym in ranges)
        if (ranges[sym][0] <= x && ranges[sym][1] >= x)
            return sym;
}

function tDecode(ranges, x) {
    var result = "";
    var table = document.getElementById("tableContent2")
        table.innerHTML += ('<tr><td colspan=9 align=center><strong>Decode Steps</strong></td></tr>');
    for (var i = 0;; i++) {
        var sym = tSymAtPoint(ranges, x);
        if (!sym)
            throw "Failed to look up symbol";

        if (sym == END)
            break;

        result += sym;

        var range = ranges[sym];
        x -= range[0];
        x *= 1.0 / (range[1] - range[0]);
        table.innerHTML += ('<tr><td colspan=4><table border=0 width=100%><tr><td width="100">Character: ' + sym + '</td><td align="left" width="150">Low: ' + range[0] + '</td><td align="left">High: ' + range[1]  + '</td></tr></table></td></tr>'); // decode steps

    }

    return result;
}

/**
 * Convert a string into a sequence of symbols with an end-marker.
 */
function tSequence(s) {
    var seq = [];
    for (var i = 0; i < s.length; i++)
        seq.push(s[i]);

    seq.push(END);

    return seq;
}

/**
* Print out the stuff
*/
function printData(letterCount, ranges) {

  // TABLE DATA -----------------------------------------------
  var tableContent = document.getElesmentById("encoderData");
  var curRange = 0;
  // loop over letterCount object
  tableContent2.innerHTML = ""; // empty it
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

  // VISUALIZATION  -----------------------------------------------

  var rangeTableContent = document.getElementById("encoderVisualized");
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

function enCoder() {
    var userInput = document.getElementById("userInput").value;
    var input = tSequence(userInput);
    var table = document.getElementById("tableContent2")

    var ranges = tRanges(tSymbolFrequencies(input));
    var result = tEncode(ranges, input);
    console.log(tSymbolFrequencies(input));
//    table.innerHTML += ('<tr><td colspan=9 align=center><strong>String Identity</strong></td></tr>');
//    temp = tSymbolFrequencies(input);
//    for (var obj in temp)
//        table.innerHTML += ('<tr><td colspan=9 align=center>' + obj + ": " + temp[obj] + '</td></tr>');
    console.log(ranges);
//    table.innerHTML += ('<tr><td colspan=9 align=center><strong>Decoded Values</strong></td></tr>');
//    for (obj in ranges)
//        table.innerHTML += ('<tr><td colspan=9 align=center>' + obj + ": " + ranges[obj] + '</td></tr>');
//    console.log(result);
//    table.innerHTML += ('<tr><td colspan=9 align=center>Encoded Value is <strong>' + result + '</strong></td></tr>');


    var reverse = tDecode(ranges, result);
    console.log(reverse);

      table.innerHTML += ("<tr><td colspan=4 align=center>Encoded Value: <b>"
      + result + "</b></td></tr><tr><td colspan=4 align=center>Decoded: <b>"
      + reverse + "</b></td></tr>")

//    printData(tSymbolFrequencies(input), ranges);
}
