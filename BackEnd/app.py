from flask import Flask, jsonify, request
import datetime
from console_engine_deploy import create_nonogram
import os

app = Flask(__name__)

@app.route("/")
def sayHi():
    return "Hello World! GO to /data for more data :)"

@app.route("/data", methods=['GET', 'POST'])
def nonogram_data():
    size = request.args.get('size', default=5, type=int)  # Get size from query parameter
    max_sequential = size - 2
    rows, columns, max_sequential_val = size, size, max_sequential
    puzzle = create_nonogram(rows, columns, max_sequential_val)
    grid, row_hints, col_hints = puzzle
    return {
        "Grid": grid,
        "Row_hints": row_hints,
        "Col_hints": col_hints
    }

@app.route("/grid", methods=['GET'])
def display_grid():
    size = request.args.get('size', default=5, type=int)  # Get size from query parameter
    puzzle = create_nonogram(size, size, 2)
    grid, _, _ = puzzle
    return jsonify(grid)

@app.route("/post", methods=['POST'])
def post_method():
    return "POST request"

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True)
