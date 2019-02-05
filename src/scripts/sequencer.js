function Sequencer(){

  this.currentIndex = 0
  this.target

  this.size = 0;
  this.position = 0;
  // this.content = this.data.text.innerHTML;
  this.map = {};
  this.allMatchedIndexes = [];
  this.currentParagraphIndex = 0;
  this.previousParagraphLength = 0;
  this.lastParagraphNumber = 0;
  this.isPlayed = false;
  this.paragraphCursorPosition = 0
  this.textBuffers = ""
  this.output = ""
  this.isCursorActived = false
  this.timer = ""

  this.refresh = function(){
    this.textBuffers = seeq.fetchDataSection.text.innerText; 
  }

  this.set = function(){
		this.output =  this.textBuffers.substr(0, this.paragraphCursorPosition) +
		"<span class=\"current-active\">" +
		this.textBuffers.substr(this.paragraphCursorPosition, 1) +
		"</span>" +
    this.textBuffers.substr(this.paragraphCursorPosition+1)  ;

    seeq.fetchDataSection.updateWithCursor(this.output)
    this.isCursorActived = true
    this.setCounterDisplay()
  }

  this.setCounterDisplay = function(){
    seeq.currentNumber.innerHTML = this.paragraphCursorPosition
  }

  this.setTotalLenghtCounterDisplay = function(){
    seeq.totalNumber.innerHTML = seeq.fetchDataSection.text.innerText.length
  }

  this.selectedTextArea = function(){
    
  }

  this.increment = function(){
    var length = seeq.fetchDataSection.text.innerText.length

    if( this.paragraphCursorPosition > length-1){
      this.paragraphCursorPosition = 0
      seeq.seq.refresh()
      seeq.seq.set() 
    }
    this.paragraphCursorPosition  += 1
    seeq.seq.run()
    this.trigger()
  }

  this.trigger = function(){
    if( seeq.searchValue !== ""){
      if(seeq.matchedPosition.indexOf(this.paragraphCursorPosition) !== (-1) && seeq.matchedPosition){
        document.body.classList.add("trigger")
        seeq.sendOsc()
      }
      setTimeout(() => {
        document.body.classList.remove("trigger")
      }, 200);
    }
  }

  this.run = function(){
    this.timer = setTimeout( function(){
        // this.paragraphCursorPosition  += 1  //remove this when wanted to run auto.
        seeq.seq.refresh()
        seeq.seq.set()
        seeq.seq.increment() //enable this when wanted to run auto.
    }, 100)
  }

  this.update = function(){
    var current, nextEl, prevEl
  }


  this.stop = function(){
    clearTimeout(this.timer)
    this.paragraphCursorPosition = 0
    seeq.seq.refresh()
    seeq.seq.set()
  }




  
}

