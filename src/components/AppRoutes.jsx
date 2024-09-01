import React from "react";
import { Routes, Route } from "react-router-dom";
import QRCodeGenerator from "./QRCodeGenerator";
import ScannedData from "./ScannedData";
import QRCodePage from "./QRCodePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<QRCodeGenerator />} />
      <Route path="/scanned-data" element={<ScannedData />} />
      <Route path="/qrcode" element={<QRCodePage />} />
    </Routes>
  );
};

export default AppRoutes;
