"use client";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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

  if (isValidToken) {
    return (
      <div>
        <h1>Home</h1>
        <p>Welcome to the home page</p>
        <a href="/dashboard">
          <Button asChild>
            <Link href="/admin/dashboard">Go to dashboard</Link>
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page</p>
      <a href="/login">
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </a>
    </div>
  );
}
