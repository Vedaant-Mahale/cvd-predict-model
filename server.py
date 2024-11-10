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
pca = joblib.load('pca_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Extract features from the incoming data (make sure it's an array or list)
    features = data['features']

    try:
        #the order is the same as the backend expects
        age = float(features['age'])
        gender = float(features['gender'])
        height = float(features['height'])
        weight = float(features['weight'])
        ap_hi = float(features['ap_hi'])
        ap_lo = float(features['ap_lo'])
        cholesterol = float(features['cholesterol'])
        gluc = float(features['gluc'])
        smoke = int(features['smoke'])
        alco = int(features['alco'])
        active = int(features['active'])

        # BMI calculation
        height_in_meters = height / 100
        bmi = weight / (height_in_meters ** 2)
        
        # Add BMI to the feature list
        features_with_bmi = np.array([
            age, gender, height, weight, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active, bmi
        ])
        # Scale features
        features_scaled = scaler.transform([features_with_bmi])
        transformed_features = pca.transform(features_scaled)
        # Make prediction
        prediction = model.predict(transformed_features)
        risk_score = int(prediction.flatten() * 1000)  # Multiply by 1000 and convert to an integer

        # Return prediction result as a JSON response
        response = make_response(jsonify({'prediction': risk_score}))
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        return response

    except KeyError as e:
        return jsonify({"error": f"Missing feature: {str(e)}"}), 400

if __name__ == '__main__':
    app.run(debug=True)
