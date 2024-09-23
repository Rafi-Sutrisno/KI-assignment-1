"use client";

import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "../Provider/TokenProvider";
import toast from "react-hot-toast";
import { uploadFile } from "@/actions/fileActions";

const FileUploadForm: React.FC = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("pdf");
  const [showAlert, setShowAlert] = useState(false);

  // Map file types to MIME types or file extensions
  const fileTypeMapping: Record<string, string> = {
    pdf: ".pdf",
    document: ".doc,.docx",
    xls: ".xls,.xlsx",
    video: "video/*",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    setShowAlert(false);
    if (selectedFile) {
      const token = getToken();
      formData.append("file", selectedFile);
      if (token) {
        try {
          await uploadFile(formData, token);
          toast.success("success to upload your file.");
        } catch (error) {
          console.log(error);
          toast.error("failed to upload your file.");
        }
      } else {
        setShowAlert(true);
      }
    } else {
      console.error("no file selected");
      toast.error("no file selected");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-96">
      <div>
        <label
          htmlFor="fileType"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          File Type
        </label>
        <select
          id="fileType"
          value={fileType}
          onChange={handleTypeChange}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="pdf">PDF</option>
          <option value="document">Document</option>
          <option value="xls">XLS</option>
          <option value="video">Video</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="fileUpload"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Upload File
        </label>
        <input
          id="file_input"
          name="file_input"
          type="file"
          accept={fileTypeMapping[fileType]} // Set the accept attribute dynamically
          onChange={handleFileChange}
          className=""
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4"
      >
        Submit
      </button>
      {showAlert && (
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
            <span className="font-medium">Alert!</span> Please Sign In first and
            try submitting again.
          </div>
        </div>
      )}
    </form>
  );
};

export default FileUploadForm;
