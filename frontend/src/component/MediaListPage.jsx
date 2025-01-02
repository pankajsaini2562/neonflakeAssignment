import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MediaListPage = () => {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get("http://localhost:3000/media");
        console.log(response);
        setMediaList(response.data.mediaList);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
        Media Library
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaList.map((media) => (
          <div
            key={media._id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/media/${media._id}`}>
              <img
                src={media.thumbnailUrl}
                alt={media.title}
                className="w-full h-40 md:h-48 lg:h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold truncate">{media.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaListPage;
