import React, {useState} from 'react';
// import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (event)=>{
    setSelectedFile(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]))
    console.log(selectedFile);
    console.log(imageUrl)
  }
  const uploadImage = ()=>{
    console.log('functionality to be added');
  }

  return (
    <div className="App">
      <h1>Recognize Me</h1>
      <input type="file" accept ="image/*" onChange={handleFileChange} />
      <button onClick={uploadImage}>Analyze Image</button>
      {imageUrl && <img src={imageUrl} alt="uploaded file" />}
    </div>
  );
}

export default App;
