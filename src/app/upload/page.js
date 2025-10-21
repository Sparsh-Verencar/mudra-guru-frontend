"use client";
import { useEffect, useRef, useState } from "react";

export default function UploadPage() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [socket, setSocket] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOn(true);

      const ws = new WebSocket("ws://localhost:8000/ws"); // your FastAPI websocket URL
      setSocket(ws);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (socket) socket.close();
    setIsCameraOn(false);
    setStream(null);
  };

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  // capture frame every 100ms and send
  useEffect(() => {
    if (!isCameraOn || !socket) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const sendFrame = () => {
      if (!videoRef.current) return;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg");
      socket.send(frame);
    };

    const interval = setInterval(sendFrame, 50); // every 100ms
    return () => clearInterval(interval);
  }, [isCameraOn, socket]);

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
    </div>
  );
}
