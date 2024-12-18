"use client";
import { useContext, useEffect, useState } from "react";
import Card from "./card";
import { getFiles, getUserKeys } from "@/actions/fileActions";
import { Context } from "../Provider/TokenProvider";
import { deleteFiles } from "@/actions/fileActions";
import toast from "react-hot-toast";
import { decryptAES } from "../encryptions/aes";
import Loading from "../loading/loading";
// import { randomBytes } from "crypto";

interface UserKeys {
  key_AES: Buffer;
  key_RC4: Buffer;
  key_DES: Buffer;
}

const AllFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [keys, setKeys] = useState<UserKeys>();

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
          const userKeys = await getUserKeys(token!);
          setKeys(userKeys!);
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
        toast.success("file deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleDownload = async (idFile: string, encType: string) => {
    const response = await fetch(`/api/getFile?id=${idFile}`);
    const data = await response.json();

    let type, url, encryptedBuffer, decrypted, blob, res;
    const a = document.createElement("a");

    if (data) {
      if (encType == "rc4") {
        encryptedBuffer = Buffer.from(data.rc4_encrypted.data);
        const key_RC4 = keys?.key_RC4;
        try {
          const response = await fetch("/api/decrypt/file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ encryptedBuffer, key_RC4 }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          res = await response.json();
        } catch (error) {
          console.error("Error:", error);
        }
        decrypted = Buffer.from(res.decrypted.data);
        console.log("ini rc4 decrypt: ", decrypted);
        blob = new Blob([decrypted], { type: data.fileType });
        url = URL.createObjectURL(blob);
        type = "RC4-";
      } else if (encType == "des") {
        encryptedBuffer = Buffer.from(data.des_encrypted.data);
        const ivDes = data.des_iv.data;
        const key_DES = keys?.key_DES;
        console.log("ini ivdes all: " + ivDes);
        try {
          const response = await fetch("/api/decryptDES/file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ encryptedBuffer, ivDes, key_DES }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          res = await response.json();
        } catch (error) {
          console.error("Error:", error);
        }

        decrypted = Buffer.from(res.decrypted.data);
        console.log("ini des decrypt: ", decrypted);
        blob = new Blob([decrypted], { type: data.fileType });
        url = URL.createObjectURL(blob);
        type = "DES-";
      } else if (encType == "aes") {
        encryptedBuffer = Buffer.from(data.aes_encrypted.data);
        const ivAes = data.aes_iv.data;
        const key_AES = keys?.key_AES;
        console.log("in eB AES: ", encryptedBuffer);
        try {
          const response = await fetch("/api/decryptAES/file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ encryptedBuffer, ivAes, key_AES }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          res = await response.json();
        } catch (error) {
          console.error("Error:", error);
        }
        decrypted = Buffer.from(res.decrypted.data);
        console.log("ini aes decrypt: ", decrypted);
        blob = new Blob([decrypted], { type: data.fileType });
        url = URL.createObjectURL(blob);
        type = "AES-";
      } else {
        return;
      }

      a.href = url;
      a.download = "decrypted-" + type + data.fileName;
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
