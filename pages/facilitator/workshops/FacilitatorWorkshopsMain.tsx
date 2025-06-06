'use client';

import React, { useEffect } from 'react';
import { useState, useMemo } from 'react';
import {
  DownloadSimple,
  Eye,
  Pen,
  Trash,
} from '@phosphor-icons/react/dist/ssr';
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

// Interface untuk data workshop
type WorkshopResponse = {
  id_workshop: string;
  judul_workshop: string;
  tanggal_workshop: string;
  alaamt_lengkap_workshop: string;
  deskripsi_workshop: string;
  harga_workshop: string;
  kapasitas: number;
  status_verifikasi: boolean;
  lat_lokasi: number;
  long_lokasi: number;
  gambar_workshop: string;
  status_aktif: boolean;
  waktu_mulai: string;
  waktu_berakhir: string;
  id_facilitator: string;
  id_kabupaten: number;
};

type SortConfig = {
  key: keyof WorkshopResponse | null;
  direction: 'asc' | 'desc';
};

const WorkshopTableMain = () => {
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const itemsPerPage = 10;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchWorkshopsData = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with your actual API call
        const mockResponse = {
          message: 'Berhasil mendapatkan data workshop!',
          data: [
            {
              id_workshop: 'pt-rokok-javier-001',
              judul_workshop: 'Teknik Tanam Padi',
              tanggal_workshop: '2025-04-23T00:00:00.000Z',
              alaamt_lengkap_workshop: 'Jl Mulyorejo 1',
              deskripsi_workshop: 'Workshop ini mengajarkan cara menanam padi',
              harga_workshop: '100000',
              kapasitas: 100,
              status_verifikasi: true,
              lat_lokasi: -65,
              long_lokasi: 645,
              gambar_workshop: '1748456342756-733250820.jpg',
              status_aktif: false,
              waktu_mulai: '08:00',
              waktu_berakhir: '16:00',
              id_facilitator: 'cmb85kdpu0001tqpo4nnd62ob',
              id_kabupaten: 1101,
            },
            {
              id_workshop: 'pt-rokok-javier-002',
              judul_workshop: 'Teknik Tanam Padi',
              tanggal_workshop: '2025-04-23T00:00:00.000Z',
              alaamt_lengkap_workshop: 'Jl Mulyorejo 1',
              deskripsi_workshop: 'Workshop ini mengajarkan cara menanam padi',
              harga_workshop: '100000',
              kapasitas: 100,
              status_verifikasi: true,
              lat_lokasi: -65,
              long_lokasi: 645,
              gambar_workshop: '1748456483929-982293021.jpg',
              status_aktif: true,
              waktu_mulai: '08:00',
              waktu_berakhir: '16:00',
              id_facilitator: 'cmb85kdpu0001tqpo4nnd62ob',
              id_kabupaten: 1101,
            },
            {
              id_workshop: 'pt-rokok-javier-003',
              judul_workshop: 'Teknik Insert Padi',
              tanggal_workshop: '2025-04-23T00:00:00.000Z',
              alaamt_lengkap_workshop: 'Jl Mulyorejo 1',
              deskripsi_workshop: 'Workshop ini mengajarkan cara menanam padi',
              harga_workshop: '100000',
              kapasitas: 100,
              status_verifikasi: true,
              lat_lokasi: -65,
              long_lokasi: 645,
              gambar_workshop: '1748456899201-463848688.jpg',
              status_aktif: true,
              waktu_mulai: '08:00',
              waktu_berakhir: '16:00',
              id_facilitator: 'cmb85kdpu0001tqpo4nnd62ob',
              id_kabupaten: 1101,
            },
            {
              id_workshop: 'pt-rokok-javier-004',
              judul_workshop: 'Teknik Insert Padi',
              tanggal_workshop: '2025-04-23T00:00:00.000Z',
              alaamt_lengkap_workshop: 'Jl Mulyorejo 1',
              deskripsi_workshop: 'Workshop ini mengajarkan cara menanam padi',
              harga_workshop: '100000',
              kapasitas: 100,
              status_verifikasi: true,
              lat_lokasi: -65,
              long_lokasi: 645,
              gambar_workshop: '1748762153133-410931192.jpg',
              status_aktif: true,
              waktu_mulai: '08:00',
              waktu_berakhir: '16:00',
              id_facilitator: 'cmb85kdpu0001tqpo4nnd62ob',
              id_kabupaten: 1101,
            },
          ],
        };

        if (mockResponse.data) {
          setWorkshops(mockResponse.data);
        }
      } catch (error) {
        console.error('Error fetching workshops data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopsData();
  }, []);

  const requestSort = (key: keyof WorkshopResponse) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Fungsi untuk memfilter data berdasarkan search term dan filters
  const filteredData = useMemo(() => {
    let filtered = workshops;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter((workshop) => {
        const search = searchTerm.toLowerCase();
        return (
          workshop.judul_workshop.toLowerCase().includes(search) ||
          workshop.deskripsi_workshop.toLowerCase().includes(search) ||
          workshop.alaamt_lengkap_workshop.toLowerCase().includes(search) ||
          workshop.id_workshop.toLowerCase().includes(search)
        );
      });
    }

    // Filter berdasarkan status aktif
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((workshop) => {
        if (statusFilter === 'active') {
          return workshop.status_aktif === true;
        } else if (statusFilter === 'inactive') {
          return workshop.status_aktif === false;
        }
        return true;
      });
    }

    // Filter berdasarkan status verifikasi
    if (verificationFilter && verificationFilter !== 'all') {
      filtered = filtered.filter((workshop) => {
        if (verificationFilter === 'verified') {
          return workshop.status_verifikasi === true;
        } else if (verificationFilter === 'unverified') {
          return workshop.status_verifikasi === false;
        }
        return true;
      });
    }

    return filtered;
  }, [workshops, searchTerm, statusFilter, verificationFilter]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof WorkshopResponse];
        let bValue: any = b[sortConfig.key as keyof WorkshopResponse];

        // Convert to string for comparison if needed
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
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

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((row) => row.id_workshop);
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
  const getSortIcon = (key: keyof WorkshopResponse) => {
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
  }, [searchTerm, statusFilter, verificationFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setVerificationFilter('');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalWorkshops = filteredData.length;
    const activeCount = filteredData.filter((w) => w.status_aktif).length;
    const inactiveCount = filteredData.filter((w) => !w.status_aktif).length;
    const verifiedCount = filteredData.filter(
      (w) => w.status_verifikasi,
    ).length;
    const unverifiedCount = filteredData.filter(
      (w) => !w.status_verifikasi,
    ).length;

    return {
      total: totalWorkshops,
      active: activeCount,
      inactive: inactiveCount,
      verified: verifiedCount,
      unverified: unverifiedCount,
    };
  }, [filteredData]);

  const onViewWorkshop = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const onCreateWorkshop = () => {
    router.push(`${pathname}/create`);
  };

  const onDeleteWorkshop = (id: string) => {
    console.log('Delete workshop:', id);
    // Add delete logic here
  };

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[2rem]'>
          <div>
            <h1 className='text-[2.25rem] font-semibold'>
              Daftar Workshop Saya
            </h1>
            <p>Kelola workshop yang telah Anda buat</p>
          </div>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <button
              className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-blue-600 text-white rounded-lg gap-[0.5rem] hover:bg-blue-700'
              onClick={() => {
                onCreateWorkshop();
              }}
            >
              <span className='text-lg'>+</span>
              <p className='font-semibold'>Tambah Workshop</p>
            </button>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Export</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Total Workshop</h3>
            <p className='text-2xl font-bold'>{stats.total}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Terverifikasi</h3>
            <p className='text-2xl font-bold text-blue-400'>{stats.verified}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Belum Verifikasi</h3>
            <p className='text-2xl font-bold text-yellow-400'>
              {stats.unverified}
            </p>
          </div>
        </div>

        <div className='w-full flex flex-row justify-between items-center gap-[1rem] mb-6'>
          <div className='flex flex-row items-center gap-4'>
            <Input
              type='text'
              placeholder='Cari workshop berdasarkan judul, deskripsi, atau alamat...'
              className='w-[25rem]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Status Aktif */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Status Workshop' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Status</SelectItem>
                <SelectItem value='active'>Aktif</SelectItem>
                <SelectItem value='inactive'>Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Status Verifikasi */}
            <Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
            >
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Status Verifikasi' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Verifikasi</SelectItem>
                <SelectItem value='verified'>Terverifikasi</SelectItem>
                <SelectItem value='unverified'>Belum Verifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter || verificationFilter) && (
            <Button
              variant='outline'
              onClick={clearAllFilters}
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Workshop Table */}
        <div className='rounded-lg border border-zinc-800 overflow-hidden'>
          <Table>
            <TableHeader className='bg-zinc-900'>
              <TableRow className='hover:bg-zinc-900/80 border-zinc-800'>
                <TableHead className='w-[50px]'>
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) =>
                        selectedRows.includes(row.id_workshop),
                      )
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('judul_workshop')}
                >
                  Judul Workshop {getSortIcon('judul_workshop')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('tanggal_workshop')}
                >
                  Tanggal {getSortIcon('tanggal_workshop')}
                </TableHead>
                <TableHead className='text-white'>Waktu</TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('harga_workshop')}
                >
                  Harga {getSortIcon('harga_workshop')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('kapasitas')}
                >
                  Kapasitas {getSortIcon('kapasitas')}
                </TableHead>

                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('status_verifikasi')}
                >
                  Verifikasi {getSortIcon('status_verifikasi')}
                </TableHead>
                <TableHead className='text-white text-center'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className='text-center py-8'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='text-center py-8'>
                    {searchTerm || statusFilter || verificationFilter
                      ? 'Tidak ada workshop yang sesuai dengan filter'
                      : 'Belum ada workshop yang dibuat'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id_workshop}
                    className='hover:bg-zinc-900/50 border-zinc-800'
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.id_workshop)}
                        onCheckedChange={() => handleRowSelect(row.id_workshop)}
                      />
                    </TableCell>
                    <TableCell className='min-w-[250px]'>
                      <div>
                        <p className='font-medium'>{row.judul_workshop}</p>
                        <p className='text-xs text-zinc-400 truncate max-w-[200px]'>
                          {row.deskripsi_workshop}
                        </p>
                        <p className='text-xs text-zinc-500 mt-1'>
                          {row.alaamt_lengkap_workshop}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(row.tanggal_workshop)}</TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        <p>
                          {formatTime(row.waktu_mulai)} -{' '}
                          {formatTime(row.waktu_berakhir)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatCurrency(row.harga_workshop)}
                    </TableCell>
                    <TableCell className='text-center'>
                      {row.kapasitas} orang
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          row.status_verifikasi
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {row.status_verifikasi ? 'Terverifikasi' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <button
                        className='text-blue-400 font-semibold hover:text-blue-300 transition-colors cursor-pointer'
                        onClick={() => {
                          onViewWorkshop(row.id_workshop);
                        }}
                      >
                        Lihat Detail
                      </button>
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
            {(searchTerm || statusFilter || verificationFilter) && (
              <span className='text-xs bg-zinc-800 px-2 py-1 rounded'>
                Menampilkan {sortedData.length} dari {workshops.length} data
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

export default WorkshopTableMain;
