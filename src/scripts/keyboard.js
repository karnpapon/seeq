'use strict'

function Keyboard(app) {
  this.locks = []
  this.history = ''
  this.down = false;
  this.isKeyNotFound = false;
  this.keyboardPress = false
  this.isMutePressed = false
  this.isUpPressed = false
  this.isDownPressed = false
  this.isShowInfo = false
  this.isMuted = false
  this.isReversedCursorPressed = false
  this.isDeletePressed = false
  this.isRetriggered = false
  this.el = document.createElement("div")
  this.keyDisplay = document.createElement("div")
  this.keyDisplayElCmd = document.createElement("div")
  this.kbInfoTitle = document.createElement("lf")
  this.kbInfoOperator = document.createElement("div")
  this.kbInfoMidiConfig = document.createElement("div")
  this.kbInfoOperatorColor = document.createElement("div")
  this.kbInfoOperatorIcon = document.createElement("object")
  this.kbInfoOperatorWrapper = document.createElement("div")
  this.kbInfoTitle.innerText = "INFO"
  
  this.build = function(){
    this.el.classList.add("info-wrapper")
    this.keyDisplay.classList.add("info-group")
    this.kbInfoOperator.classList.add("info-icon-and-color")
    this.kbInfoMidiConfig.classList.add("info-midi-conf")
    this.kbInfoOperatorColor.classList.add("info-color")
    this.keyDisplayElCmd.classList.add("info-opr8-title")
    this.kbInfoOperatorWrapper.classList.add("info-opr8-wrapper")
    this.kbInfoOperatorIcon.classList.add("icons")
    this.kbInfoOperator.appendChild(this.kbInfoOperatorColor)
    this.kbInfoOperator.appendChild(this.kbInfoOperatorIcon)
    this.keyDisplay.appendChild(this.kbInfoTitle)
    this.kbInfoOperatorWrapper.appendChild(this.keyDisplay)
    this.kbInfoOperatorWrapper.appendChild(this.keyDisplayElCmd)
    this.kbInfoOperatorWrapper.appendChild(this.kbInfoOperator)
    this.el.appendChild(this.kbInfoOperatorWrapper)
    this.el.appendChild(this.kbInfoMidiConfig)
    app.infoBar.appendChild(this.el)

    this.infoHide()
  }

  this.onKeyDown = function (event) {

    // char = m
    if (event.keyCode === 77) { 
      this.infoDisplay('MUTE : mute target highlight.','mute', "e")
      this.isMutePressed = true;
    }

    // char = spacebar
    else if (event.keyCode === 32) { 
      this.infoDisplay('RUN : run sequencer.')
      app.play()
    }

    // char = esc
    else if (event.keyCode === 27) { 
      this.infoDisplay('STOP : stop sequencer.', "e")
      app.clear()
    }

    // char = r = reverse selected.
    else if (event.keyCode === 82) {
      this.infoDisplay('REVERSE : reverse step.', 'reverse', "e")
      this.isReversedCursorPressed = true;
    }

      // char = u = increase selected bpm.
    else if (event.keyCode === 85) { 
      this.isUpPressed = true;
    }

    // char = d = decrease selected bpm.
    else if (event.keyCode === 68) { 
      this.isDownPressed = true;
    }

    // char = i = information.
    else if (event.keyCode === 73) { 
      this.infoDisplay('INFORMATION : show target informations.', 'midiout', "i")
      this.isShowInfo = true;
    }

    // char = t = re-trigger.
    else if (event.keyCode === 84) { 
      this.infoDisplay('INFORMATION : re-trigger.','midiout', "i")
      this.isRetriggered = true;
    }

    // char = x = delete highlight.
    else if (event.keyCode === 88) { 
      this.infoDisplay('DELETE : remove target highlight.','delete', 'i')
      this.isDeletePressed = true;
    }

    else if (event.key === '>') { 
      this.infoDisplay('INCREASE : increase BPM++.')
      app.modSpeed(1); 
      event.preventDefault(); 
      return
    }

    else if (event.key === '<') { 
      this.infoDisplay('INCREASE : decrease BPM--.')
      app.modSpeed(-1); 
      event.preventDefault(); 
      return 
    }
    else {
      this.isKeyNotFound = true
    }
   
  }

  this.infoDisplay = function( command, color, icon = "e" ){
    this.infoShow()
    this.isKeyNotFound = false
    this.keyDisplayElCmd.innerText = command
    this.kbInfoOperatorColor.classList.add(color)
    this.kbInfoOperatorIcon.setAttribute('data', `media/icons/${icon}.svg`);
  }

  this.infoMidiHide = function(){
    this.kbInfoMidiConfig.classList.add("info-hide")
  }

  this.infoMidiShow = function () {
    this.kbInfoMidiConfig.classList.remove("info-hide") 
  }

  this.infoShow = function(){
    this.el.classList.remove("info-hide") 
  }

  this.infoHide = function(){
    this.el.classList.add("info-hide")
  }

  this.infoOpr8Hide = function(){
    this.kbInfoOperatorWrapper.classList.add("info-hide")
  }

  this.infoOpr8Show = function(){
    this.kbInfoOperatorWrapper.classList.remove("info-hide") 
  }

  this.onKeyUp = function (event) {
    
    if (app.isInfoActived){ 
      return 
    } else if (!this.isKeyNotFound) {
      this.isMutePressed = false;
      this.isUpPressed = false;
      this.isDownPressed = false;
      this.keyboardPress = false;
      this.isDeletePressed = false;
      this.isShowInfo = false;
      this.isReversedCursorPressed = false;
      this.isRetriggered = false;
  
      // app.resetInfoBar()
      this.infoHide()
      this.kbInfoOperatorColor.classList = "info-color"
    }
    // for performance's sake, not to render DOM for unassigned key.
    else { return }
  }

  document.onkeydown = (event) => { 
    // prevent repeated DOM rendering, when hold the keys.
    if (this.down || event.keyCode === 91 ) return;
    this.down = true
    this.keyboardPress = true;
    app.info.style.opacity = 0
    this.onKeyDown(event) 
  }
  document.onkeyup = (event) => { 
    this.down = false
    app.info.style.opacity = 1
    this.onKeyUp(event) 
  }
}

module.exports = Keyboard
