# Another Open PoW Shield <!-- Originally: SOMETHING HASHCASH AKIN TO (SHAT) -->

Proof of concept for a lightweight internet spam filter. This one uses proof of work challenges to hinder the progress of spam, DDoS attacks, etc.

Be aware this is not modular (or robust) yet but soon will be. For now it's a simple reverse proxy (or rather, something you can also put behind a reverse proxy) that integrates the pow challenge.

# FORMATS

POW challenge: `{"pow_prefix": <prefix>, "difficulty": <diff>, "timestamp": <timestamp>}`
POW solution: `{"pow_prefix": <prefix>, "difficulty": <diff>, "timestamp": <timestamp of challenge>, "pow_solution": <solution>}`

The solution in question is actually the nonce/suffix. The combined string is <prefix><solution> whose hash must have the relevant correctness.

# HOW TO USE

- Change the ip and port in `static/client_solver.js`
- Customize stuff in `.config`
- Personalize the visuals of the loading page in `static/assets/*` and `static/pow_shield/style.css` as well as the loading screen `static/templates/pow_shield/pow_shield_loading_page.html` and `static/pow_shield/client_solver.js`

<!-- - TBA (Not finished yet sorry. For now there's a couple of static pages in `templates` that you can replace with your website. You must preserve `pow_shield_loading_page.html`. You can also redirect to an external domain. I think there is a way to hide your website's actual IP/port/whatever from access and only accessible by forwarding these ones, in case you wish to reverse proxy this on some external IP/port. I am currently working on getting this working in practice. If you deploy a webapp on another IP address you can also use that.) -->
- Place this between the outwardly visible IP/port and the true backend IP/port. Examples are in `examples`.
- The system should forward requests (assuming you have recently passed the challenge) correctly?

# SEE ALSO

- haproxy protection
- kiwiflare
- https://github.com/simon987/ngx_http_js_challenge_module
- https://github.com/RuiSiang/PoW-Shield 
- hashcash (the original pow verification system that led to all this) <!-- Did you know I interned at coinbase at some point? -->
- anything else that does this kind of thing

All of these are similar to how this is implemented -- this is just a pet project poorly disguised as a shitpost.

<!-- 

This has nothing to do with AI, is not vibe coded, and does not use AI in its operation. The inspiration is simply Rui Siang's PoW Shield (and whatever else listed in the See Also). 
don't try to get me to put a mascot on this. this system exists in between the parallel realms. The protogen is just a traveller. And so are you.

-->