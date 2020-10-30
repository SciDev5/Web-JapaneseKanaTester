import {Utils} from "/modules/utils.js";
import {SettingsPanel} from "/modules/html-settings-panel.js";

class CharTextTest {
  constructor(containerId, kanaSet, groups, fonts) {
    Object.defineProperty(this,"set",{value:kanaSet,readonly:true});
    this.current = {questionId:0, canType: false, font: "inherit"}
    Object.defineProperty(this,"fonts",{value:fonts||[null],readonly:true});
    Object.defineProperty(this,"groups",{value:groups,readonly:true});
    
    this.buildHTML(containerId);
    this.initHTML();
    
    this.displayQuestion(this.getNextQuestion(), this.getRandomFont());
  }
  
  buildHTML(containerId) {
    var container = document.getElementById(containerId);
    
    var setName = container.innerText;
    Object.defineProperty(this,"setName",{value:setName,readonly:true});
    
    container.innerHTML = "";
    container.classList.add("tcw");
    
    var header = document.createElement("span"); 
    header.classList.add("tcw-name");
    header.innerText = setName;
    container.appendChild(header);
    
    var question = document.createElement("span");
    question.classList.add("tcw-question");
    container.appendChild(question);
    
    var answer = document.createElement("input");
    answer.classList.add("tcw-answer");
    answer.autocomplete="off";
    answer.autocorrect="off";
    answer.autocapitalize="off";
    answer.spellcheck=false;
    container.appendChild(answer);
    
    var settingsPanel = document.createElement("div"); 
    settingsPanel.classList.add("tcw-settings");
    settingsPanel.innerText = "Settings";
    container.appendChild(settingsPanel);
    
    Object.defineProperty(this,"elt",{value:Object.freeze({container,header,question,answer,settingsPanel}),readonly:true});
    
    var settingsSystem = new SettingsPanel("Config for "+setName+" [Typing/Writing]",(sobj,id)=>this._settingsUpdate(sobj,id));     var groupLabels = new Array(this.groups.length).fill().map((_,i)=>this.groups[i].name);
    settingsSystem.addBoolList("activeGroups",groupLabels);
    this.current.enabledGroups = new Array(this.groups.length).fill(true);
        
    Object.defineProperty(this,"settingsPanel",{value:settingsSystem,readonly:true});
  }
  
  initHTML() {
    this.elt.container.addEventListener("webkitAnimationEnd", e => {
      if (!e.isTrusted) return;
      switch (e.animationName) {
        case "tcw-correct":
          this.displayQuestion(this.getNextQuestion(), this.getRandomFont());
          break;
        case "tcw-incorrect":
          this.retry();
          break;
      }
    });
    this.elt.answer.addEventListener("keydown", e => {
      if (!e.isTrusted) return;
      if (!this.current.canType)
        e.preventDefault();
      else setTimeout(()=>{
        var realAnswer = this.set[this.current.questionId].answer;
        var humanAnswer = this.elt.answer.value;
        
        // Answer check.
        if (humanAnswer.toUpperCase() == realAnswer.toUpperCase())
          this.setCorrect(true);
        else if (humanAnswer.length >= realAnswer.length)
          this.setCorrect(false);
      },1);
    });
    this.elt.settingsPanel.addEventListener("click", e => {
      this.settingsPanel.show();
    });
  }
  
  _settingsUpdate(settingsObj,id) {
    var data = settingsObj[id];
    switch (id) {
      case "activeGroups":
        this.resetQuestionRandomization(data);
        this.displayQuestion(this.getNextQuestion(), this.getRandomFont());
        break;
    }
  }
  
  setCorrect(correct) {
    this.current.canType = false;
    this.elt.container.classList.add(correct?"tcw-anim-correct":"tcw-anim-incorrect");
    var data = this.set[this.current.questionId];
    if (!correct)
      this.elt.question.innerText = data.question + " → " + data.answer;
  }
  
  displayQuestion(index, font_) {
    var font = font_ ? '"'+font_+'"' : "inherit";
    this.displayQuestionRaw(index, font);
  }
  
  retry() {
    this.displayQuestionRaw(this.current.questionId, this.current.font);
  }
  
  displayQuestionRaw(index, font) {
    this.current.questionId = index;
    this.current.font = font;
    this.current.canType = true;
  
    this.elt.container.classList.remove("tcw-anim-incorrect");
    this.elt.container.classList.remove("tcw-anim-correct");
    this.elt.question.innerText = this.set[this.current.questionId].question;
    this.elt.question.style.fontFamily = this.current.font;
    this.elt.answer.value = "";
    //this.elt.answer.focus();
  }
  
  getNextQuestion() {
    var setIndecesToUse = this.current.toUse;
    if (!setIndecesToUse || setIndecesToUse.length == 0) {
      setIndecesToUse = [];
      var noEnabledGroups = this.current.enabledGroups.every(v=>!v)
      for (var i = 0; i < this.current.enabledGroups.length; i++)
        if (this.current.enabledGroups[i] || noEnabledGroups) 
          for (var elt of this.groups[i].data)
            if (!setIndecesToUse.includes(elt)) 
              setIndecesToUse.push(elt);
      this.current.toUse = setIndecesToUse;
    }
    
    var elt = Utils.randomArr(setIndecesToUse);
    Utils.removeFirstArr(setIndecesToUse, elt);
    
    return elt;
  }
  getRandomFont() {
    return this.fonts[Math.floor(Math.random()*this.fonts.length)];
  }
  
  resetQuestionRandomization(enabledGroups) {
    this.current.enabledGroups = enabledGroups;
    this.current.toUse = null;
  }
  
  static buildDataSet(setIn,questionDataTag,answerDataTag) {
    var setOut = [];
    for (var elt of setIn) {
      setOut.push({
        question: elt[questionDataTag],
        answer:   elt[answerDataTag],
      });
    }
    return setOut;
  }
  
}


export { CharTextTest }; 