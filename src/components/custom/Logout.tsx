"use client";

import React from "react";
import { Button } from "../ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api
        .post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          toast.success("Logged out successfully");
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        });
    } catch (error) {
      toast.error("Failed to log out");
    } finally {
      localStorage.removeItem("token");
    }
  };
  return <div onClick={() => handleLogout()}>Log Out</div>;
}
