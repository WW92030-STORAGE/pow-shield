/*

DO NOT CHANGE = these don't really have any customization and/or are required for the system to work properly.
CHANGE ME = change as necessary
CUSTOMIZE ME = personalization (javascript knowledge might be required)

*/

// Constant values (CHANGE ME)

// Port or URL that acts as the request URL (e.g. if you type in this URL you will enter the loading screen and then redirect to TARGET_SITE.)
THIS_PORT = 'http://127.0.0.1:5000/'

// Upper bound which the client will test things. Otherwise it returns -1 and will most likely induce a retry.
const UPPER_BOUND = 16777216;

// End constant values (END CHANGE ME)

// The 'crypto' object is globally available in the browser window
// DO NOT CHANGE
async function COMPUTE_HASH(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  // Convert ArrayBuffer to hex string for display
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex
}

// DO NOT CHANGE
async function solve_challenge(prefix, diff, upper_bound) {
  for (let i = 0; i < upper_bound; i++) {
    const computed_hash = await COMPUTE_HASH(prefix + i.toString());
    let solved = true;
    for (let index = 0; index < diff && index < computed_hash.length; index++) {
      if (computed_hash.charAt(index) != '0') solved = false;
    }
    if (solved) return i;
  }
  return -1;
}

// DO NOT CHANGE
function weighted(arr) { // generate a random number from 0 - (length - 1) based on the weight in each index
	var n = arr.length;
	var psum = [0];
	for (let i = 0; i < n; i++) psum[i + 1] = psum[i] + arr[i];
  console.log(psum);

  var highest = psum[n];
  console.log(highest);

  var rand = Math.floor(Math.random() * highest);
  console.log(rand);

  for (let i = 0; i < n; i++) {
    if (rand < psum[i + 1]) return i;
  }
  return Math.floor(Math.random() * n); // last resort
}

// DO NOT CHANGE -- INSTEAD GO TO setup_visuals()
function pick(lines) {
  const lines_array = lines.split(/\r?\n|\r/); // from google
  console.log(lines_array);

  let weights = [];
  let splashes = [];

  for (let i = 0; i < lines_array.length; i++) {
    let weight = 1;
    let line = lines_array[i];
    if (line.length <= 0) continue;
    if (line.length >= 2 && line.charAt(0) == '-' && line.charAt(1) == '-') continue;
    if (line.charAt(0) == '!') {
      let closebracket = line.indexOf(']');
      let number = parseFloat(line.substr(2, closebracket - 2));
      line = line.substr(closebracket + 1);
      weight = number;
    }
    weights.push(weight);
    splashes.push(line);
  }

  if (splashes.length <= 0) return "Unable to load data?";

  const index = weighted(weights);
  return splashes[index];
}

// CUSTOMIZE ME
async function setup_visuals() {
  splashes = await (await fetch("/assets/splashes.txt")).text();

  chosen = pick(splashes);

  document.getElementById("splash").textContent = chosen;

  backgrounds = await (await fetch("/assets/wallpapers.dat")).text();
  chosen = pick(backgrounds).trim();
  console.log("CHOSEN IMAGE" + chosen);
  document.getElementById("backdrop").style.backgroundImage = "url('/assets/wallpapers/" + chosen + "')";
}

// CUSTOMIZE ME
async function passed(solution = "") {
  let WIN_COLOR = "cyan";
  document.getElementById("splash").textContent = "A WINNER IS YOU" + solution;
  document.getElementById("header").style.backgroundColor = WIN_COLOR;
  document.getElementById("splash").style.backgroundColor = WIN_COLOR;
}

// DO NOT
async function dothething() {
  // Comment this next line out if you want a fixed image/splash.
  await setup_visuals();

  const challenge = await fetch(THIS_PORT, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"req_challenge": 0})
  });

  const jsonfile = await challenge;
  console.log("FILE", jsonfile)
  const contents = await jsonfile.json();

  console.log(contents);

  const diff = contents.difficulty;
  const prefix = contents.pow_prefix;
  const timestamp = contents.timestamp;

  console.log("SEEKING SOLUTION: " + prefix + " / " + diff);

  const solution = await solve_challenge(prefix, diff, UPPER_BOUND);

  console.log(solution);

  // Begin challenge solving and checking. This prompts the backend to send over the cookie required to progress.
  const response = await fetch(THIS_PORT, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        "pow_prefix": prefix, 
        "pow_solution": solution,
        "timestamp": timestamp, 
        "difficulty": diff
      }
    ),
    credentials: 'include'
  });

  console.log("RAW RESPONSE" + response);

  const response_contents = await response.json();
  console.log("FINAL RESPONSE: " + response_contents);

  passed(" " + solution);

  if (response_contents.url) {
    console.log("URL", response_contents.url);
  } else {
    console.log("what???");
  }

  // End challenge solving and checking

  // Reload

  location.reload();

  console.log("xxxx");
}

dothething();