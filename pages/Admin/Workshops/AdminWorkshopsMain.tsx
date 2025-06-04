'use client';

import React, { useEffect } from 'react';

import { useState, useMemo } from 'react';
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { getAllWorkshops } from '@/api/workshopApi'; // Assuming you have this API function

// Interface untuk workshop data
type WorkshopResponse = {
  id: number;
  id_workshop: string;
  judul_workshop: string;
  tanggal_workshop: string;
  status_verifikasi: boolean;
  status_aktif: boolean;
  gambar_workshop: string;
  facilitator: {
    nama_facilitator: string;
  };
};

type SortConfig = {
  key: keyof WorkshopResponse | 'facilitator_name' | null;
  direction: 'asc' | 'desc';
};

const AdminWorkshopsMain = () => {
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const itemsPerPage = 10;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const response = await getAllWorkshops();
        console.log(response);
        if (response.data) {
          const workshops = response.data;
          const segmentedWorkshops = workshops.map(
            (workshop: any, index: number) => ({
              ...workshop,
              id: index + 1,
            }),
          );
          setWorkshops(segmentedWorkshops);
        }
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const requestSort = (key: keyof WorkshopResponse | 'facilitator_name') => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Fungsi untuk memfilter data berdasarkan search term dan filter
  const filteredData = useMemo(() => {
    let filtered = workshops;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter((workshop) => {
        const title = workshop.judul_workshop.toLowerCase();
        const facilitatorName =
          workshop.facilitator.nama_facilitator.toLowerCase();
        const search = searchTerm.toLowerCase();

        return title.includes(search) || facilitatorName.includes(search);
      });
    }

    // Filter berdasarkan status verifikasi
    if (verificationFilter) {
      if (verificationFilter !== 'all') {
        const isVerified = verificationFilter === 'verified';
        filtered = filtered.filter(
          (workshop) => workshop.status_verifikasi === isVerified,
        );
      }
    }

    return filtered;
  }, [workshops, searchTerm, verificationFilter]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle special cases for combined fields
        if (sortConfig.key === 'facilitator_name') {
          aValue = a.facilitator.nama_facilitator;
          bValue = b.facilitator.nama_facilitator;
        } else {
          aValue = a[sortConfig.key as keyof WorkshopResponse];
          bValue = b[sortConfig.key as keyof WorkshopResponse];
        }

        // Convert to string for comparison if needed
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // Handle date comparison
        if (sortConfig.key === 'tanggal_workshop') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

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
  const getSortIcon = (key: keyof WorkshopResponse | 'facilitator_name') => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className='ml-1 h-4 w-4 inline opacity-50' />;
    }

    return sortConfig.direction === 'asc' ? (
      <ArrowUp className='ml-1 h-4 w-4 inline' />
    ) : (
      <ArrowDown className='ml-1 h-4 w-4 inline' />
    );
  };

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, verificationFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setVerificationFilter('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: boolean) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';
    return status
      ? `${baseClass} bg-green-100 text-green-800`
      : `${baseClass} bg-red-100 text-red-800`;
  };

  const onViewWorkshop = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const onDeleteWorkshop = async (id_workshop: string) => {
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus workshop ini?',
    );
    if (!confirmed) return;

    try {
      // Assuming you have a deleteWorkshop API function
      // const result = await deleteWorkshop(id_workshop);
      // if (result.status === true) {
      setWorkshops((prev) => {
        const filtered = prev.filter(
          (workshop) => workshop.id_workshop !== id_workshop,
        );
        return filtered.map((workshop, index) => ({
          ...workshop,
          id: index + 1,
        }));
      });

      setSelectedRows([]);
      alert('Berhasil menghapus workshop.');
      // } else {
      //   alert(result.message || 'Ada kesalahan');
      // }
    } catch (error) {
      alert('Ada kesalahan saat menghapus workshop');
    }
  };

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[2rem]'>
          <div>
            <h1 className='text-[2.25rem] font-semibold'>Daftar Workshop</h1>
            <p>Lihat daftar workshop yang ada pada sistem</p>
          </div>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>

        <div className='w-full flex flex-row justify-between items-center gap-[1rem] mb-6'>
          <div className='flex flex-row items-center gap-4'>
            <Input
              type='text'
              placeholder='Cari workshop atau fasilitator...'
              className='w-[20rem]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Semua Verifikasi' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Verifikasi</SelectItem>
                <SelectItem value='verified'>Terverifikasi</SelectItem>
                <SelectItem value='unverified'>Belum Verifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || verificationFilter) && (
            <Button
              variant='outline'
              onClick={clearAllFilters}
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Workshops Table */}
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
                  No {getSortIcon('id')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('judul_workshop')}
                >
                  Judul Workshop {getSortIcon('judul_workshop')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('facilitator_name')}
                >
                  Fasilitator {getSortIcon('facilitator_name')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('tanggal_workshop')}
                >
                  Tanggal {getSortIcon('tanggal_workshop')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('status_verifikasi')}
                >
                  Verifikasi {getSortIcon('status_verifikasi')}
                </TableHead>
                <TableHead className='text-center'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    {searchTerm || verificationFilter
                      ? 'Tidak ada workshop yang sesuai dengan filter'
                      : 'Tidak ada workshop'}
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
                    <TableCell className='max-w-[200px] truncate'>
                      {row.judul_workshop}
                    </TableCell>
                    <TableCell>{row.facilitator.nama_facilitator}</TableCell>
                    <TableCell>{formatDate(row.tanggal_workshop)}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(row.status_verifikasi)}>
                        {row.status_verifikasi
                          ? 'Terverifikasi'
                          : 'Belum Verifikasi'}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex flex-row justify-center items-center gap-3'>
                        <button
                          className='text-blue-400 font-semibold hover:text-blue-300 transition-colors cursor-pointer'
                          onClick={() => onViewWorkshop(row.id_workshop)}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-4 text-sm text-zinc-400'>
          <div className='flex items-center gap-4'>
            <span>
              {selectedRows.length} dari {sortedData.length} workshop dipilih.
            </span>
            {(searchTerm || verificationFilter) && (
              <span className='text-xs bg-zinc-800 px-2 py-1 rounded'>
                Menampilkan {sortedData.length} dari {workshops.length} workshop
              </span>
            )}
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

export default AdminWorkshopsMain;
