"use client";

import React from "react";

import { useState, useMemo } from "react";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type ParticipantData = {
  id: number;
  nomor: number;
  nama: string;
  email: string;
  tanggallahir: string;
  jeniskelamin: string;
  nomortelepon: string;
};

type SortConfig = {
  key: keyof ParticipantData | null;
  direction: "asc" | "desc";
};

const ParticipantsMain = () => {
  const allSalesData: ParticipantData[] = Array(30)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      nomor: index + 1,
      nama: "Edi Suharji",
      email: "edi@mail.com",
      tanggallahir: "01 Januari 2000",
      jeniskelamin: "Laki-Laki",
      nomortelepon: "0812345678",
    }));

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const requestSort = (key: keyof ParticipantData) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableData = [...allSalesData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [allSalesData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allSalesData.length / itemsPerPage);

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((row) => row.id);
    const allSelected = currentPageIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedRows((prev) => {
        const newSelected = [...prev];
        currentPageIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  // Get sort icon for column
  const getSortIcon = (key: keyof ParticipantData) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline opacity-50" />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <main className="w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto">
      <section className="w-full h-fit my-[4.5rem] mb-[4.5rem]">
        <div className="w-full flex flex-row justify-between items-center mb-[2rem]">
          <div>
            <h1 className="text-[2.25rem] font-semibold">Daftar Peserta</h1>
            <p>Lihat peserta workshop yang kamu adakan</p>
          </div>
          <div className="flex flex-row justify-end items-center gap-[0.4rem]">
            <button className="py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]">
              <DownloadSimple size={24} color="#000000" />
              <p className="font-semibold">Download</p>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-row jutify-between items-center gap-[1rem] mb-6">
          <Input
            type="text"
            placeholder="Filter Pencarian..."
            className="w-[20rem]"
          />
          <Select>
            <SelectTrigger className="w-[11.25rem]">
              <SelectValue
                placeholder="Judul Workshop"
                className="text-white"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="januari">Teknik Tanam Padi</SelectItem>
              <SelectItem value="januari">Teknik Tanam Bibit</SelectItem>
              <SelectItem value="januari">Cara Mengatasi Hama</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sales Table */}
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900">
              <TableRow className="hover:bg-zinc-900/80 border-zinc-800">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) =>
                        selectedRows.includes(row.id)
                      )
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-white"
                  onClick={() => requestSort("nomor")}
                >
                  Nomor {getSortIcon("nomor")}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-white"
                  onClick={() => requestSort("nama")}
                >
                  Nama {getSortIcon("nama")}
                </TableHead>

                <TableHead
                  className="cursor-pointer text-white"
                  onClick={() => requestSort("email")}
                >
                  Email {getSortIcon("email")}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-white"
                  onClick={() => requestSort("tanggallahir")}
                >
                  Tanggal lahir {getSortIcon("tanggallahir")}
                </TableHead>
                <TableHead
                  className="text-start cursor-pointer text-white"
                  onClick={() => requestSort("jeniskelamin")}
                >
                  Jenis Kelamin {getSortIcon("jeniskelamin")}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer text-white"
                  onClick={() => requestSort("nomortelepon")}
                >
                  Nomor Telepon {getSortIcon("nomortelepon")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
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
                  <TableCell>{row.nama}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.tanggallahir}</TableCell>
                  <TableCell>{row.jeniskelamin}</TableCell>
                  <TableCell className="text-right">
                    {row.nomortelepon}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
          <div>
            {selectedRows.length} of {allSalesData.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  }
                }

                return pageNum <= totalPages ? (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      currentPage === pageNum
                        ? ""
                        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ) : null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ParticipantsMain;
