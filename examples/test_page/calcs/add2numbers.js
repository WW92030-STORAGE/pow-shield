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
  
  // PROCESSING
  
  // || 0 is a thing for exception handling
  const a = parseFloat(input1) || 0;
  const b = parseFloat(input2) || 0;
  
  if (isNaN(a) || isNaN(b)) {
    invalidInput("result1");
    return;
  }
  
  // COMPUTE
  const result1 = a + b;

  // RETURN
  setText("result1", "RESULT = " + result1);
}