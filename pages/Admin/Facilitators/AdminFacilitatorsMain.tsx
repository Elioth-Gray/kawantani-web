'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown, PlusCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { deleteFacilitator, getAllFacilitator } from '@/api/facilitatorApi';

type SortableKey =
  | 'nomor'
  | 'nama_facilitator'
  | 'email_facilitator'
  | 'nomor_telepon_facilitator';

type SortConfig = {
  key: SortableKey | null;
  direction: 'asc' | 'desc';
};

type Facilitator = {
  id_facilitator: string;
  nama_facilitator: string;
  email_facilitator: string;
  nomor_telepon_facilitator: string;
  alamat_lengkap_facilitator: string;
  tanggal_pembuatan_akun: string;
  id_kabupaten: number;
  nomor: number;
};

const AdminFacilitatorsMain = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const onCreateNavigate = () => {
    router.push(`${pathname}/create`);
  };

  const onDeleteFacilitator = async (id: string) => {
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus facilitator ini?'
    );
    if (!confirmed) return;

    try {
      const result = await deleteFacilitator(id);
      if (result.status === true) {
        setFacilitators((prev) => {
          const updated = prev
            .filter((user) => user.id_facilitator !== id)
            .map((user, index) => ({
              ...user,
              nomor: index + 1,
            }));
          return updated;
        });

        alert('Berhasil menghapus facilitator.');
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error: any) {
      alert('Ada kesalahan');
    }
  };

  const onEditFacilitator = (id: string) => {
    router.push(`${pathname}/edit/${id}`);
  };

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const response = await getAllFacilitator();
        const dataWithNumber = response.data.facilitator.map(
          (f: Omit<Facilitator, 'nomor'>, index: number) => ({
            ...f,
            nomor: index + 1,
          })
        );
        setFacilitators(dataWithNumber);
      } catch (error) {
        console.error('Failed to fetch facilitators:', error);
      }
    };

    fetchFacilitators();
  }, [facilitators]);

  const requestSort = (key: SortableKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableData = [...facilitators];
    const { key, direction } = sortConfig;

    if (key !== null) {
      sortableData.sort((a, b) => {
        const aKey = a[key];
        const bKey = b[key];
        if (aKey < bKey) return direction === 'asc' ? -1 : 1;
        if (aKey > bKey) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sortableData;
  }, [facilitators, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(facilitators.length / itemsPerPage);

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((row) => row.id_facilitator);
    const allSelected = currentPageIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedRows((prev) => {
        const newSelected = [...prev];
        currentPageIds.forEach((id) => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    }
  };

  const getSortIcon = (key: SortableKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className='ml-1 h-4 w-4 inline opacity-50' />;
    }

    return sortConfig.direction === 'asc' ? (
      <ArrowUp className='ml-1 h-4 w-4 inline' />
    ) : (
      <ArrowDown className='ml-1 h-4 w-4 inline' />
    );
  };

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[2rem]'>
          <div>
            <h1 className='text-[2.25rem] font-semibold'>Daftar Facilitator</h1>
            <p>Lihat daftar facilitator yang ada pada sistem</p>
          </div>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>

        <div className='w-full flex flex-row jutify-between items-center gap-[1rem] mb-6'>
          <Input
            type='text'
            placeholder='Filter Pencarian...'
            className='w-[20rem]'
          />
          <button
            className='py-[0.7rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem] cursor-pointer w-76'
            onClick={onCreateNavigate}
          >
            <PlusCircle size={20} color='#000000' />
            <p className='font-semibold'>Tambah Facilitator</p>
          </button>
        </div>

        <div className='rounded-lg border border-zinc-800 overflow-hidden'>
          <Table>
            <TableHeader className='bg-zinc-900'>
              <TableRow className='hover:bg-zinc-900/80 border-zinc-800'>
                <TableHead className='w-[50px]'>
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) =>
                        selectedRows.includes(row.id_facilitator)
                      )
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  onClick={() => requestSort('nomor')}
                  className='cursor-pointer text-white'
                >
                  Nomor {getSortIcon('nomor')}
                </TableHead>
                <TableHead
                  onClick={() => requestSort('nama_facilitator')}
                  className='cursor-pointer text-white'
                >
                  Nama {getSortIcon('nama_facilitator')}
                </TableHead>
                <TableHead
                  onClick={() => requestSort('email_facilitator')}
                  className='cursor-pointer text-white'
                >
                  Email {getSortIcon('email_facilitator')}
                </TableHead>
                <TableHead
                  onClick={() => requestSort('nomor_telepon_facilitator')}
                  className='cursor-pointer text-white text-right'
                >
                  Nomor Telepon {getSortIcon('nomor_telepon_facilitator')}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row.id_facilitator}
                  className='hover:bg-zinc-900/50 border-zinc-800'
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id_facilitator)}
                      onCheckedChange={() =>
                        handleRowSelect(row.id_facilitator)
                      }
                    />
                  </TableCell>
                  <TableCell>{row.nomor}</TableCell>
                  <TableCell>{row.nama_facilitator}</TableCell>
                  <TableCell>{row.email_facilitator}</TableCell>
                  <TableCell className='text-right'>
                    {row.nomor_telepon_facilitator}
                  </TableCell>
                  <TableCell className='text-right flex flex-row justify-center items-center gap-5'>
                    <p
                      className='text-red-400 font-semibold cursor-pointer'
                      onClick={() => onDeleteFacilitator(row.id_facilitator)}
                    >
                      Hapus
                    </p>
                    <p
                      className='text-blue-400 font-semibold cursor-pointer'
                      onClick={() => {
                        onEditFacilitator(row.id_facilitator);
                      }}
                    >
                      Edit
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-4 text-sm text-zinc-400'>
          <div>
            {selectedRows.length} of {facilitators.length} row(s) selected.
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className='flex items-center gap-1 px-2'>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) pageNum = currentPage - 3 + i;
                  if (currentPage > totalPages - 2)
                    pageNum = totalPages - 4 + i;
                }

                return pageNum <= totalPages ? (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size='sm'
                    className={`w-8 h-8 p-0 ${
                      currentPage === pageNum
                        ? ''
                        : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ) : null;
              })}
            </div>
            <Button
              variant='outline'
              size='sm'
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
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

export default AdminFacilitatorsMain;
