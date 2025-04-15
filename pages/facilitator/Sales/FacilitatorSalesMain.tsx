"use client";

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

type SalesData = {
  id: number;
  nomor: number;
  workshop: string;
  tanggal: string;
  metode: string;
  jumlah: string;
};

type SortConfig = {
  key: keyof SalesData | null;
  direction: "asc" | "desc";
};

const FacilitatorSalesMain = () => {
  const allSalesData: SalesData[] = Array(30)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      nomor: index + 1,
      workshop: "Teknik Tanam Padi",
      tanggal: "12 Mei 2025",
      metode: "Gopay",
      jumlah: "Rp.250.000,00",
    }));

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const requestSort = (key: keyof SalesData) => {
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

  const getSortIcon = (key: keyof SalesData) => {
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
            <h1 className="text-[2.25rem] font-semibold">Daftar Penjualan</h1>
            <p>Lihat hasil penjualan tiket workshop anda di sini</p>
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
              <SelectValue placeholder="Tahun" className="text-white" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[11.25rem]">
              <SelectValue placeholder="Bulan" className="text-white" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="januari">Januari</SelectItem>
              <SelectItem value="februari">Februari</SelectItem>
              <SelectItem value="maret">Maret</SelectItem>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="mei">Mei</SelectItem>
              <SelectItem value="juni">Juni</SelectItem>
              <SelectItem value="juli">Juli</SelectItem>
              <SelectItem value="agustus">Agustus</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="oktober">Oktober</SelectItem>
              <SelectItem value="november">November</SelectItem>
              <SelectItem value="desember">Desember</SelectItem>
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
                  onClick={() => requestSort("workshop")}
                >
                  Nama {getSortIcon("workshop")}
                </TableHead>

                <TableHead
                  className="cursor-pointer text-white"
                  onClick={() => requestSort("tanggal")}
                >
                  Tanggal {getSortIcon("tanggal")}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-white"
                  onClick={() => requestSort("metode")}
                >
                  Metode {getSortIcon("metode")}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer text-white"
                  onClick={() => requestSort("jumlah")}
                >
                  Jumlah {getSortIcon("jumlah")}
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
                  <TableCell>{row.workshop}</TableCell>
                  <TableCell>{row.tanggal}</TableCell>
                  <TableCell>{row.metode}</TableCell>
                  <TableCell className="text-right">{row.jumlah}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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

export default FacilitatorSalesMain;
