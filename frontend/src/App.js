import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]))
    console.log(selectedFile);
    console.log(imageUrl)
  }
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data.faces);
      setData(response.data.faces);
    }
    catch (error) {
      console.log('Upload error: ', error)
    }
  }

  return (
    <div className="App">
      <h1>Recognize Me</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadImage}>Analyze Image</button>
      {imageUrl && <img className="postedImg" src={imageUrl} alt="uploaded file" style={{width:'500px'}}/>}
      {data.length > 0 && (
        <div>
          <h2>Analysis Results:</h2>
          <ul>
            {data.map((face, index) => (
              <li key={index}>
                <strong>Face {index + 1}</strong>
                <ul>
                  <li>Age: {face.AgeRange.Low} - {face.AgeRange.High}</li>
                  <li>Gender: {face.Gender.Value}</li>
                  <li>Smile: {face.Smile.Value ? 'Yes' : 'No'}</li>
                  <li>
                    Emotions:
                    <ul>
                      {face.Emotions.map((emotion, i) => (
                        <li key={i}>
                          {emotion.Type}: {emotion.Confidence.toFixed(2)}%
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}


    </div>
  );
}

export default App;
