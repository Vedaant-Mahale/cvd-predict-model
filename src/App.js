import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [features, setFeatures] = useState({
    age: 0,
    gender: 0,
    height: 0,
    weight: 0,
    ap_hi: 0,
    ap_lo: 0,
    cholesterol: 0,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 0,
  });

  const [prediction, setPrediction] = useState(null);

  const handleSubmit = (e) => {
    
    e.preventDefault();
    const dataToSend = {
      age: parseInt(features.age), // Ensure all values are integers
      gender: parseInt(features.gender),
      height: parseInt(features.height),
      weight: parseInt(features.weight),
      ap_hi: parseInt(features.ap_hi),
      ap_lo: parseInt(features.ap_lo),
      cholesterol: parseInt(features.cholesterol),
      gluc: parseInt(features.gluc),
      smoke: parseInt(features.smoke),
      alco: parseInt(features.alco),
      active: parseInt(features.active),
    };
    const data = {
      features: Object.values(dataToSend),  // Send the features as an array
    };
    console.log(data);
    axios.post('http://localhost:5000/predict', data)
      .then(res => {
        setPrediction(res.data); // Handle the success response
        console.log(res.data);
      })
      .catch(err => {
        console.log("Fail");
      });
      
  };
  const handleAgeChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        age: e.target.value,
      }));
    }
  const handleGenderChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        gender: e.target.value,
      }));
    }
  const handleHeightChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        height: e.target.value,
      }));
    }
  const handleWeightChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        weight: e.target.value,
      }));
    }
  const handleAphiChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        ap_hi: e.target.value,
      }));
    }
    const handleAploChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        ap_lo: e.target.value,
      }));
    }
  const handleCholesterolChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        cholesterol: e.target.value,
      }));
    }
  const handleGlucoseChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        glucose: e.target.value,
      }));
    }
  const handleAlcoholChange = (e) =>
    {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        alco: e.target.checked ? 1 : 0,
      }));
    }
  const handleSmokeChange = (e) =>
  {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      smoke: e.target.checked ? 1 : 0,
    }));
  }
  const handleActiveChange = (e) =>
  {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      active: e.target.checked ? 1 : 0,
    }));
  }
  return (
    <div>
      <form>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={features.age}
            onChange={handleAgeChange}
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="number"
            name="gender"
            value={features.gender}
            onChange={handleGenderChange}
          />
        </label>
        <br />
        <label>
          Height:
          <input
            type="number"
            name="height"
            value={features.height}
            onChange={handleHeightChange}
          />
        </label>
        <br />
        <label>
          Weight:
          <input
            type="number"
            name="weight"
            value={features.weight}
            onChange={handleWeightChange}
          />
        </label>
        <br />
        <label>
          AP Hi:
          <input
            type="number"
            name="ap_hi"
            value={features.ap_hi}
            onChange={handleAphiChange}
          />
        </label>
        <br />
        <label>
          AP Lo:
          <input
            type="number"
            name="ap_lo"
            value={features.ap_lo}
            onChange={handleAploChange}
          />
        </label>
        <br />
        <label>
          Cholesterol:
          <input
            type="number"
            name="cholesterol"
            value={features.cholesterol}
            onChange={handleCholesterolChange}
          />
        </label>
        <br />
        <label>
          Glucose:
          <input
            type="number"
            name="gluc"
            value={features.gluc}
            onChange={handleGlucoseChange}
          />
        </label>
        <br />
        <label>
          Smoke:
          <input
            type="checkbox"
            name="smoke"
            checked={features.smoke === 1} // 1 for checked, 0 for unchecked
            onChange={handleSmokeChange}
          />
        </label>
        <br />
        <label>
          Alcohol:
          <input
            type="checkbox"
            name="alco"
            checked={features.alco === 1} // 1 for checked, 0 for unchecked
            onChange={handleAlcoholChange}
          />
        </label>
        <br />
        <label>
          Active:
          <input
            type="checkbox"
            name="active"
            checked={features.active === 1} // 1 for checked, 0 for unchecked
            onChange={handleActiveChange}
          />
        </label>
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default App;
