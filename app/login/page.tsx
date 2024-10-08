"use client";
import { Login } from "@/components/login/login";
import { Register } from "@/components/register/register";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUser } from "@/actions/actions";
import toast from "react-hot-toast";
import { Context } from "@/components/Provider/TokenProvider";
import { useContext } from "react";

export default function LoginPage() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;

  const [selected, setSelected] = useState<string>("login");
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.push("/");
    }
  }, [getToken, router]);

  const showPage = (category: string) => {
    setSelected(category);
  };

  const changePage = (target: string) => {
    router.push(target);
  };

  const handleSubmitRegister = async (
    event: React.FormEvent,
    selectedFile: File
  ) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    if (selectedFile) {
      formData.append("file", selectedFile);

      try {
        await createUser(formData);
        setSelected("login");
        toast.success("success to register.");
      } catch (error) {
        console.log(error);
        toast.error("failed to register");
      }
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div className="flex min-h-[100vh] w-100 bg-white justify-center items-center">
      <div className="flex justify-center w-3/4 h-fit my-20">
        <ul className="flex flex-col gap-4 w-1/4 text-2xl font-bold leading-9 items-end tracking-tight text-gray-900 h-[450px] justify-center text-center">
          <div>
            <li>
              <button
                onClick={() => showPage("login")}
                className={`${
                  selected === "login" ? "text-red-500" : "text-gray-300"
                } rounded-lg`}
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => showPage("register")}
                className={`${
                  selected === "register" ? "text-red-500" : "text-gray-300"
                } rounded-lg`}
              >
                Register
              </button>
            </li>
          </div>
        </ul>
        <div className="w-3/4 flex justify-center items-center">
          {selected === "login" && (
            <Login change={changePage} setSelect={setSelected} />
          )}
          {selected === "register" && (
            <Register
              change={changePage}
              setSelect={setSelected}
              handleSubmit={handleSubmitRegister}
            />
          )}
        </div>
      </div>
    </div>
  );
}
