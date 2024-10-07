"use client";
import { useContext, useEffect, useState } from "react";
import Card from "./card";
import { getFiles } from "@/actions/fileActions";
import { Context } from "../Provider/TokenProvider";
import { deleteFiles } from "@/actions/fileActions";
import toast from "react-hot-toast";
import { decryptAES } from "../encryptions/aes";
import { decryptRC4 } from "../encryptions/rc4";
import Loading from "../loading/loading";

const AllFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const context = useContext(Context);

  const [loading, setLoading] = useState(true);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const { getToken } = context;
  const token = getToken();

  useEffect(() => {
    const fetchFiles = async () => {
      if (token) {
        try {
          const fetchedFiles = await getFiles(token);
          setFiles(fetchedFiles);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch files", error);
        }
      }
    };

    fetchFiles();
  }, [token]);

  const handleDelete = async (idFile: string) => {
    try {
      if (token) {
        await deleteFiles(token, idFile);
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== idFile)); // Remove file from the list
        console.log("file deleted successfully");
        toast.success("file deleted succesfully");
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleDownload = async (idFile: string) => {
    const response = await fetch(`/api/getFile?id=${idFile}`);
    const data = await response.json();

    if (data) {
      const decrypt = 2;
      const encryptedBuffer = Buffer.from(data.rc4_encrypted.data); // Access the data array
      const decrypted = decryptRC4(encryptedBuffer); // Call the decrypt function with the Buffer

      const blob = new Blob([decrypted], { type: data.fileType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      let type = "AES-";

      if (decrypt === 2) {
        type = "RC4-";
      } else if (decrypt === 3) {
        type = "DES-";
      }

      a.download = "decrypted-" + type + data.fileName; // Specify the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      console.error("Failed to fetch the file");
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {token ? (
        <>
          {loading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              {files.length > 0 ? (
                files.map((file) => (
                  <Card
                    key={file.id}
                    fileType={file.fileType}
                    fileID={file.id}
                    fileName={file.fileName}
                    handleDelete={handleDelete}
                    handleDownload={handleDownload}
                  />
                ))
              ) : (
                <div
                  className="flex items-center p-4 mb-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">No Files Available!</span> You
                    haven't uploaded any files yet.
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div
          className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Alert!</span> Please Sign In or
            Register yourself first.
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFiles;
