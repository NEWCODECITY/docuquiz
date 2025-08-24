import { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', file);

    const res = await axios.post('http://localhost:5000/api/pdf/upload', formData);
    setResponse(res.data.text.slice(0, 500)); // show first 500 chars
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button className="bg-blue-500 text-white px-4 py-2 ml-2" type="submit">Upload</button>
      </form>
      <pre className="mt-4 bg-gray-100 p-2">{response}</pre>
    </div>
  );
}
