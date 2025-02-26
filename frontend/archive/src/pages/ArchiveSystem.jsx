import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const ArchiveSystem = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ courseCode: "", department: "", level: "" });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [review, setReview] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/documents/");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents", error);
    }
  };

  const handleReviewSubmit = async (docId) => {
    if (!review) {
        alert("Review cannot be empty");
        return;
    }
    try {
        await axios.post(`http://localhost:5000/api/documents/review/${docId}`, { review });
        setReview(""); // Clear the input after successful submission
        fetchDocuments(); // Refresh documents with updated reviews
    } catch (error) {
        console.error("Error submitting review", error);
    }
};



  const filteredDocuments = documents.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(search.toLowerCase()) &&
      (!filters.courseCode || doc.courseCode.includes(filters.courseCode)) &&
      (!filters.department || doc.department?.includes(filters.department)) &&
      (!filters.level || doc.level?.toString() === filters.level)
    );
  });

  return (
    <>
    
    <div className="container mx-auto p-4 relative">
      <Navbar />
      <Link to="/upload" className="mr-4 hover:underline fixed bottom-5 right-5 p-3 rounded text-white bg-red-500">Upload</Link>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title"
          className="p-2 border rounded w-full mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filter by Course Code"
            className="p-2 border rounded w-1/3"
            value={filters.courseCode}
            onChange={(e) => setFilters({ ...filters, courseCode: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by Department"
            className="p-2 border rounded w-1/3"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by Level"
            className="p-2 border rounded w-1/3"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div key={doc._id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{doc.title}</h2>
            <p className="text-gray-600">Course Code: {doc.courseCode || "N/A"}</p>
            <p className="text-gray-600">Department: {doc.department || "N/A"}</p>
            <p className="text-gray-600 mb-2">Level: {doc.level || "N/A"}</p>
            <a className="p-2 bg-green-500 text-white rounded" href={`http://localhost:5000/api/documents/download/${doc._id}`} target="_blank" rel="noopener noreferrer">
  Download
</a>

            <button onClick={() => setSelectedDocument(doc)} className="text-blue-500 ml-4">
              View Details
            </button>
            {selectedDocument && selectedDocument._id === doc._id && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Description:</h3>
                <p>{doc.description}</p>
              </div>
            )}
            {selectedDocument && selectedDocument._id === doc._id && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Reviews:</h3>
                {doc.reviews?.length > 0 ? (
                  <ol className="list-disc pl-4">
                   {doc.reviews.map((review, index) => (
                      <div className="bg-gray-100 p-2 shadow rounded-sm" key={index}>{review.text}</div>
                    ))}
                  </ol>
                ) : (
                  <p>No reviews yet.</p>
                )}
                <textarea
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Write a review..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => handleReviewSubmit(doc._id)}
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ArchiveSystem;