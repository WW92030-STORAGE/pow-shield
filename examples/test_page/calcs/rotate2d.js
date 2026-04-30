function invalidInput(element_id) {
  document.getElementById(element_id).textContent = "INVALID INPUT :(";
}

function setText(element_id, text) {
  document.getElementById(element_id).textContent = text;
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
  const checkbox1 = getElement("checkbox1");
  
  // PROCESSING
  
  // || 0 is a thing for exception handling
  let x = parseFloat(input1) || 0;
  let y = parseFloat(input2) || 0;
  let theta = parseFloat(input3) || 0;
  
  if (checkbox1.checked) {
    theta *= Math.PI;
  }
  
  if (isNaN(x) || isNaN(y) || isNaN(theta)) {
    invalidInput("result1");
    return;
  }
  
  // COMPUTE
  
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  
  const rx = x * c - y * s;
  const ry = x * s + y * c;

  // RETURN
  setText("result1", "X = " + rx);
  setText("result2", "Y = " + ry);
}