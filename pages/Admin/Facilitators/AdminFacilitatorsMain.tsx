'use client';

import React, { useEffect } from 'react';

import { useState, useMemo } from 'react';
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
import { deleteFacilitator, getAllFacilitator } from '@/api/facilitatorApi';
import { usePathname, useRouter } from 'next/navigation';

// Interface yang sesuai dengan data API
type FacilitatorData = {
  id: number;
  id_facilitator: string;
  nama_facilitator: string;
  email_facilitator: string;
  nomor_telepon_facilitator: string;
  alamat_lengkap_facilitator: string;
  tanggal_pembuatan_akun: string;
  id_kabupaten: number;
};

type SortConfig = {
  key: keyof FacilitatorData | null;
  direction: 'asc' | 'desc';
};

const AdminFacilitatorsMain = () => {
  const [facilitators, setFacilitators] = useState<FacilitatorData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Tambahkan state untuk filter
  const itemsPerPage = 10;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchFacilitators = async () => {
      setLoading(true);
      try {
        const response = await getAllFacilitator();
        if (response.data) {
          const facilitators = response.data.facilitator;
          const segmentedFacilitators = facilitators.map(
            (facilitator: any, index: number) => ({
              ...facilitator,
              id: index + 1,
            }),
          );
          setFacilitators(segmentedFacilitators);
        }
      } catch (error) {
        console.error('Error fetching facilitators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitators();
  }, []);

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const response = await getAllFacilitator();
        if (response.data) {
          const facilitators = response.data.facilitator;
          const segmentedFacilitators = facilitators.map(
            (facilitator: any, index: number) => ({
              ...facilitator,
              id: index + 1,
            }),
          );
          setFacilitators(segmentedFacilitators);
        }
      } catch (error) {
        console.error('Error fetching facilitators:', error);
      } finally {
      }
    };

    fetchFacilitators();
  }, [facilitators]);

  const requestSort = (key: keyof FacilitatorData) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Fungsi untuk memfilter data berdasarkan search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return facilitators;

    return facilitators.filter((facilitator) => {
      const nama = facilitator.nama_facilitator.toLowerCase();
      const email = facilitator.email_facilitator.toLowerCase();
      const phone = facilitator.nomor_telepon_facilitator.toLowerCase();
      const search = searchTerm.toLowerCase();

      return (
        nama.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });
  }, [facilitators, searchTerm]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key!];
        let bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((row) => row.id);
    const allSelected = currentPageIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
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
  const getSortIcon = (key: keyof FacilitatorData) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className='ml-1 h-4 w-4 inline opacity-50' />;
    }

    return sortConfig.direction === 'asc' ? (
      <ArrowUp className='ml-1 h-4 w-4 inline' />
    ) : (
      <ArrowDown className='ml-1 h-4 w-4 inline' />
    );
  };

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const onCreateNavigate = () => {
    router.push(`${pathname}/create`);
  };

  const onEditFacilitator = (id: string) => {
    router.push(`${pathname}/edit/${id}`);
  };

  const onDeleteFacilitator = async (id_facilitator: string) => {
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus facilitator ini?',
    );
    if (!confirmed) return;

    try {
      const result = await deleteFacilitator(id_facilitator);
      if (result.status === true) {
        // Cari facilitator yang akan dihapus SEBELUM mengupdate state
        const facilitatorToDelete = facilitators.find(
          (facilitator) => facilitator.id_facilitator === id_facilitator,
        );

        setFacilitators((prev) => {
          const filtered = prev.filter(
            (facilitator) => facilitator.id_facilitator !== id_facilitator,
          );
          return filtered.map((facilitator, index) => ({
            ...facilitator,
            id: index + 1,
          }));
        });

        if (facilitatorToDelete) {
          setSelectedRows((prev) =>
            prev.filter((selectedId) => selectedId !== facilitatorToDelete.id),
          );
        }

        alert('Berhasil menghapus facilitator.');
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error deleting facilitator:', error);
      alert('Ada kesalahan saat menghapus facilitator');
    }
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className='py-[0.7rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem] cursor-pointer w-76'
            onClick={onCreateNavigate}
          >
            <PlusCircle size={20} color='#000000' />
            <p className='font-semibold'>Tambah Facilitator</p>
          </button>
        </div>

        {/* Facilitators Table */}
        <div className='rounded-lg border border-zinc-800 overflow-hidden'>
          <Table>
            <TableHeader className='bg-zinc-900'>
              <TableRow className='hover:bg-zinc-900/80 border-zinc-800'>
                <TableHead className='w-[50px]'>
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) =>
                        selectedRows.includes(row.id),
                      )
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('id')}
                >
                  Nomor {getSortIcon('id')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('nama_facilitator')}
                >
                  Nama {getSortIcon('nama_facilitator')}
                </TableHead>

                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('email_facilitator')}
                >
                  Email {getSortIcon('email_facilitator')}
                </TableHead>
                <TableHead
                  className='text-right cursor-pointer text-white'
                  onClick={() => requestSort('nomor_telepon_facilitator')}
                >
                  Nomor Telepon {getSortIcon('nomor_telepon_facilitator')}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
                    {searchTerm
                      ? 'Tidak ada data yang sesuai dengan pencarian'
                      : 'Tidak ada data'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    className='hover:bg-zinc-900/50 border-zinc-800'
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={() => handleRowSelect(row.id)}
                      />
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.nama_facilitator}</TableCell>
                    <TableCell>{row.email_facilitator}</TableCell>
                    <TableCell className='text-right'>
                      {row.nomor_telepon_facilitator}
                    </TableCell>
                    <TableCell className='text-right flex flex-row justify-center items-center gap-5'>
                      <p
                        className='text-red-400 font-semibold cursor-pointer'
                        onClick={() => {
                          onDeleteFacilitator(row.id_facilitator);
                        }}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-4 text-sm text-zinc-400'>
          <div>
            {selectedRows.length} of {sortedData.length} row(s) selected.
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
