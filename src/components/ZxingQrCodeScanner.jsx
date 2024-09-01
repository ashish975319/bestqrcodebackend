import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const ZxingQrCodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (videoRef.current) {
      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error) => {
          if (result) {
            setScanResult(result.text);
            // Open the scanned result in a new browser tab
            window.open(result.text, "_blank");
          }
          if (error) {
            console.error(error);
          }
        }
      );
    }

    return () => {
      codeReader.current.reset();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white text-center p-4 shadow-md">
        <h1 className="text-2xl font-semibold">Irix QR Code Scanner</h1>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col items-center w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <video ref={videoRef} className="w-full h-[250px] mb-4" />
          {scanResult && (
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Scan Result:</p>
              <a
                href={scanResult}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {scanResult}
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} QR Code Scanner. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default ZxingQrCodeScanner;

// import React, { useRef, useEffect, useState } from "react";
// import { BrowserMultiFormatReader } from "@zxing/library";
// import Footer from "./Footer";

// const ZxingQrCodeScanner = () => {
//   const [scanResult, setScanResult] = useState(null);
//   const videoRef = useRef(null);
//   const codeReader = useRef(new BrowserMultiFormatReader());

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     if (videoElement) {
//       // Check if camera permission is granted
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then(() => {
//           codeReader.current.decodeFromVideoDevice(
//             null,
//             videoElement,
//             (result, error) => {
//               if (result) {
//                 setScanResult(result.text);
//                 // Open the scanned result in a new browser tab
//                 window.open(result.text, "_blank");
//               }
//               if (error && !(error instanceof NotFoundException)) {
//                 console.error(error);
//               }
//             }
//           );
//         })
//         .catch((err) => {
//           console.error("Camera permission denied:", err);
//           alert("Camera access is required for scanning.");
//         });
//     }

//     return () => {
//       codeReader.current.reset();
//     };
//   }, []);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <header className="bg-blue-600 text-white text-center p-4 shadow-md">
//         <h1 className="text-2xl font-semibold">Irix QR Code Scanner</h1>
//       </header>

//       <main className="flex-1 flex flex-col justify-center items-center p-4">
//         <div className="flex flex-col items-center w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//           <video ref={videoRef} className="w-full h-[250px] mb-4" playsInline />
//           {scanResult && (
//             <div className="text-center">
//               <p className="text-lg font-medium mb-2">Scan Result</p>
//               <a
//                 href={scanResult}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline hover:text-blue-800"
//               >
//                 {scanResult}
//               </a>
//             </div>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default ZxingQrCodeScanner;
