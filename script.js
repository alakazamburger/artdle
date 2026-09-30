const ROWS = 6
const COLS = 5

const tablediv = document.getElementById("maintable")

// generate grid
for (let i = 0; i < ROWS; i++) {
  const tr = document.createElement("tr")

  for (let j = 0; j < COLS; j++) {
    const inp = document.createElement("input")
    inp.id = i*COLS+j
    inp.type = "text"
    inp.maxLength = 1
    inp.className = "tabletextarea"
    inp.autocomplete = "off"

    const len = `${window.innerWidth/25}px`
    inp.style.width = len
    inp.style.height = len

    /*inp.addEventListener('click', () => {
      textareaClicked(i, j) // maybe useful later??
    })*/

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
          for (let k = numId-(COLS-1); k <= numId; k++) {
            var cell = document.getElementById(k)
            if (cell.value === '') return
            charArr.push(cell.value)
          }

          // row is filled in - check against backend!
          // ...but first disable all boxes to prevent backspaces
          for (let k = numId-(COLS-1); k <= numId; k++) {
            document.getElementById(k).disabled = true
          }

          var guess = charArr.join('').toUpperCase()
          var rowNum = Math.floor(numId/COLS)
          compareAgainstDb(guess, rowNum)
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



async function loadDate() {
  try {
    const response = await fetch("https://artdle-three.vercel.app/api/date")

    const data = await response.json()

    if (!data?.date) {
      console.error("no date?!")
      return
    }

    // date successfully fetched
    const datetext = document.getElementById("datetext")
    datetext.innerHTML = `The computed date is currently ${data.date}.`

  } catch (error) {
    console.error("couldn't connect to backend server:", error)
  }
}

loadDate()




async function loadClues() {
  try {
    const response = await fetch("https://artdle-three.vercel.app/api/clues")

    const data = await response.json()

    if (!data?.clues) {
      console.error("no clues for today")
      return
    }

    // we have the clues!
    const clueArr = data.clues
    const clueDiv = document.getElementById("clues")
    clueDiv.innerHTML = clueArr.map((v,i) => `<p>${i+1}: ${v}</p>`).join("")

  } catch (error) {
    console.error("couldn't connect to backend server:", error)
  }
}

loadClues()



async function compareAgainstDb(inp, rowNum) { // rowNum is just passed right through lol
  try {
    // send it off to vercel!
    const response = await fetch("https://artdle-three.vercel.app/api/app", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        hint: inp,
        row: rowNum
      })
    })

    // use result from vercel
    const data = await response.json()
    
    if (!data?.colours) {
      // not correct, unlock tiles & delete letters then return
      var rowStart = rowNum*COLS
      for (let n = 0; n < 5; n++) {
        var cell = document.getElementById(rowStart+n)
        cell.value = ""
        cell.disabled = false
      }
      return
    }

    // yay, correct! now colour in the tiles using the backend arr
    colourTiles(data.colours, rowNum)

  } catch (error) {
    console.error("couldn't connect to backend server:", error)
  }
}



function colourTiles(colArr, row) {
  const hexDict = {
    green: "#00d100",
    yellow: "#ffec3d",
    grey: "#d8d8d8",
  }
  var rowStart = row*COLS

  for (let n = 0; n < 5; n++) {
    var cell = document.getElementById(rowStart+n)
    cell.style.backgroundColor = hexDict[colArr[n]]
  }
}