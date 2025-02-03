"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = React.useState(false);
  const [coordinates, setCoordinates] = React.useState("");
  const [unitData, setUnitData] = React.useState([]);
  const [form, setForm] = React.useState({
    ruas_name: "",
    unit_id: "",
    long: "",
    km_awal: "",
    km_akhir: "",
    status: "",
    coordinates: [] as string[],
  });

  const fetchUnitData = async () => {
    try {
      const token = localStorage.getItem("token");
      await api
        .get("/unit", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUnitData(res?.data?.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRuasData = async () => {
    try {
      const token = localStorage.getItem("token");
      await api
        .get(`/ruas/${params?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setForm(res?.data?.data);
          setForm((prevForm) => ({
            ...prevForm,
            long: String(res?.data?.data?.long),
          }));
          const coordinatesString = res?.data?.data?.coordinates
            .map((coord: any) => coord.coordinates)
            .join("+");
          setCoordinates(coordinatesString);
          console.log("coorssz", res?.data?.data?.coordinates);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api
        .put(`/ruas/${params?.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success("Ruas updated successfully");
          setTimeout(() => {
            router.push("/admin/master-data/ruas");
          }, 2000);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update ruas");
        });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUnitData();
  }, []);

  React.useEffect(() => {
    fetchRuasData();
  }, []);

  React.useEffect(() => {
    console.log("form", form);
  }, [form]);

  React.useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      coordinates: coordinates.split("+").map((coord) => coord.trim()),
    }));
  }, [coordinates]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Update Ruas</CardTitle>
              <CardDescription>Update new ruas jalan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            action=""
            className="grid grid-cols-2 lg:grid-cols-3 gap-5"
            onSubmit={(e) => onSubmit(e)}
          >
            <div>
              <Label htmlFor="ruas_name">Ruas Name</Label>
              <Input
                id="ruas_name"
                placeholder="Ruas Name"
                defaultValue={form?.ruas_name}
                value={form?.ruas_name}
                onChange={(e) =>
                  setForm({ ...form, ruas_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="unit_id">Unit</Label>
              <Select
                onValueChange={(value) => setForm({ ...form, unit_id: value })}
                defaultValue=""
                value={String(form?.unit_id)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitData.map((unit: any) => {
                    return (
                      <SelectItem key={unit?.id} value={String(unit?.id)}>
                        {unit?.unit}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="long">Long</Label>
              <Input
                id="long"
                placeholder="Long"
                value={String(form?.long)}
                onChange={(e) =>
                  setForm({ ...form, long: String(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="km_awal">Km Awal</Label>
              <Input
                id="km_awal"
                placeholder="Km Awal"
                value={form?.km_awal}
                onChange={(e) => setForm({ ...form, km_awal: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="km_akhir">Km Akhir</Label>
              <Input
                id="km_akhir"
                placeholder="Km Akhir"
                value={form?.km_akhir}
                onChange={(e) => setForm({ ...form, km_akhir: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form?.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
                defaultValue={form?.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Aktif</SelectItem>
                  <SelectItem value="0">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 lg:col-span-3">
              <Label htmlFor="coordinates">Coordinates</Label>
              <Input
                id="coordinates"
                placeholder="Coordinates"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                * Please input coordinates separated by plus (+)
              </p>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
