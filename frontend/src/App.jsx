import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadPage from "./component/UploadPage";
import MediaListPage from "./component/MediaListPage";
import MediaDetailPage from "./component/MediaDetailPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/media" element={<MediaListPage />} />
        <Route path="/media/:id" element={<MediaDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
