"use client";
import { useEffect, useRef, useState } from "react";

export default function UploadPage() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [prediction, setPrediction] = useState("Waiting for model output...");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOn(true);
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
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // ============================================================
  // SEND FRAME TO BACKEND EVERY X MILLISECONDS
  // ============================================================
  useEffect(() => {
    let interval;
    if (isCameraOn) {
      const canvas = document.createElement("canvas");
      interval = setInterval(async () => {
        const video = videoRef.current;
        if (!video) return;

        // Draw current frame to canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert frame → base64
        const base64Image = canvas.toDataURL("image/jpeg");

        // Send to backend
        try {
          const res = await fetch("http://127.0.0.1:8000/predict_frame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await res.json();
setPrediction(`${data.prediction} (Accuracy: ${data.accuracy})`);

        } catch (err) {
          console.error("Backend error:", err);
        }
      }, 500); // send every 0.5 sec (adjustable)
    }

    return () => clearInterval(interval);
  }, [isCameraOn]);

  // ============================================================
  // UI
  // ============================================================
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
        ) : (
          <p className="text-gray-400">Camera is off</p>
        )}
      </div>

      {/* Display model output */}
      <div className="text-xl text-green-400 font-semibold">
        {prediction}
      </div>
    </div>
  );
}
