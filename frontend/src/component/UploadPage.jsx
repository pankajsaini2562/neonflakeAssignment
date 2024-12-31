import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !thumbnailInputRef.current.files[0] ||
      !videoInputRef.current.files[0]
    ) {
      alert("Please fill all fields and upload both thumbnail and video");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnailInputRef.current.files[0]);
    formData.append("video", videoInputRef.current.files[0]);
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Media uploaded successfully");
      setTitle("");
      setDescription("");
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      navigate("/media");
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Media</h1>
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            ref={thumbnailInputRef}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Video
          </label>
          <input
            type="file"
            accept="video/mp4, video/avi, video/mpeg"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            ref={videoInputRef}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
