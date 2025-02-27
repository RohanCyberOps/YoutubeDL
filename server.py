from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for frontend communication


@app.route('/download', methods=['POST'])
def download():
    data = request.json
    url = data.get("url")
    format = data.get("format")

    if not url:
        return jsonify({"status": "error", "message": "Invalid URL"}), 400

    # Simulating a response
    return jsonify({"status": "success", "message": "Download started!"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
