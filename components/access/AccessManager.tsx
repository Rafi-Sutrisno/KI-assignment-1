import toast from "react-hot-toast";
import { useEffect, useState, useContext } from "react";
import { Context } from "../Provider/TokenProvider";
import { getUserAccessManager, removeUserAccess } from "@/actions/actions";
import { log } from "console";

interface Access {
  id: string;
  file_id: string;
  requestorName: string;
}

const AccessManager = () => {
  const [accessList, setAccessList] = useState<Access[]>([]);
  const [loading, setLoading] = useState(false);

  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;
  const token = getToken();

  useEffect(() => {
    const fetchAccessList = async () => {
      if (token) {
        try {
          setLoading(true);
          const decodedToken = atob(token.split(".")[1]);
          const jsonObject = JSON.parse(decodedToken);
          const userId = jsonObject.id;
          const response = await getUserAccessManager(userId);
          console.log (response);
          setAccessList(
            response.map((access: any) => ({
              id: access.id, // Menggunakan file_id sebagai id
              file_id: access.fileName,
              requestorName: access.username, // Menggunakan username sebagai requestorName
            }))
          );
        } catch (error) {
          console.error("Error fetching access list:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAccessList();
  }, [token]);

  const handleRemoveAccess = async (accessID: string) => {
    try {
      setLoading(true);
      const response = await removeUserAccess(accessID);
  
      if (response.ok) {
        setAccessList((prevList) =>
          prevList.filter((access) => access.id !== accessID)
        );
        toast.success("Access removed successfully.");
      } else {
        toast.error(response.message || "Failed to remove access.");
      }
    } catch (error) {
      console.error("Error removing access:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4"></h2>
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
