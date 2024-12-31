import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MediaDetailPage = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get("http://localhost:3000/media");
        const selectedMedia = response.data.find((item) => item._id === id);
        setMedia(selectedMedia);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [id]);

  if (!media)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="p-4 md:p-8 lg:p-16">
      <div className="flex justify-center">
        <video
          src={media.videoUrl}
          controls
          autoPlay
          className="w-full h-60 md:h-80 lg:h-[32rem] object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default MediaDetailPage;
