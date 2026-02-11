from flask import Flask, request, jsonify, render_template, redirect, send_file, Response, url_for
from src.pow_utils import generate_prefix
import src.CONSTANTS as CONSTANTS
import requests
import datetime
from src.pow import sath
import dateutil as pdu

app = Flask(__name__)

@app.route('/assets/', defaults={'path': ''},  methods = ['GET', 'POST'])
@app.route('/assets/<path:path>', methods = ['GET', 'POST'])
def get_assets(path):
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

@app.route('/assets/wallpapers/', defaults={'path': ''},  methods = ['GET', 'POST'])
@app.route('/assets/wallpapers/<path:path>', methods = ['GET', 'POST'])
def get_wallpapers(path):
    print("WALLPAPER!", path)
    return send_file("static/assets/wallpapers/" + path, mimetype='image/png')


@app.route('/', defaults={'path': ''},  methods = ['GET', 'POST'])
@app.route('/<path:path>', methods = ['GET', 'POST'])
def home(path):
    print("REQ", request.method)
    print("PATH[", path, "]")

    if path == "":
        path = "index.html"

    try:
        certificate = request.cookies.get(CONSTANTS.CERT_COOKIE)
        print("expires_on:", certificate)
        current_time = datetime.datetime.now(datetime.timezone.utc)
        expiry = pdu.parser.parse(certificate)
        if current_time < expiry:
            return render_template(path), CONSTANTS.CODE_PASS
    except Exception:
        pass

    if request.is_json:
        data = request.get_json()
        print("JSON!!!")
        if "req_challenge" in data:
            print("SEEKING CHALLENGE!!!!")
            prefix, timestamp = generate_prefix(CONSTANTS.PREFIX_PROMPT)
            return jsonify({"pow_prefix": prefix, "difficulty": CONSTANTS.DIFF, "timestamp": timestamp}), CONSTANTS.CODE_PROGRESS
        if "pow_prefix" in data and "difficulty" in data and "timestamp" in data and "pow_solution" in data:
            try:
                print("RECEIVED POTENTIAL SOLUTION...")
                current_time = datetime.datetime.now(datetime.timezone.utc)
                TIME = pdu.parser.parse(data["timestamp"])

                print(str(current_time), "\n", TIME)

                diff = current_time - TIME
                print("DIFF", diff)
            
                if diff >= datetime.timedelta(seconds = CONSTANTS.MAXIMUM_SECONDS):
                    return jsonify({"result": "FAIL"}), CONSTANTS.CODE_FAIL

                DIFF = data["difficulty"]
                PREFIX = data["pow_prefix"]
                SOLUTION = data["pow_solution"]
                if not sath.verify(PREFIX, SOLUTION, DIFF):
                    return jsonify({"result": "FAIL"}), CONSTANTS.CODE_FAIL

                # Success!!
                resp = redirect(CONSTANTS.TARGET_SITE)
                resp = jsonify({"result": "PASS"})
                thing = current_time + datetime.timedelta(seconds = CONSTANTS.EXPIRATION_SECONDS)
                resp.set_cookie(CONSTANTS.CERT_COOKIE, str(thing))
                return resp, 200
            except Exception as e:
                print("EXCEPTION", e)
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
    app.run(debug=True)