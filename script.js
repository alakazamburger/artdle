const ROWS = 6
const COLS = 5

// temporarily here
const wordArr = [
  "APPLE",
  "BACON",
  "CURRY",
  "DACON",
  "EGGGS",
  "FLAFL",
]
const theWord = "PLACE"

const tablediv = document.getElementById("maintable")

for (let i = 0; i < ROWS; i++) {
  const tr = document.createElement("tr")

  for (let j = 0; j < COLS; j++) {
    const inp = document.createElement("input")
    inp.id = i*COLS+j
    inp.type = "text"
    inp.maxLength = 1
    inp.className = "tabletextarea"

    const len = `${window.innerWidth/20}px`
    inp.style.width = len
    inp.style.height = len

    inp.addEventListener('click', () => {
      textareaClicked(i, j)
    })

    inp.addEventListener('input', () => {
      var numId = parseInt(inp.id)
      if (inp.value.length === 1 && numId < ROWS*COLS) {

        if ((numId+1)%COLS === 0) {
          // last cell of row; check if row is all filled in
          const charArr = []
          for (k = numId-(COLS-1); k <= numId; k++) {
            var v = document.getElementById(k).value
            if (v === '') return
            charArr.push(v)
          }

          // row is filled in - check against backend!
          var guess = charArr.join('').toUpperCase()
          var rowNum = Math.floor(numId/COLS)
          guessCheck(guess, rowNum)

          return // would otherwise be going forward a row
        }

        document.getElementById(numId+1).focus()
      }
    });

    inp.addEventListener('keydown', (e) => {
      var numId = parseInt(inp.id)
      if (inp.value.length === 0 && e.key === 'Backspace' && numId >= 0) {
        if (numId%COLS === 0) return // would otherwise be going back a row
        document.getElementById(numId-1).focus()
      }
    })

    tr.appendChild(inp)
  }

  tablediv.appendChild(tr)
}

function guessCheck(guess, row) {
  // fetch Blah blah blah blah

  // in the meantime...
  var target = wordArr[row]
  if (target !== guess) return // nope! wrong
  
  // colour in the squares
  const targetArr = theWord.split('')
  const guessArr = target.split('')
  console.log(targetArr)
  console.log(guessArr)
  var rowStart = row*COLS

  for (n = 0; n < 5; n++) {
    if (targetArr[n] === guessArr[n]) {
      // green
      document.getElementById(rowStart+n).style.backgroundColor = "#00ff00"
    } else if (targetArr.includes(guessArr[n])) {
      // yellow
      document.getElementById(rowStart+n).style.backgroundColor = "#ffff00"
    } else {
      // grey
      document.getElementById(rowStart+n).style.backgroundColor = "#aaaaaa"
    }
  }
}

function textareaClicked(r, c) {
//   console.log(document.getElementById(r*COLS+c).value)
}