"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface RegisterProps {
  change: (target: string) => void; // Define the type for the change prop
  setSelect: Dispatch<SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent, selectedFile: File) => Promise<void>;
}

export const Register: React.FC<RegisterProps> = ({ handleSubmit }) => {
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [income1, setIncome1] = useState<number>(0);
  const [income2, setIncome2] = useState<number>(0);

  // Function to increment income by Rp 1.000.000
  const incrementAmount = (
    income: number,
    setIncome: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setIncome(income + 100);
  };

  // Function to decrement income by Rp 1.000.000
  const decrementAmount = (
    income: number,
    setIncome: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (income > 0) {
      setIncome(income - 100);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0/, ""); // Remove leading 0
    setPhone(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      await handleSubmit(event, selectedFile);
    } else {
      toast.error("Please select a file to upload.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center w-3/4">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          width={25}
          height={25}
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-3">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  ></a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="health_data"
                className="block mb-2 text-sm font-medium text-black"
              >
                Previous Health Conditions (If any)
              </label>
              <textarea
                id="health_data"
                name="health_data"
                rows={4}
                className="block p-2.5 w-full text-sm rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Type your address"
              ></textarea>
            </div>

            <div className="flex gap-5">
              <div className="">
                <label
                  htmlFor="quantity-input-income1"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Income Range
                </label>
                <div className="relative flex items-center max-w-[10rem]">
                  <button
                    type="button"
                    id="decrement-button-income1"
                    onClick={() => decrementAmount(income1, setIncome1)}
                    className="bg-white hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    id="income-1"
                    name="income-1"
                    aria-describedby="helper-text-explanation"
                    className="bg-white hover:bg-gray-200 border border-gray-300  h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={`$ ${income1.toLocaleString()}`}
                    readOnly
                  />
                  <button
                    type="button"
                    id="increment-button-income1"
                    onClick={() => incrementAmount(income1, setIncome1)}
                    className="bg-white hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-center align-middle items-center">
                <p className="text-black translate-y-3">-</p>
              </div>

              <div>
                <label
                  htmlFor="quantity-input-income2"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  To
                </label>
                <div className="relative flex items-center max-w-[10rem]">
                  <button
                    type="button"
                    id="decrement-button-income2"
                    onClick={() => decrementAmount(income2, setIncome2)}
                    className="bg-white hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    id="income-2"
                    name="income-2"
                    aria-describedby="helper-text-explanation"
                    className="bg-white hover:bg-gray-200 border border-gray-300  h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={`$ ${income2.toLocaleString()}`}
                    readOnly
                  />
                  <button
                    type="button"
                    id="increment-button-income2"
                    onClick={() => incrementAmount(income2, setIncome2)}
                    className="bg-white hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                ID Card Image
              </label>
              <input
                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                id="file_input"
                name="file_input"
                type="file"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
