"use client";

import React, { useState } from "react";

const FileUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("pdf");

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      // Handle file submission logic
      console.log("File:", selectedFile);
      console.log("File Type:", fileType);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
    </form>
  );
};

export default FileUploadForm;
