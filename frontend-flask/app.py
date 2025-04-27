from flask import Flask, render_template_string
import requests
import os

app = Flask(__name__)

# Set backend URL from environment variable or default to 'http://backend:3000'
BACKEND_URL = os.getenv('BACKEND_URL', 'http://backend:3000')

# Basic HTML page
@app.route('/')
def home():
    return render_template_string("""
        <h1>Frontend - Flask App</h1>
        <p>Welcome to the 3-tier application!</p>
        <a href="/api/data">Fetch data from backend</a>
    """)

# Fetch data from backend
@app.route('/api/data')
def fetch_data():
    try:
        # Correct backend API call: Do NOT append /api/data twice
        print(f"Attempting to fetch data from: {BACKEND_URL}/api/data")
        response = requests.get(f'{BACKEND_URL}')
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        
        # Check if the response is empty or not JSON
        if response.text.strip() == "":
            return "Error: Empty response from backend", 500
        
        data = response.json()  # Extract JSON data
        
        return render_template_string("""
            <h1>Backend Data</h1>
            <p>{{ data['message'] }}</p>
            <p>DB Connected: {{ data['dbConnected'] }}</p>
            <a href="/">Go back</a>
        """, data=data)
    
    except requests.exceptions.RequestException as e:
        # Log more details about the error and return a 500 error
        print(f"Error while connecting to backend: {str(e)}")
        return f"Error while connecting to backend: {str(e)}", 500
    
    except ValueError as e:
        # Log the error if the response is not JSON
        print(f"Invalid JSON response from backend: {str(e)}")
        return "Error: Invalid JSON response from backend", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
