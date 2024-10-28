"use client";

import { FormEvent, Fragment, useContext, useEffect, useState } from "react";
import { Context } from "../Provider/TokenProvider";
import { UserAccess } from "@/interface/user_access";
import Loading from "../loading/loading";
import { downloadShared, isSharedKeyCorrect } from "@/actions/actions";
import toast from "react-hot-toast";

const FileAccess = () => {
  const context = useContext(Context);
  const [requests, setRequests] = useState<UserAccess[]>([]);
  const [selectedReq, setSelectedReq] = useState<UserAccess>();
  const [loading, setLoading] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sharedKey, setSharedKey] = useState("");

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;
  const token = getToken();

  const onClickDownload = (selected: UserAccess) => {
    setModalOpen(true);
    setSelectedReq(selected);
  };

  useEffect(() => {
    const fetchAccess = async () => {
      if (token) {
        try {
          const decodedToken = atob(token.split(".")[1]);
          const jsonObject = JSON.parse(decodedToken);
          const currentUserId = jsonObject.id;

          const response = await fetch(
            `/api/getRequest?userReqId=${currentUserId}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result: UserAccess[] = await response.json();
          console.log("ini result", result);
          setRequests(result);
          setLoading(false);
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    };
    fetchAccess();
  }, [token]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSharedKey("");
    setSelectedReq(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await isSharedKeyCorrect(
      sharedKey,
      selectedReq?.encrypted_symmetric_key as Buffer
    );

    if (!isValid) {
      toast.error("incorrect shared key");
      setSharedKey("");
      return;
    }

    setLoadingDownload(true);

    const downloaded = await downloadShared(token!, sharedKey, selectedReq!);

    const decrypted = Buffer.from(downloaded.decrypted.data);
    const blob = new Blob([decrypted], { type: selectedReq!.file.fileType });
    const url = URL.createObjectURL(blob);
    const type = `${selectedReq!.method}-`;

    const a = document.createElement("a");
    a.href = url;
    a.download = "decrypted-" + type + selectedReq!.file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLoadingDownload(false);
    toast.success("success to download");
    return;
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          {loadingDownload ? (
            <Loading />
          ) : (
            <div className="relative bg-white rounded-lg shadow-lg w-96 p-6">
              <button
                className="absolute top-2 right-6 text-gray-700 hover:text-gray-900"
                onClick={() => handleCloseModal()}
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-4 text-black text-center">
                Enter Shared Encryption Key
              </h2>
              <form onSubmit={handleSubmit} method="POST">
                <div className="mb-4">
                  <input
                    type="password"
                    id="sharedKey"
                    name="sharedKey"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    value={sharedKey}
                    onChange={(e) => setSharedKey(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Shared Files</h2>
          {requests.length > 0 ? (
            <table className="table-fixed w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-5/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                    File Name
                  </th>
                  <th className="w-3/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                    Owner
                  </th>
                  <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                    Status
                  </th>
                  <th className="w-2/12 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <Fragment key={request.id}>
                    <tr
                      key={request.id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      } border border-gray-300 dark:border-gray-600`}
                    >
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                        {request.file.fileName}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                        {request.user_owner.username}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                        {request.status === 0 ? (
                          <div className="flex items-center space-x-2">
                            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                            <span>Pending</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            <span>Accepted</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {request.status === 1 ? (
                          <button
                            onClick={() => onClickDownload(request)}
                            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                          >
                            Download
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  </Fragment>
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
                <span className="font-medium">
                  You haven&apos;t made any file requests.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FileAccess;
