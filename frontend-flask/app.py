from flask import Flask, render_template_string

app = Flask(__name__)

# Basic HTML page
@app.route('/')
def home():
    return render_template_string("""
        <h1>Frontend - Flask App</h1>
        <p>Welcome to the 3-tier application!</p>
        <a href="/api-data">Fetch data from backend</a>
    """)

# (Later we'll call backend API here)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
