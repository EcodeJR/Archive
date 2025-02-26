import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ArchiveSystem from "./pages/ArchiveSystem";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<AuthPage type="signup" />} />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/" element={<ArchiveSystem />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
