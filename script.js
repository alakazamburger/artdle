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

    inp.addEventListener('input', (e) => {
      // check if it was even a letter
      var charAscii = e.target.value.charCodeAt()
      if (charAscii < 97 || charAscii > 122) {
        document.getElementById(inp.id).value = ''
        return
      }

      var numId = parseInt(inp.id)
      if (inp.value.length === 1) {

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
        }

        if (numId+1 >= ROWS*COLS) return // don't continue on to a nonexistent cell
        document.getElementById(numId+1).focus()
      }
    });

    inp.addEventListener('keydown', (e) => {
      var numId = parseInt(inp.id)
      if (inp.value.length === 0 && e.key === 'Backspace' && numId-1 >= 0) {
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
  var rowStart = row*COLS

  for (n = 0; n < 5; n++) {
    var cell = document.getElementById(rowStart+n)

    if (targetArr[n] === guessArr[n]) {
      // green
      cell.style.backgroundColor = "#00d100"
      targetArr[n] = "" // removes potential for double counting it when doing yellows
    }

    // disable text in cells now, might as well
    cell.disabled = true
  }

  // must happen AFTER all greens are found (consider the As in 'APART' tested against 'PLACE')
  for (n = 0; n < 5; n++) {
    if (targetArr.includes(guessArr[n])) {
      // yellow
      document.getElementById(rowStart+n).style.backgroundColor = "#ffec3d"
      targetArr[targetArr.indexOf(guessArr[n])] = ""

    } else {
      // grey
      if (document.getElementById(rowStart+n).style.backgroundColor !== "") continue // must be green/yellow - do NOT make this grey
      document.getElementById(rowStart+n).style.backgroundColor = "#d8d8d8"
    }
  }


}

function textareaClicked(r, c) {
//   console.log(document.getElementById(r*COLS+c).value)
}