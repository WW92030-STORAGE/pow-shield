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

function floordiv(a, b) {
  return Math.floor(a / b);
}

// https://www.embeddedrelated.com/showarticle/1620.php
function button1() {
  // BEGIN INPUT
  
  const input1 = getValue("input1");
  const input2 = getValue("input2");
  const input3 = getValue("input3");
  
  // PROCESSING
  
  // || 0 is a thing for exception handling
  let x = parseFloat(input1) || 0;
  let iters = parseInt(input2) || 4;
  let rn_threshold = parseFloat(input3) || 0.00001;

  if (iters < 0) iters = 4;

  let isnegative = (x < 0);
  x = Math.abs(x);

  let [x_n2, h_n2, k_n2] = [1, 0, 1];
  let [x_n1, h_n1, k_n1] = [x, 1, 0];
  let [q_n, r_n, x_n, h_n, k_n] = [0, 0, 0, 0, 0];
  
  for (let it = 0; it < iters; it++) {
    q_n = Math.floor(x_n1);
    r_n = x_n1 - q_n;
    x_n = 1 / r_n;
    h_n = q_n * h_n1 + h_n2;
    k_n = q_n * k_n1 + k_n2;
    
    if (!isFinite(h_n) || !isFinite(k_n)) break;
        
    [x_n2, h_n2, k_n2] = [x_n1, h_n1, k_n1];
    [x_n1, h_n1, k_n1] = [x_n, h_n, k_n];

    console.log(it + ": " + q_n + " " + r_n + " " + x_n + " " + h_n + " " + k_n);

    if (k_n == 0 || Math.abs(r_n) < rn_threshold) break;
    
  }


  // RETURN

  if (k_n1 == 0) {
    setText("result1", "CONVERGES TO ZERO DENOMINATOR");
    return;
  }

  if (isnegative) h_n1 *= -1;
  result1 = h_n1 + "/" + k_n1;
  result2 = Math.abs((h_n1 / k_n1) - x);
  setText("result1", "RESULT = " + result1);
  setText("result2", "ERROR = " + result2);
}