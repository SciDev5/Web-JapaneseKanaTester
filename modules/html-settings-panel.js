var visiblePanel = null;


class SettingsPanel {
  constructor(label,callback) {
    this.settings = {};
    this.settingElts = {};
    this.settingUpdates = {};
    this.panel = document.createElement("div");
    this.panel.classList.add("settings");
    this.panel.style.display = "none";
    this.changeCallback = callback;
    document.getElementById("settings-container").appendChild(this.panel);
    
    var labelBlock = this._createBlock();
    
    let row = document.createElement("div");
    row.classList.add("settings-row");
    labelBlock.appendChild(row);
    
    
    let labelE = document.createElement("div");
    labelE.classList.add("settings-title");
    labelE.innerText = label;
    row.appendChild(labelE);
    let buttonClose = document.createElement("div");
    buttonClose.classList.add("settings-close-button");
    buttonClose.innerText = "Close";
    buttonClose.addEventListener("click", e => this.hide());
    row.appendChild(buttonClose);
  }
  addBoolList(id, labels, defaults_) {
    if (this.settings.hasOwnProperty(id))
      throw new Error("Setting id already in use!");
    var defaults = (defaults instanceof Array) ? defaults : [];
    
    var list = new Array(labels.length).fill(false);
    for (var i = 0; i < defaults.length && i < labels.length; i++)
      list[i] = !!defaults[i];
    
    var eltList = [];
    
    Object.defineProperty(this.settings, id, {value:list,readonly:true});
    Object.defineProperty(this.settingElts, id, {value:eltList,readonly:true});
    Object.defineProperty(this.settingUpdates, id, {value:Object.freeze({to:this._boolListToHTML,from:this._boolListFromHTML}),readonly:true});
    
    var block = this._createBlock();
    
    {
      
      let row = document.createElement("div");
      row.classList.add("settings-boollist-row");
      block.appendChild(row);
      
      
      let label = document.createElement("span");
      label.classList.add("settings-boollist-label");
      label.innerText = "Select All";
      row.appendChild(label);
      
      let check = document.createElement("input");
      check.classList.add("settings-boollist-check");
      check.type = "checkbox";
      check.checked = list.every(v=>!!v);
      check.addEventListener("change", e => {
        for (var i = 0; i < list.length; i++) list[i] = check.checked;
        this.updateToHTML(id);
        this._callChangeCallback(id);
      });
      row.appendChild(check);
      eltList[0] = check;
    }
    
    for (var i = 0; i < labels.length; i++) {
      var row = document.createElement("div");
      row.classList.add("settings-boollist-row");
      block.appendChild(row);
      
      
      var label = document.createElement("span");
      label.classList.add("settings-boollist-label");
      label.innerText = labels[i];
      row.appendChild(label);
      
      var check = document.createElement("input");
      check.classList.add("settings-boollist-check");
      check.type = "checkbox";
      check.checked = list[i];
      check.addEventListener("change", e => {
        this.updateFromHTML(id);
        this.updateToHTML(id);
        this._callChangeCallback(id);
      });
      row.appendChild(check);
      eltList[i+1] = check;
    }
  }
  _boolListFromHTML(id,self) {
    var elts = self.settingElts[id];
    var list = self.settings[id];
    for (var i = 0; i < list.length; i++)
      list[i] = elts[i+1].checked;
  }
  _boolListToHTML(id,self) {
    var elts = self.settingElts[id];
    var list = self.settings[id];
    var allTrue = true;
    for (var i = 0; i < list.length; i++) {
      elts[i+1].checked = list[i];
      allTrue = allTrue && list[i];
    }
    elts[0].checked = allTrue;
  }
  
  addHeader(text) {
    var block = this._createBlock();
    
    let row = document.createElement("div");
    row.classList.add("settings-header");
    row.innerText = text;
    block.appendChild(row);
  }
  
  updateFromHTML(id) {
    if (!id) {
      for (var id_ in this.settings)
        this.updateFromHTML(id_);
      return;
    }
    this.settingUpdates[id].from(id,this);
  }
  updateToHTML(id) {
    if (!id) {
      for (var id_ in this.settings)
        this.updateToHTML(id_);
      return;
    }
    this.settingUpdates[id].to(id,this);
  }
  _createBlock() {
    var block = document.createElement("div");
    block.classList.add("settings-block");
    this.panel.appendChild(block);
    return block;
  }
  
  _callChangeCallback(id) {
    if (this.changeCallback instanceof Function)
      this.changeCallback(this.settings, id);
  }
  
  show() {
    if (visiblePanel)
      visiblePanel.hide();
    document.getElementById("settings-background").style.display = "";
    document.getElementById("settings-container").style.display = "";
    this.panel.style.display = "";
    visiblePanel = this;
  }
  hide() {
    if (this == visiblePanel)  {
      visiblePanel = null;
      document.getElementById("settings-background").style.display = "none";
      document.getElementById("settings-container").style.display = "none";
    }
    this.panel.style.display = "none";
  }
}

export {SettingsPanel};