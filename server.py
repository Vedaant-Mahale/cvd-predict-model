from flask import Flask, request, jsonify, make_response
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS
import sys
if not sys.stdout.encoding == 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)
CORS(app)

# Load the saved model and scaler
model = load_model('model.h5')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features'])
    weight = float(features[3])
    height = float(features[2]) 
    height_in_meters = height / 100
    bmi = weight / (height_in_meters ** 2)
    features_with_bmi = np.append(features, bmi)
    features_scaled = scaler.transform([features_with_bmi])

    prediction = model.predict(features_scaled)

    response = make_response(jsonify({'prediction': prediction.flatten().tolist()}))
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

if __name__ == '__main__':
    app.run(debug=True)