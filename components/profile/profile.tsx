"use client";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../Provider/TokenProvider";
import { getCurrentUser } from "@/actions/actions";
import { User } from "@/interface/user";
import Loading from "../loading/loading";

const Profile = () => {
  const [user, setUsers] = useState<User | null>(null);
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
          const fetchedUser = await getCurrentUser(token);
          setUsers(fetchedUser);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      }
    };

    fetchFiles();
  }, [token]);
  return (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {" "}
          <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                ID:
              </label>
              <p className="text-gray-900">{user?.id}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username:
              </label>
              <p className="text-gray-900">{user?.username}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password (AES Encrypted):
              </label>
              <p className="text-gray-900">{user?.password_AES}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Health Data (RC4 Encrypted):
              </label>
              <p className="text-gray-900">{user?.health_data_RC4}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Income (DES Encrypted):
              </label>
              <p className="text-gray-900">{user?.income_DES}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
