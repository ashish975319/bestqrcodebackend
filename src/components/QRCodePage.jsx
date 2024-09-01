import React from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";

const QRCodePage = () => {
  const location = useLocation();
  const { state } = location;
  const { qrCodeUrl, color } = state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Generated QR Code</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {qrCodeUrl ? (
          <div className="text-center">
            {/* QRCode component to render the QR code */}
            <QRCode
              value={qrCodeUrl}
              size={200} // Adjust size as needed
              fgColor={color} // Foreground color of QR code
              style={{ width: "150px", height: "150px" }} // Optional styling
            />
          </div>
        ) : (
          <p>No QR Code data available.</p>
        )}
      </div>
    </div>
  );
};

export default QRCodePage;
