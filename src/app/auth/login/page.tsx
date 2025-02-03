"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [remember, setRemember] = React.useState(
    typeof window !== "undefined" && localStorage.getItem("remember") === "true"
      ? true
      : false
  );
  const [payload, setPayload] = React.useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api
        .post("/login", payload)
        .then((res) => {
          localStorage.setItem("token", res.data.access_token);
          toast.success("Login success", {
            duration: 1500,
          });
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 2000);
        })
        .catch((err) => toast.error("Login failed"))
        .finally(() => console.log("done"));
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    } finally {
      if (typeof window !== "undefined" && remember) {
        localStorage.setItem("remember", "true");
      }
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="">
          <Label htmlFor="username" className="text-xs">
            Username
          </Label>
          <Input
            id="username"
            className="focus:outline-orange-300 focus-visible:ring-orange-400 "
            type="text"
            placeholder="Enter your username"
            onChange={(e) =>
              setPayload({ ...payload, username: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-xs">
            Password
          </Label>
          <Input
            id="password"
            className="focus:outline-orange-300 focus-visible:ring-orange-400 "
            type="password"
            placeholder="Enter your password"
            onChange={(e) =>
              setPayload({ ...payload, password: e.target.value })
            }
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked: boolean) => setRemember(checked)}
          />{" "}
          <span>Remember me</span>
        </div>

        <Button size="sm" className="w-full" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
