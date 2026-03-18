from flask import Flask

# A simple Flask page to print out the current URL slug.

app = Flask(__name__)

@app.route('/', defaults={'path': ''},  methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
@app.route('/<path:path>', methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def hello_world(path):
    return "<p>Hello, World!: " + path + "</p>"