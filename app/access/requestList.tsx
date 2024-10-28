"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../components/Provider/TokenProvider";
import toast from "react-hot-toast";
import Loading from "../../components/loading/loading";
// import { randomBytes } from "crypto";

const RequestList = () => {
  const [requests, setRequests] = useState<any[]>([]);

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

        const decodedToken = atob(token.split(".")[1]);
        const jsonObject = JSON.parse(decodedToken);
        const userId = jsonObject.id;

        setLoading(true);
        const response = await fetch(`/api/getRequest?ownerId=${userId}&status=${0}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("ini data: ", data.message);
        setLoading(false);
        toast.success("success to receive requests");

          setRequests(data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch requests", error);
        }
      }
    };

    fetchFiles();
  }, [token]);

  const handleButtonAccept = async (accessID: string, ownerUsername: string, targetUsername: string) => {
    const status = 1;
    try {
      setLoading(true);
      const response = await fetch("/api/requests/set-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, accessID, ownerUsername, targetUsername }),
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

  const handleButtonReject = async (accessID: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/deleteRequest?requestId=${accessID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("ini data: ", data.message);
      setLoading(false);
      toast.success("success to reject file");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
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
              {requests.length > 0 ? (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="w-1/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                                No.
                            </th>
                            <th className="w-5/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                                Requesting User
                            </th>
                            <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                                Requested File
                            </th>
                            <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index: number) => (
                        <tr
                            className={`${
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-100 dark:bg-gray-700"
                            } border border-gray-300 dark:border-gray-600`}
                            key={request.id}>
                            <td className="px-1 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                                {index + 1}
                            </td>
                            <td className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                                {request.user_request.username}
                            </td>
                            <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                                {request.file.fileName}
                                </td>
                            <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                                <button
                                    type="button"
                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    onClick={() => {
                                        handleButtonAccept(request.id, request.user_owner.username, request.user_request.username);
                                    }}
                                    >
                                    Accept
                                </button>
                                <button
                                    type="button"
                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={() => {
                                      handleButtonReject(request.id);
                                    }}
                                    >
                                     Reject
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
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
                    <span className="font-medium">No Requests Available!</span> You
                    haven't got any requests yet.
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

export default RequestList;
