"use client";
import Login from "@/components/login/login";
import { Register } from "@/components/register/register";
import { useState } from "react";

export default function LoginPage() {
  const [selected, setSelected] = useState<string>("login");

  const showPage = (category: string) => {
    setSelected(category);
  };

  return (
    <div className="flex min-h-[100vh] w-100 bg-white justify-center items-center">
      <div className="flex justify-center w-3/4 h-fit my-20">
        <ul className="flex flex-col gap-4 w-1/4 text-2xl font-bold leading-9 items-end tracking-tight text-gray-900 h-[450px] justify-center">
          <div>
            <li>
              <button onClick={() => showPage("login")}>Login</button>
            </li>
            <li>
              <button onClick={() => showPage("register")} className="mt-3">
                Register
              </button>
            </li>
          </div>
        </ul>
        <div className="w-3/4 flex justify-center items-center">
          {selected === "login" && <Login />}
          {selected === "register" && <Register />}
        </div>
      </div>
    </div>
  );
}
