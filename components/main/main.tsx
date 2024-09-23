"use client";
import "./Main.css";
import { decrypt } from "../encryptions/aes";

const Main = () => {
  const handleDownload = async () => {
    const response = await fetch("/api/getFile?id=cm1emr69b00063ll2pl009lu9");
    const data = await response.json();
    console.log("ini data: ", data.aes_encrypted.data);
    console.log("ini aes iv: ", data.aes_iv);
    if (data) {
      const encryptedBuffer = Buffer.from(data.aes_encrypted.data); // Access the data array
      const decrypted = decrypt(encryptedBuffer, data.aes_iv.data); // Call the decrypt function with the Buffer

      const blob = new Blob([decrypted], { type: data.fileType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "decrypted-file"; // Specify the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      console.error("Failed to fetch the file");
    }
  };

  return (
    <div className="main-container">
      <div className="greet">
        <p>
          <span>Welcome to SmoothBrains!</span>
        </p>
        <p className="desc">Tugas Keamanan Informasi 1</p>
        <button
          className="text-xl mt-5 p-3 bg-blue-300 rounded-lg text-black"
          onClick={handleDownload}
        >
          Get ID Card
        </button>
      </div>
    </div>
  );
};

export default Main;
