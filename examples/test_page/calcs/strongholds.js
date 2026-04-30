function invalidInput(element_id) {
  document.getElementById(element_id).textContent = "INVALID INPUT :(";
}

function setText(element_id, text) {
  document.getElementById(element_id).textContent = text;
}

function setInnerHTML(element_id, text) {
  document.getElementById(element_id).innerHTML = text;
}

function getValue(element_id) {
  return document.getElementById(element_id).value;
}

function getElement(element_id) {
  return document.getElementById(element_id);
}

function button1() {
  // BEGIN INPUT
  
  const input1 = getValue("input1");
  const input2 = getValue("input2");
  const input3 = getValue("input3");
  
  // PROCESSING
  
  // || 0 is a thing for exception handling
  let x = parseFloat(input1) || 0;
  let z = parseFloat(input2) || 0;
  let n = parseFloat(input3) || 0;
  
  if (isNaN(x) || isNaN(z) || isNaN(n)) {
    invalidInput("result1");
    return;
  }
  
  // COMPUTE
  
  const theta = 2 * Math.PI / n;
  
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  
  let xpos = [];
  let zpos = [];
  
  for (let i = 0; i < n; i++) {
    xpos.push(x);
    zpos.push(z);
    
    let xp = x * c - z * s;
    let zp = x * s + z * c;
    
    x = xp;
    z = zp;
  }
  
  let result1 = "";
  
  for (let i = 0; i < n; i++) {
    result1 += "[" + xpos[i].toFixed(2) + ", " + zpos[i].toFixed(2) + "]<br>";
  }

  // RETURN
  setInnerHTML("result1", "RESULT = </br>" + result1);
}