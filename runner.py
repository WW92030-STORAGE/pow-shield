from flask import Flask, request, jsonify, render_template, redirect, send_file, Response, url_for
from src.pow_utils import generate_prefix
import src.CONSTANTS as CONSTANTS
import requests
import datetime
from src.pow import sath
import dateutil as pdu
from flask_cors import CORS
import certifi
import traceback

app = Flask(__name__)
CORS(app)

VERBOSE = True

# Thing to get assets
@app.route('/assets/', defaults={'path': ''},  methods = ['GET', 'POST'])
@app.route('/assets/<path:path>', methods = ['GET', 'POST'])
def get_assets(path):
    print("ASSETS!!!", path)
    asset_text = ""
    with open("static/assets/" + path, 'r') as FILE:
        for line in FILE:
            asset_text += line
    print("asset path", path)
    return Response(
        asset_text,
        mimetype="text/plain",
        headers={"Content-Disposition": "attachment;filename=assets/" + path}
    )

# Thing to get wallpapers
@app.route('/assets/wallpapers/', defaults={'path': ''},  methods = ['GET', 'POST'])
@app.route('/assets/wallpapers/<path:path>', methods = ['GET', 'POST'])
def get_wallpapers(path):
    if (VERBOSE):
        print("WALLPAPER!", path)
    return send_file("static/assets/wallpapers/" + path, mimetype='image/png')


# Actual request processing
@app.route('/', defaults={'path': ''},  methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
@app.route('/<path:path>', methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], strict_slashes = False)
def home(path):
    if len(path) > 0 and path[-1] == "/":
        print("DIR!!!!", path)
    if (VERBOSE):
        print("REQ", request.method)
        print("PATH[", path, "]")



    try:
        certificate = request.cookies.get(CONSTANTS.CERT_COOKIE)
        if (VERBOSE):
            print("expires_on:", certificate)
        current_time = datetime.datetime.now(datetime.timezone.utc)
        expiry = pdu.parser.parse(certificate)
        if current_time < expiry:
            if "http" not in CONSTANTS.TARGET_SITE:
                return render_template(path), CONSTANTS.CODE_PASS
            """
            redir = redirect(CONSTANTS.TARGET_SITE + path)
            print("REDIR", redir)
            return redir
            """

            url = f"{CONSTANTS.TARGET_SITE}{path}"

            excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection", "host"]
            if (VERBOSE):
                print("URL", url)

            """

            resp = requests.request(
                    method=request.method,
                    url=url,
                    headers={k: v for k, v in request.headers if k.lower() not in excluded_headers},
                    data=request.get_data(),
                    cookies=request.cookies,
            )

            """

            # i give up. using this instead https://github.com/0xe2d0/Flask-Reverse-Proxy/blob/main/proxy.py

            if request.method == "POST":
                resp = requests.post(url, data = request.form)
                
            if request.method == "GET":
                resp = requests.get(url)
            
            headers=[(k, v) for k, v in resp.raw.headers.items()  if k.lower() not in excluded_headers]
            
            if (VERBOSE):
                print("MEMOIZED", resp, resp.url)
            
            # Return response unchanged
            response = Response(resp.content, resp.status_code, headers)
            print("TRUE RESP", response)
            return response
        else:
            print("EXPIRED!")
    except Exception as e:
        if (VERBOSE):
            print("NO COOKIES :(")
            print(e)
        pass

    if request.is_json:
        data = request.get_json()
        if (VERBOSE):
            print("JSON!!!")
        if "req_challenge" in data:
            if (VERBOSE):
                print("SEEKING CHALLENGE!!!!")
            prefix, timestamp = generate_prefix(CONSTANTS.PREFIX_PROMPT)
            return jsonify({"pow_prefix": prefix, "difficulty": CONSTANTS.DIFF, "timestamp": timestamp}), CONSTANTS.CODE_PROGRESS
        if "pow_prefix" in data and "difficulty" in data and "timestamp" in data and "pow_solution" in data:
            try:
                if (VERBOSE):
                    print("RECEIVED POTENTIAL SOLUTION...")
                current_time = datetime.datetime.now(datetime.timezone.utc)
                TIME = pdu.parser.parse(data["timestamp"])

                if (VERBOSE):
                    print(str(current_time), "\n", TIME)

                diff = current_time - TIME
                if (VERBOSE):
                    print("DIFF", diff)
            
                if diff >= datetime.timedelta(seconds = CONSTANTS.MAXIMUM_SECONDS):
                    return jsonify({"result": "FAIL"}), CONSTANTS.CODE_FAIL

                DIFF = data["difficulty"]
                PREFIX = data["pow_prefix"]
                SOLUTION = data["pow_solution"]
                if not sath.verify(PREFIX, SOLUTION, DIFF):
                    return jsonify({"result": "FAIL"}), CONSTANTS.CODE_FAIL

                # Success!!
                print("SUCCESS!", CONSTANTS.TARGET_SITE)

                url = CONSTANTS.TARGET_SITE + "/" + path

                print("URL", url)

                resp = jsonify({"result": "PASS", "url": url})
                thing = current_time + datetime.timedelta(seconds = CONSTANTS.EXPIRATION_SECONDS)
                resp.set_cookie(CONSTANTS.CERT_COOKIE, str(thing))

                print("RESP", resp, resp.json)
                return resp, CONSTANTS.CODE_PASS
            except Exception as e:
                print("EXCEPTION", e)
                traceback.print_exc()
                return jsonify({"result": "ERROR"}), CONSTANTS.CODE_FAIL
            

    
    return render_template("pow_shield/pow_shield_loading_page.html")

    """
    
    # as is done here: https://github.com/0xe2d0/Flask-Reverse-Proxy/blob/main/proxy.py
    resp = requests.request(request.method, CONSTANTS.TARGET_SITE + "" + str(path))
    excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
    headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
    response = Response(resp.content, resp.status_code, headers)
    return response, 200

    """

if __name__ == '__main__':
    app.run(port = 5000)