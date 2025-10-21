"use client";
import { useEffect, useRef, useState } from "react";

export default function UploadPage() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
      setStream(null);
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Stop camera on component unmount
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
      {!isCameraOn ? (
        <button
          onClick={startCamera}
          className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          Turn On Camera
        </button>
      ) : (
        <button
          onClick={stopCamera}
          className="px-6 py-3 bg-red-600 rounded-md hover:bg-red-700 transition"
        >
          Turn Off Camera
        </button>
      )}

      <div className="w-[20rem] h-[20rem] border-2 border-gray-600 rounded-xl flex items-center justify-center overflow-hidden">
        {isCameraOn ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (          <p className="text-gray-400">Camera is off</p>
        )}
      </div>
    </div>
  );
}
