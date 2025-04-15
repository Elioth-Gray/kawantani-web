"use client";
import React from "react";

import { useState } from "react";
import { DownloadSimple, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const FacilitatorWorkshopsMain = () => {
  const router = useRouter();
  const pathname = usePathname();

  const create = () => {
    router.push(`${pathname}/create`);
  };

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const salesData = Array(2)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      nomor: index + 1,
      gambar: "/images/workshop-image.jpg",
      judul: "Teknik Tanam Padi",
    }));

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === salesData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(salesData.map((row) => row.id));
    }
  };

  return (
    <main className="w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto">
      <section className="w-full h-fit my-[4.5rem] mb-[4.5rem]">
        <div className="w-full flex flex-row justify-between items-center mb-[2rem]">
          <div>
            <h1 className="text-[2.25rem] font-semibold">Workshop</h1>
            <p>Lihat daftar workshop yang telah kamu adakan</p>
          </div>
          <div className="flex flex-row justify-end items-center gap-[0.4rem]">
            <button className="py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]">
              <DownloadSimple size={24} color="#000000" />
              <p className="font-semibold">Download</p>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-[1rem] mb-6">
          <Input
            type="text"
            placeholder="Filter Pencarian..."
            className="w-[20rem]"
          />
          <button
            className="py-[0.4rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem] cursor-pointer"
            onClick={() => create()}
          >
            <PlusCircle size={20} color="#000000" />
            <p className="font-semibold">Buat Workshop</p>
          </button>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900">
              <TableRow className="hover:bg-zinc-900/80 border-zinc-800">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedRows.length === salesData.length &&
                      salesData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-white">
                  Nomor <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-white">
                  Gambar <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-white">
                  Judul Workshop <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-white">
                  Status <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-900/50 border-zinc-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => handleRowSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.nomor}</TableCell>
                  <TableCell>
                    <div className="w-[7rem] h-[4rem] object-cover rounded-lg overflow-clip">
                      <Image
                        className=" object-cover w-full h-full"
                        width={545}
                        height={307}
                        src={row.gambar}
                        alt="cabai"
                        quality={100}
                        unoptimized
                      ></Image>
                    </div>
                  </TableCell>
                  <TableCell>{row.judul}</TableCell>
                  <TableCell>Teverifikasi</TableCell>
                  <TableCell>
                    <Link href="/facilitator/dashboard/workshops/1/details">
                      Lihat Selengkapnya
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {salesData.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-900/50 border-zinc-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => handleRowSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.nomor}</TableCell>
                  <TableCell>
                    <div className="w-[7rem] h-[4rem] object-cover rounded-lg overflow-clip">
                      <Image
                        className=" object-cover w-full h-full"
                        width={545}
                        height={307}
                        src={row.gambar}
                        alt="cabai"
                        quality={100}
                        unoptimized
                      ></Image>
                    </div>
                  </TableCell>
                  <TableCell>{row.judul}</TableCell>
                  <TableCell>Menunggu Verifikasi</TableCell>
                  <TableCell>
                    <Link href="/facilitator/dashboard/workshops/1/details">
                      Lihat Selengkapnya
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {salesData.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-900/50 border-zinc-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => handleRowSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.nomor}</TableCell>
                  <TableCell>
                    <div className="w-[7rem] h-[4rem] object-cover rounded-lg overflow-clip">
                      <Image
                        className=" object-cover w-full h-full"
                        width={545}
                        height={307}
                        src={row.gambar}
                        alt="cabai"
                        quality={100}
                        unoptimized
                      ></Image>
                    </div>
                  </TableCell>
                  <TableCell>{row.judul}</TableCell>
                  <TableCell>Ditolak</TableCell>
                  <TableCell>
                    <Link href="/facilitator/dashboard/workshops/1/details">
                      Lihat Selengkapnya
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
          <div>0 of 6 row(s) selected.</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 px-2">
              <Button
                variant="default"
                size="sm"
                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              >
                1
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              >
                2
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              >
                3
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FacilitatorWorkshopsMain;
