import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState();
  const [courseCode, setCourseCode] = useState("");
  const [department, setDepartment] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if not authenticated
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file to upload.");
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("courseCode", courseCode);
    formData.append("department", department);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setSuccess("Document uploaded successfully!");
      setTitle("");
      setDescription("");
      setLevel();
      setCourseCode("");
      setDepartment("");
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
            <input
                type="number"
                placeholder="Level"
                className="w-full p-2 mb-2 border rounded"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
            />
          <input
            type="text"
            placeholder="Course Code"
            className="w-full p-2 mb-2 border rounded"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Department"
            className="w-full p-2 mb-2 border rounded"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <input
            type="file"
            className="w-full p-2 mb-4 border rounded"
            onChange={handleFileChange}
            required
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;