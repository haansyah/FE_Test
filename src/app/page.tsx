"use client";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        setLoading(true);
        try {
          const response = await api.get("/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setIsValidToken(true);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          localStorage.removeItem("token");
        } finally {
          setLoading(false);
        }
      }
    };

    validateToken();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row mt-10">
      <Button asChild className="w-full">
        {isValidToken ? (
          <Link href="/admin/dashboard" className="text-center">
            Go to dashboard
          </Link>
        ) : (
          <Link href="/auth/login" className="text-center">
            Login
          </Link>
        )}
      </Button>
    </div>
  );
}
