"use client";
import Loading from "@/components/loading/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import RequestPage from "@/components/access/request";
import RequestList from "@/app/access/requestList"
import AccessManager from "@/components/access/AccessManager";


const AccessPage = () => {
  // State to track the active page
  const [activePage, setActivePage] = useState("request");
  const [loading, setLoading] = useState(false);

  const handleButtonAccept = async () => {
    const status = 1;
    const accessID = "cm2lkjgnf0004se21m106jpwt";

    try {
      setLoading(true);
      const response = await fetch("/api/requests/set-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, accessID }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("ini data: ", data.message);
      setLoading(false);
      toast.success("success to accept file");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <section className="my-20 mt-28 flex min-h-[50vh] mx-48">
      <div className="w-4/5 h-full p-8">
        {activePage === "request" && <RequestPage />}
        {activePage === "invitations" && (
          
          <div>

            <h2 className="text-xl font-semibold mb-4">Access Invitations</h2>
            {/* Content for Access Invitations page */}
            {/* <p>
              Here you can view and accept requests from others to access your
              files.
            </p>
            <button
              onClick={() => {
                handleButtonAccept();
              }}
              className="p-2 bg-white text-black mt-3"
            >
              TEST ACCEPT
            </button> */}

              <RequestList />



            {loading && (
              <>
                <Loading />
              </>
            )}
          </div>
        )}
        {activePage === "fileAccess" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">File Access</h2>
            {/* Content for File Access page */}
            <p>Manage and view file access requests.</p>
          </div>
        )}
        {activePage === "accessManager" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Access Manager</h2>
            <AccessManager /> {/* Panggil komponen AccessManager */}
        </div>
        )}
      </div>

      <div className="w-1/5 h-full flex flex-col items-center">
        {/* Request File Access */}
        <div
          onClick={() => setActivePage("request")}
          className={`w-full py-4 text-center cursor-pointer text-xl font-bold hover:bg-slate-300 hover:opacity-100 whitespace-nowrap ${
            activePage === "request" ? "text-black bg-gray-400" : "opacity-40"
          }`}
        >
          Request File Access
        </div>

        {/* Access Invitations */}
        <div
          onClick={() => setActivePage("invitations")}
          className={`w-full py-4 text-center cursor-pointer text-xl font-bold hover:bg-slate-300 hover:opacity-100 ${
            activePage === "invitations"
              ? "text-black bg-gray-400"
              : "opacity-40"
          }`}
        >
          Access Invitations
        </div>

        {/* File Access */}
        <div
          onClick={() => setActivePage("fileAccess")}
          className={`w-full py-4 text-center cursor-pointer text-xl font-bold hover:bg-slate-300 hover:opacity-100 ${
            activePage === "fileAccess"
              ? "text-black bg-gray-400"
              : "opacity-40"
          }`}
        >
          File Access
        </div>

        {/* Access Manager */}
        <div
          onClick={() => setActivePage("accessManager")}
          className={`w-full py-4 text-center cursor-pointer text-xl font-bold hover:bg-slate-300 hover:opacity-100 ${
            activePage === "accessManager"
              ? "text-black bg-gray-400"
              : "opacity-40"
          }`}
        >
          Access Manager
        </div>
      </div>
    </section>
  );
};

export default AccessPage;
