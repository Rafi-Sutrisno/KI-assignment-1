"use client";
import React from "react";
import Loading from "@/components/loading/loading";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getAllUser } from "@/actions/actions";
import { Context } from "../Provider/TokenProvider";

interface UserFile {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
}

interface User {
  id: string;
  username: string;
  _count: {
    user_files: number;
  };
  user_files: UserFile[];
}

const RequestPage = () => {
  const handleButtonRequest = async (
    userid: string,
    ownerId: string,
    fileId: string
  ) => {
    console.log("ini yang request: ", userid);
    console.log("ini yang punya: ", ownerId);
    console.log("ini file nya: ", fileId);
    const userReqID = userid;
    const userOwnerID = ownerId;
    const fileID = fileId;
    const method = "AES";
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userReqID, userOwnerID, fileID, method }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message === true) {
        toast.success("success to request file");
      } else {
        toast.error("failed to accept");
      }
      console.log("ini data: ", data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;
  const token = getToken();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [currentUsers, setCurrentUsers] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      if (token) {
        try {
          const users = await getAllUser(token);
          setUsers(users);
          console.log("ini users:\n", users);
          const decodedToken = atob(token.split(".")[1]);
          const jsonObject = JSON.parse(decodedToken);
          const userId = jsonObject.id;
          //   console.log(userId);
          setCurrentUsers(userId);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch files", error);
        }
      }
    };

    fetchFiles();
  }, [token]);

  const handleModalOpen = (user: any) => {
    setSelectedUser(user);
    console.log("ini selected", selectedUser);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div
          id="default-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={handleModalClose} // Close modal on backdrop click
        >
          <div
            className="relative p-4 w-full max-w-2xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser ? selectedUser.username : "Loading..."}'s Files
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleModalClose}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <table className="table-fixed w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-1/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                        No
                      </th>
                      <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                        Filename
                      </th>
                      <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                        Filetype
                      </th>
                      <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                        Request Access
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser?.user_files.map(
                      (file: UserFile, index: number) => (
                        <tr
                          key={file.id} // Use file ID for a unique key
                          className={`${
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-100 dark:bg-gray-700"
                          } border border-gray-300 dark:border-gray-600`}
                        >
                          <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                            {file.fileName}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                            {file.fileType}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() =>
                                handleButtonRequest(
                                  currentUsers,
                                  file.userId,
                                  file.id
                                )
                              }
                              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              type="button"
                            >
                              Request Access
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Button */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Request File Access</h2>
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr>
              <th className="w-6/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                Username
              </th>
              <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                Number of files
              </th>
              <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                Request Access
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                {user.id !== currentUsers && (
                  <tr
                    key={user.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-700"
                    } border border-gray-300 dark:border-gray-600`}
                  >
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                      {user.username}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                      {user._count.user_files}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleModalOpen(user)} // Pass the user to the modal open handler
                        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                      >
                        See Files
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RequestPage;
