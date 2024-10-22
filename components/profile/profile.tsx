"use client";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../Provider/TokenProvider";
import { getCurrentUser, handleDecryptAES } from "@/actions/actions";
import { User } from "@/interface/user";
import Loading from "../loading/loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const [user, setUsers] = useState<User | null>(null);
  const context = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isDecryptedPw, setIsDecryptedPw] = useState(false);
  const [isDecryptedIncome, setIsDecryptedIncome] = useState(false);
  const [decryptedHealthData, setDecryptedHealthData] = useState<string | null>(
    null
  );
  const [decryptedPw, setDecryptedPw] = useState<string | null>(null);
  const [decryptedIncome, setDecryptedIncome] = useState<string | null>(null);

  // Function to decrypt the RC4 data and update the state
  async function handleDecryptRC4(
    encryptedInput: string | undefined,
    key_RC4: Buffer
  ) {
    if (!isDecrypted) {
      try {
        const response = await fetch("/api/decrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedInput, key_RC4 }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Decrypted data:", data);
        setDecryptedHealthData(data.decrypted);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setDecryptedHealthData(user!.health_data_RC4);
    }

    setIsDecrypted(!isDecrypted);
  }

  async function handleButtonAES(
    encryptedInput: string | undefined,
    aes_iv: Buffer,
    key_AES: Buffer
  ) {
    if (!isDecryptedPw) {
      try {
        const response = await fetch("/api/decryptAES", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedInput, aes_iv, key_AES }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("ini data: ", data);
        setDecryptedPw(data.decrypted);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setDecryptedPw(user!.password_AES);
    }

    setIsDecryptedPw(!isDecryptedPw);
  }

  async function handleDecryptDES(
    encryptedInput: string | undefined,
    ivDes: Buffer,
    keyDes: Buffer
  ) {
    if (!isDecryptedIncome) {
      try {
        const response = await fetch("/api/decryptDES", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedInput, ivDes, keyDes }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Decrypted data:", data);
        setDecryptedIncome(data.decrypted);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setDecryptedIncome(user!.income_DES);
    }

    setIsDecryptedIncome(!isDecryptedIncome);
  }

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
              <div className="flex gap-3">
                <p className="text-gray-900">
                  {decryptedPw ? decryptedPw : user?.password_AES}
                </p>
                <button
                  onClick={() =>
                    handleButtonAES(
                      user?.password_AES,
                      user!.aes_iv,
                      user!.key_AES
                    )
                  }
                  className=""
                >
                  {isDecryptedPw ? (
                    <FaEye color="black" />
                  ) : (
                    <FaEyeSlash color="black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Health Data (RC4 Encrypted):
              </label>
              <div className="flex gap-3">
                <p className="text-gray-900">
                  {decryptedHealthData
                    ? decryptedHealthData
                    : user?.health_data_RC4}
                </p>

                <button
                  onClick={() =>
                    handleDecryptRC4(user?.health_data_RC4, user!.key_RC4)
                  }
                  className=""
                >
                  {isDecrypted ? (
                    <FaEye color="black" />
                  ) : (
                    <FaEyeSlash color="black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Income (DES Encrypted):
              </label>
              <div className="flex gap-3">
                <p className="text-gray-900">
                  {decryptedIncome ? decryptedIncome : user?.income_DES}
                </p>

                <button
                  onClick={() =>
                    handleDecryptDES(
                      user?.income_DES,
                      user!.des_iv,
                      user!.key_DES
                    )
                  }
                  className=""
                >
                  {isDecryptedIncome ? (
                    <FaEye color="black" />
                  ) : (
                    <FaEyeSlash color="black" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
