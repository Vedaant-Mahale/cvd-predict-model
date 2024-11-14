import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [features, setFeatures] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    ap_hi: "",
    ap_lo: "",
    cholesterol: "",
    gluc: 1,
    smoke: false,
    alco: false,
    active: false,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    const missingFields = Object.entries(features).filter(
      ([key, value]) => value === "" || value === null
    );

    if (missingFields.length > 0) {
      setError("Please fill out all required fields.");
      return;
    }

    // Wrap the data inside a 'features' key
    const dataToSend = {
      features: {
        age: parseInt(features.age, 10),
        gender: parseInt(features.gender, 10),
        height: parseInt(features.height, 10),
        weight: parseInt(features.weight, 10),
        ap_hi: parseInt(features.ap_hi, 10),
        ap_lo: parseInt(features.ap_lo, 10),
        cholesterol: parseInt(features.cholesterol, 10),
        gluc: parseInt(features.gluc, 10),
        active: features.active ? 1 : 0,
      },
    };

    setLoading(true);
    setError("");

    axios
      .post("http://localhost:5000/predict", dataToSend)
      .then((res) => {
        setPrediction(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error in prediction. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Cardiovascular Disease Prediction Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age:
          </label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={features.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Gender (1 = Male, 2 = Female):
          </label>
          <input
            type="number"
            className="form-control"
            id="gender"
            name="gender"
            value={features.gender}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="height" className="form-label">
            Height (in cm):
          </label>
          <input
            type="number"
            className="form-control"
            id="height"
            name="height"
            value={features.height}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">
            Weight (in kg):
          </label>
          <input
            type="number"
            className="form-control"
            id="weight"
            name="weight"
            value={features.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ap_hi" className="form-label">
            Systolic Blood Pressure (AP Hi):
          </label>
          <input
            type="number"
            className="form-control"
            id="ap_hi"
            name="ap_hi"
            value={features.ap_hi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ap_lo" className="form-label">
            Diastolic Blood Pressure (AP Lo):
          </label>
          <input
            type="number"
            className="form-control"
            id="ap_lo"
            name="ap_lo"
            value={features.ap_lo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cholesterol" className="form-label">
            Cholesterol (1 = Normal, 2 = Above Normal, 3 = Well Above Normal):
          </label>
          <input
            type="number"
            className="form-control"
            id="cholesterol"
            name="cholesterol"
            value={features.cholesterol}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="gluc" className="form-label">
            Glucose (1 = Normal, 2 = Above Normal):
          </label>
          <input
            type="number"
            className="form-control"
            id="gluc"
            name="gluc"
            value={features.gluc}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-check-label">Active:</label>
          <input
            type="checkbox"
            name="active"
            className="form-check-input"
            checked={features.active}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {prediction && (
        <div className="mt-4">
          <h4>Risk Score:</h4>
          <p>{(prediction.prediction)} out of 1000 have CVD risk</p>
        </div>
      )}

      {error && <div className="alert alert-danger mt-4">{error}</div>}
    </div>
  );
}; 

export default App;
