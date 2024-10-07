import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full ">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 16px solid #f3f3f3; /* Light grey */
          border-top: 16px solid black; /* Blue */
          border-radius: 50%;
          width: 120px;
          height: 120px;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
