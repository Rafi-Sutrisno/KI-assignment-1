import { useState } from "react";
import toast from "react-hot-toast";

interface Access {
  id: string;
  user_request_id: string;
  user_owner_id: string;
  file_id: string;
  requestorName: string;
  status: number;
}

const AccessManager = () => {
  // Dummy data
  const [accessList, setAccessList] = useState<Access[]>([
    {
      id: "1",
      user_request_id: "user1",
      user_owner_id: "owner1",
      file_id: "file1",
      requestorName: "John Doe",
      status: 1,
    },
    {
      id: "2",
      user_request_id: "user2",
      user_owner_id: "owner1",
      file_id: "file2",
      requestorName: "Jane Smith",
      status: 1,
    },
  ]);

  // Function to remove access from the list
  const handleRemoveAccess = (accessID: string) => {
    setAccessList((prevList) =>
      prevList.filter((access) => access.id !== accessID)
    );
    toast.success("Access removed successfully.");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Access Manager</h2>
      {accessList.length === 0 ? (
        <p>No access requests found.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Requestor</th>
              <th className="border px-4 py-2">File ID</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accessList.map((access) => (
              <tr key={access.id}>
                <td className="border px-4 py-2">{access.requestorName}</td>
                <td className="border px-4 py-2">{access.file_id}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleRemoveAccess(access.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccessManager;
