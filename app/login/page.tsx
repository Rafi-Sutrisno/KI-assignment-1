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
      <div className="flex justify-center items-center w-3/4 h-fit my-20">
        <ul className="flex flex-col gap-4 bg-white w-1/4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          <li>
            <button onClick={() => showPage("login")}>Login</button>
          </li>
          <li>
            <button onClick={() => showPage("register")}>Register</button>
          </li>
        </ul>
        <div className="w-3/4 flex justify-center items-center">
          {selected === "login" && <Login />}
          {selected === "register" && <Register />}
        </div>
      </div>
    </div>
  );
}
