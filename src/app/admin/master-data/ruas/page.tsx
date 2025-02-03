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
    per_page: 5,
    search: "",
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
        .delete(`/ruas/${id}`, {
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
    <div className="max-w-7xl mx-auto px-4 my-10">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Ruas</CardTitle>
              <CardDescription>Daftar ruas jalan tol</CardDescription>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Input
                className=""
                value={params.search}
                onChange={(e) =>
                  setParams({ ...params, search: e.target.value })
                }
                placeholder="Cari ruas"
              />
              <Button variant="outline" asChild>
                <Link href="/admin/master-data/ruas/form">
                  <PlusIcon />
                  Tambah Ruas
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Ruas</TableHead>
                  <TableHead>Unit ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
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
                      <TableCell>{item.ruas_name}</TableCell>
                      <TableCell>{item.unit_id}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "1" ? "green" : "red"}>
                          {item.status === "1" ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button size="sm" variant="outline">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/master-data/ruas/${item.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteData(item.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row justify-between items-center mt-4">
            <Select
              value={String(params.per_page)}
              defaultValue={String(params.per_page)}
              onValueChange={(val: string) =>
                setParams({ ...params, per_page: Number(val) })
              }
            >
              <SelectTrigger className="w-auto mt-5">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
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
