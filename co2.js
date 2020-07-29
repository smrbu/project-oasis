// updating total co2 calculation
function update_total_co2() {
    console.log("updating total co2");

    let views = parseInt(document.getElementById('dupli_hit_counter').innerHTML);
    let co2perview = parseFloat(document.getElementById('wcb_g').innerHTML.split("g")[0])

    let out = (views * co2perview).toFixed(2);
    if (!isNaN(out)) {
        document.getElementById('total_emitted').innerHTML = out + "g";
    }
  }


// modified code from: https://gitlab.com/wholegrain/website-carbon-badges/-/blob/master/src/b.js 
const $q = (selector) => document.getElementById(selector);
const wcb_url = encodeURIComponent(window.location.href)

const newRequest = function (render = true) {
    // Run the API request because there is no cached result available
    fetch('https://api.websitecarbon.com/b?url=' + wcb_url)
        .then(function (r) {
            if (!r.ok) {
                throw Error(r);
            }
            return r.json();
        })

        .then(function (r) {
            if (render) {
                renderResult(r)
            }

            // Save the result into localStorage with a timestamp
            r.t = new Date().getTime()
            localStorage.setItem('wcb_'+wcb_url, JSON.stringify(r))
        })

        // Handle error responses
        .catch(function (e) {
            $q('wcb_g').innerHTML = 'No Result';
            console.log(e);
            localStorage.removeItem('wcb_'+wcb_url)
        })
}

const renderResult = function (r) {
    $q('wcb_g').innerHTML = r.c + ' g';
    update_total_co2();
}

function wcb_update() {
    if (('fetch' in window)) { // If the fetch API is not available, don't do anything.
        // Get result if it's saved
        let cachedResponse = localStorage.getItem('wcb_' + wcb_url)
        const t = new Date().getTime()

        // If there is a cached response, use it
        if (cachedResponse) {
            const r = JSON.parse(cachedResponse)
            renderResult(r)

            // If time since response was cached is over a day, then make a new request and update the cached result in the background
            if ((t - r.t) > (86400000)) {
                newRequest(false)
            }

        // If no cached response, then fetch from API
        } else {
            newRequest()
        }
    }
}


// handle visitorshitcounter
const Http = new XMLHttpRequest();
const url="https://visitorshitcounter.com/counterDisplay?code=f5708ccbf613d5194f97a38d4e8b99cf&style=0017&pad=5&type=page&initCount=1";
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
  console.log("got http request: " + Http.responseText);
  let views = Http.responseText;
  document.getElementById('dupli_hit_counter').innerHTML = views;
  update_total_co2();
}