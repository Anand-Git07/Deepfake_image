import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import About from "./pages/About.jsx";
import DetectionHistory from "./pages/DetectionHistory.jsx";
import ImageAnalysis from "./pages/ImageAnalysis.jsx";
import ModelInfo from "./pages/ModelInfo.jsx";
import ScanDetail from "./pages/ScanDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/image-analysis" replace />} />
        <Route path="/image-analysis" element={<ImageAnalysis />} />
        <Route path="/detection-history" element={<DetectionHistory />} />
        <Route path="/scan-detail" element={<ScanDetail />} />
        <Route path="/scan-detail/:id" element={<ScanDetail />} />
        <Route path="/model-info" element={<ModelInfo />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
