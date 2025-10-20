"use client";
import { useState } from "react";

export default function UploadPage() {
  const [img, setImg] = useState(null);

  return (
    <>
    <div className="w-screen mx-auto rounded-md  h-screen overflow-hidden flex flex-col items-center justify-center gap-8 bg-black">
      <div
      onDrop={e => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith("image/")) {
          const r = new FileReader();
          r.onload = ev => setImg(ev.target.result);
          r.readAsDataURL(f);
        }
      }}
      onDragOver={e => e.preventDefault()}
      className="flex flex-col items-center justify-center h-[20rem] w-[20rem] border-2 border-dashed rounded-xl text-gray-300"
    >
      {img ? (
        <img src={img} alt="preview" className="max-w-[20rem] max-h-[20rem] rounded-lg" />
      ) : (
        <p>Drag & drop an image here</p>
      )}
    </div>

    </div>
    
    </>
    
  );
}
