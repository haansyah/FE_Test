"use client";

import Map from "@/components/custom/Map";
import api from "@/lib/axios";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [coordinates, setCoordinates] = React.useState([]);
  const [params, setParams] = React.useState({
    show: "active_only",
  });

  const fecthData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api
        .get("/ruas", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCoordinates(
            res?.data
              ?.map((item: any) =>
                item.coordinates.map((coord: any) => coord.coordinates)
              )
              .flat()
          );
        })
        .then(async () => {
          const res = await api.post(
            "/ruas/generate-routes",
            { coordinates },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(res.data);
          console.log("check", res);
        })
        .catch((err) => {
          if (err.status === 401) {
            toast.error("Unauthorized");
            localStorage.removeItem("token");
            window.location.href = "/auth/login";
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    } catch (error) {
      toast.error("Failed to fetch data");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <div className="overflow-hidden max-w-7xl h-full">{/* <Map /> */}</div>
  );
}
