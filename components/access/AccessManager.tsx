import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Access {
  id: string;
  file_id: string;
  requestorName: string;
}

const AccessManager = () => {
  const [accessList, setAccessList] = useState<Access[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccessList = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/access/get-access?userId=owner1`); // Sesuaikan dengan user ID yang login
        const data = await response.json();
        setAccessList(
          data.accessList.map((access: any) => ({
            id: access.id,
            file_id: access.file_id,
            requestorName: access.user_request.name, // Nama user yang request akses
          }))
        );
      } catch (error) {
        console.error("Error fetching access list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessList();
  }, []);

  const handleRemoveAccess = async (accessID: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/access/remove-access`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessID }),
      });

      if (response.ok) {
        setAccessList((prevList) =>
          prevList.filter((access) => access.id !== accessID)
        );
        toast.success("Access removed successfully.");
      } else {
        toast.error("Failed to remove access.");
      }
    } catch (error) {
      console.error("Error removing access:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Access Manager</h2>
      {loading ? (
        <p>Loading...</p>
      ) : accessList.length === 0 ? (
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
