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

function button1() {
  // BEGIN INPUT
  
  const input1 = getValue("input1");
  const input2 = getValue("input2");
  const input3 = getValue("input3");
  
  // PROCESSING
  
  // || 0 is a thing for exception handling
  let n = parseInt(input1) || 0;
  let d = parseInt(input2) || 0;
  let mv = parseInt(input3) || 65536;
  
  n = Math.abs(n);
  d = Math.abs(d);
  mv = Math.abs(mv);
  
  let on = n;
  let od = d;
  
  if (mv == 0 || d == 0) {
    invalidInput("result1");
    return;
  }
  
  if (n <= mv && d <= mv) {
    let result1 = n + "/" + d;
    setText("result1", "RESULT = " + result1);
    setText("result2", "ERROR = 0");
    return;
  }
  
  let n0 = 0;
  let d1 = 0;
  let n1 = 1;
  let d0 = 1;
  
  let n2 = 0;
  let d2 = 0;
  
  let dp = 0;
  let a = 0;
  while (true) {
    if (d == 0) {
      break;
    }
    
		dp = d;
		a = floordiv(n, d);
		d = n % d;
		n = dp;
		
		n2 = n0 + a * n1;
		d2 = d0 + a * d1;
		
		if (n2 > mv || d2 > mv) {
		  let t = Number.MAX_SAFE_INTEGER;
		  
		  if (d1 != 0) t = floordiv(mv - d0, d1);
		  if (n1 != 0) t = Math.min(t, floordiv(mv - n0, n1));
		  
		  if ((d1 == 0) || (t + t > a) || ((t + t == a) && (d0 * dp > d1 * d))) {
		    n1 = n0 + t * n1;
		    d1 = d0 + t * d1;
		  }
		  break;
		}
    n0 = n1;
    d0 = d1;
    n1 = n2;
    d1 = d2;
    
    console.log(n0 + " " + d0 + " | " + n1 + " " + d1 + " | " + n2 + " " + d2 + " | " + n + " " + d + " | " + a);
  }
  

  // RETURN
  result1 = n1 + "/" + d1;
  result2 = Math.abs((n1 / d1) - (on / od));
  setText("result1", "RESULT = " + result1);
  setText("result2", "ERROR = " + result2);
}