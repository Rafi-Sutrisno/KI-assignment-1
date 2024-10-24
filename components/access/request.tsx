"use client";
import React from "react";
import Loading from "@/components/loading/loading";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getAllUser, getUserAccess } from "@/actions/actions";
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
    fileId: string,
    selectedMethod: string
  ) => {
    setLoadingFileId(fileId);
    console.log("ini yang request: ", userid);
    console.log("ini yang punya: ", ownerId);
    console.log("ini file nya: ", fileId);
    const userReqID = userid;
    const userOwnerID = ownerId;
    const fileID = fileId;
    const method = selectedMethod;

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

      // Check if the response contains the success message
      if (data.message === "success to create initial request") {
        setUserAccess((prevAccess) => [...prevAccess, { file_id: fileID }]);
        toast.success("Success to request file");
      } else {
        toast.error("Failed to accept");
      }

      console.log("ini data: ", data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Reset loading after the request finishes
      setLoadingFileId(null);
    }
  };

  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;
  const token = getToken();

  const [loading, setLoading] = useState(true);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userAccess, setUserAccess] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [fileMethods, setFileMethods] = useState<{ [key: string]: string }>({});

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

  const handleModalOpen = async (user: any) => {
    setSelectedUser(user);
    console.log("ini selected", selectedUser);
  };

  useEffect(() => {
    if (selectedUser) {
      const fetchUserAccess = async () => {
        const response = await getUserAccess(currentUsers);
        console.log("resp: ", response);
        setUserAccess(response);
        setModalOpen(true);
      };

      fetchUserAccess();
    }
  }, [selectedUser]);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);

    const resetMethods: { [key: string]: string } = {};
    selectedUser?.user_files.forEach((file: UserFile) => {
      resetMethods[file.id] = "AES";
    });

    setFileMethods(resetMethods);
  };

  const handleMethodChange = (fileId: string, method: string) => {
    setFileMethods((prevMethods) => ({
      ...prevMethods,
      [fileId]: method, // Update the method for the specific file
    }));
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
            className="relative p-4 w-full max-w-4xl max-h-full"
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

              {loading ? (
                <Loading />
              ) : (
                <div className="p-4 md:p-5 space-y-4">
                  <table className="table-fixed w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="w-1/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                          No
                        </th>
                        <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                          Filename
                        </th>
                        <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                          Filetype
                        </th>
                        <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                          Request Option
                        </th>
                        <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                          Request Access
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser?.user_files.map(
                        (file: UserFile, index: number) => (
                          <tr
                            key={file.id}
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
                            <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                              <select
                                value={fileMethods[file.id] || "AES"} // Default to "AES" if no method is selected for this file
                                onChange={(e) =>
                                  handleMethodChange(file.id, e.target.value)
                                } // Update the method for this file
                                className="block w-full px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
                              >
                                <option value="AES">AES</option>
                                <option value="RC4">RC4</option>
                                <option value="DES">DES</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 text-center">
                              {loadingFileId === file.id &&
                              !userAccess.some(
                                (access) => access.file_id === file.id
                              ) ? (
                                <>Requesting ...</>
                              ) : (
                                <>
                                  {userAccess.some(
                                    (access) => access.file_id === file.id
                                  ) ? (
                                    <>
                                      <div className="bg-red-200 p-3 rounded-md whitespace-nowrap w-fit">
                                        <p>Already Requested</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={
                                          () =>
                                            handleButtonRequest(
                                              currentUsers,
                                              file.userId,
                                              file.id,
                                              fileMethods[file.id] || "AES"
                                            ) // Pass the selected method for this file
                                        }
                                        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        type="button"
                                      >
                                        Request Access
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
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
