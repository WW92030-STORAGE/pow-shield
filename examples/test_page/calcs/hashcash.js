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

// custom things

// The 'crypto' object is globally available in the browser window
async function COMPUTE_HASH(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  // Convert ArrayBuffer to hex string for display
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

async function solve_challenge(prefix, suffix, diff, upper_bound) {
  for (let i = 0; i < upper_bound; i++) {
    const computed_hash = await COMPUTE_HASH(prefix + i.toString() + suffix);
    let solved = true;
    for (let index = 0; index < diff && index < computed_hash.length; index++) {
      if (computed_hash.charAt(index) != '0') solved = false;
    }
    if (solved) return i;
  }
  return -1;
}

async function button1() {
  // BEGIN INPUT
  
  const input1 = getValue("input1");
  const input2 = getValue("input2");
  const input3 = getValue("input3");
  
  // PROCESSING
  
  // || 0 is a thing for exception handling
  let diff = parseInt(input3) || 4;
  if (diff < 0) diff = 0;
  if (diff > 5) diff = 5;
  
  console.log(input1 + " " + isNaN(input1));
  console.log(input2 + " " + isNaN(input2));
  console.log(input3 + " " + isNaN(diff));
  
  if (isNaN(diff)) {
    invalidInput("result1");
    return;
  }
  
  // COMPUTE
  const result1 = await solve_challenge(input1, input2, diff, 1<<24);
  
  
  const msg = input1 + result1 + input2;
  console.log(await COMPUTE_HASH(msg));
  // RETURN
  setText("result1", "RESULT = " + result1);
  setText("result2", "SHA256(" + msg + ") = " + await COMPUTE_HASH(msg));
}