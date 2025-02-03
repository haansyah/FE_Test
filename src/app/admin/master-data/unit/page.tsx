"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  PlusIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [pagination, setPagination] = React.useState([]);
  const [params, setParams] = React.useState({
    page: 1,
    per_page: 10,
    search: "",
  });

  const fecthData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api
        .get("/unit", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setData(res?.data?.data);
          setPagination(res?.data?.links);
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

  const deleteData = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await api
        .delete(`/unit/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          toast.success("Data deleted");
          fecthData();
        })
        .catch((err) => {
          if (err.status === 401) {
            toast.error("Unauthorized");
            localStorage.removeItem("token");
            window.location.href = "/auth/login";
          }
        });
    } catch (error) {
      toast.error("Failed to delete data");
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  useEffect(() => {
    fecthData();
  }, [params]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <Card className="w-full mb-10">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Unit Jalan Tol</CardTitle>
              <CardDescription>Manage unit jalan tol</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nama Unit</TableHead>
                  <TableHead>Unit ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(params.per_page)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data?.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((item: any, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        <Badge variant={item.status == "1" ? "green" : "red"}>
                          {item.status == "1" ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row justify-between items-center mt-4">
            <div className="flex flex-row gap-2 items-center flex-wrap">
              {loading
                ? [...Array(5)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-10 w-10" />
                    </div>
                  ))
                : pagination?.map((item: any, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      disabled={item?.url == null}
                      onClick={() =>
                        setParams({
                          ...params,
                          page:
                            Number(
                              new URL(item.url).searchParams.get("page")
                            ) || 1,
                        })
                      }
                    >
                      {index === 0 ? (
                        <ChevronLeft />
                      ) : index === pagination.length - 1 ? (
                        <ChevronRight />
                      ) : (
                        item.label
                      )}
                    </Button>
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
