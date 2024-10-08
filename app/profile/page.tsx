import Profile from "@/components/profile/profile";
import { Context } from "@/components/Provider/TokenProvider";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const profilePage = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  const { getToken } = context;
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.push("/");
    }
  }, [getToken, router]);

  return (
    <section className="my-20 mt-28 flex justify-center">
      <Profile />
    </section>
  );
};

export default profilePage;
