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
import { getAllSales } from '@/api/workshopApi';

// Interface untuk data penjualan
type SalesResponse = {
  id: number;
  id_pendaftaran: number;
  nama_depan_peserta: string;
  nama_belakang_peserta: string;
  email_peserta: string;
  nomor_telepon_peserta: string;
  jenis_kelamin_peserta: number;
  tanggal_pendaftaran: string;
  status_pembayaran: boolean;
  nomor_tiket: string;
  id_pengguna: string;
  id_workshop: string;
  id_metode_pembayaran: number;
  workshop: {
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
};

type SortConfig = {
  key:
    | keyof SalesResponse
    | 'participant_name'
    | 'workshop_title'
    | 'workshop_price'
    | null;
  direction: 'asc' | 'desc';
};

// Fungsi API untuk mendapatkan data penjualan (sesuaikan dengan API Anda)
const getSalesData = async () => {
  // Ganti dengan endpoint API yang sesuai
  const response = await fetch('/api/sales');
  const data = await response.json();
  return data;
};

const AdminSalesMain = () => {
  const [sales, setSales] = useState<SalesResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const itemsPerPage = 10;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        // Ganti dengan pemanggilan API yang sebenarnya
        const response = await getAllSales();

        if (response.data) {
          const salesData = response.data;
          const segmentedSales = salesData.map((sale: any, index: number) => ({
            ...sale,
            id: index + 1,
          }));
          setSales(segmentedSales);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const requestSort = (
    key:
      | keyof SalesResponse
      | 'participant_name'
      | 'workshop_title'
      | 'workshop_price',
  ) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Fungsi untuk memfilter data berdasarkan search term dan filter
  const filteredData = useMemo(() => {
    let filtered = sales;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter((sale) => {
        const participantName =
          `${sale.nama_depan_peserta} ${sale.nama_belakang_peserta}`.toLowerCase();
        const email = sale.email_peserta.toLowerCase();
        const phone = sale.nomor_telepon_peserta.toLowerCase();
        const ticketNumber = sale.nomor_tiket.toLowerCase();
        const workshopTitle = sale.workshop.judul_workshop.toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
          participantName.includes(search) ||
          email.includes(search) ||
          phone.includes(search) ||
          ticketNumber.includes(search) ||
          workshopTitle.includes(search)
        );
      });
    }

    // Filter berdasarkan bulan
    if (monthFilter && monthFilter !== 'all') {
      filtered = filtered.filter((sale) => {
        const registrationDate = new Date(sale.tanggal_pendaftaran);
        const month = registrationDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
        return month.toString() === monthFilter;
      });
    }

    // Filter berdasarkan tahun
    if (yearFilter && yearFilter !== 'all') {
      filtered = filtered.filter((sale) => {
        const registrationDate = new Date(sale.tanggal_pendaftaran);
        const year = registrationDate.getFullYear();
        return year.toString() === yearFilter;
      });
    }

    return filtered;
  }, [sales, searchTerm, monthFilter, yearFilter]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle special cases for combined fields
        if (sortConfig.key === 'participant_name') {
          aValue = `${a.nama_depan_peserta} ${a.nama_belakang_peserta}`;
          bValue = `${b.nama_depan_peserta} ${b.nama_belakang_peserta}`;
        } else if (sortConfig.key === 'workshop_title') {
          aValue = a.workshop.judul_workshop;
          bValue = b.workshop.judul_workshop;
        } else if (sortConfig.key === 'workshop_price') {
          aValue = parseInt(a.workshop.harga_workshop);
          bValue = parseInt(b.workshop.harga_workshop);
        } else {
          aValue = a[sortConfig.key as keyof SalesResponse];
          bValue = b[sortConfig.key as keyof SalesResponse];
        }

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
  const getSortIcon = (
    key:
      | keyof SalesResponse
      | 'participant_name'
      | 'workshop_title'
      | 'workshop_price',
  ) => {
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
  }, [searchTerm, monthFilter, yearFilter]);

  // Get unique years from sales data
  const availableYears = useMemo(() => {
    const years = sales.map((sale) => {
      const date = new Date(sale.tanggal_pendaftaran);
      return date.getFullYear();
    });
    return [...new Set(years)].sort((a, b) => b - a); // Sort descending (newest first)
  }, [sales]);

  // Months data
  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setMonthFilter('');
    setYearFilter('');
  };

  const formatDate = (dateString: string) => {
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

  const getPaymentStatusBadge = (status: boolean) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';
    return status
      ? `${baseClass} bg-green-100 text-green-800`
      : `${baseClass} bg-red-100 text-red-800`;
  };

  const getGenderText = (gender: number) => {
    return gender === 1 ? 'Laki-laki' : 'Perempuan';
  };

  const onViewSaleDetail = (id: number) => {
    router.push(`${pathname}/${id}`);
  };

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return filteredData
      .filter((sale) => sale.status_pembayaran)
      .reduce(
        (total, sale) => total + parseInt(sale.workshop.harga_workshop),
        0,
      );
  }, [filteredData]);

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[2rem]'>
          <div>
            <h1 className='text-[2.25rem] font-semibold'>
              Data Penjualan Workshop
            </h1>
            <p>Lihat daftar penjualan workshop yang ada pada sistem</p>
          </div>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Total Penjualan</h3>
            <p className='text-2xl font-bold'>{filteredData.length}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Pembayaran Lunas</h3>
            <p className='text-2xl font-bold text-green-400'>
              {filteredData.filter((sale) => sale.status_pembayaran).length}
            </p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Total Pendapatan</h3>
            <p className='text-2xl font-bold text-blue-400'>
              {formatCurrency(totalRevenue.toString())}
            </p>
          </div>
        </div>

        <div className='w-full flex flex-row justify-between items-center gap-[1rem] mb-6'>
          <div className='flex flex-row items-center gap-4'>
            <Input
              type='text'
              placeholder='Cari peserta, email, telepon, tiket, atau workshop...'
              className='w-[25rem]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Bulan */}
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Pilih Bulan' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Bulan</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Tahun */}
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className='w-[130px]'>
                <SelectValue placeholder='Pilih Tahun' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Tahun</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || monthFilter || yearFilter) && (
            <Button
              variant='outline'
              onClick={clearAllFilters}
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Sales Table */}
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
                  onClick={() => requestSort('participant_name')}
                >
                  Nama Peserta {getSortIcon('participant_name')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('email_peserta')}
                >
                  Email {getSortIcon('email_peserta')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('nomor_telepon_peserta')}
                >
                  Telepon {getSortIcon('nomor_telepon_peserta')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('workshop_title')}
                >
                  Workshop {getSortIcon('workshop_title')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('workshop_price')}
                >
                  Harga {getSortIcon('workshop_price')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('tanggal_pendaftaran')}
                >
                  Tanggal Daftar {getSortIcon('tanggal_pendaftaran')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('status_pembayaran')}
                >
                  Status Bayar {getSortIcon('status_pembayaran')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('nomor_tiket')}
                >
                  Nomor Tiket {getSortIcon('nomor_tiket')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className='text-center py-8'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className='text-center py-8'>
                    {searchTerm || monthFilter || yearFilter
                      ? 'Tidak ada data penjualan yang sesuai dengan filter'
                      : 'Tidak ada data penjualan'}
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
                    <TableCell className='max-w-[150px]'>
                      <div>
                        <p className='font-medium'>
                          {row.nama_depan_peserta} {row.nama_belakang_peserta}
                        </p>
                        <p className='text-xs text-zinc-400'>
                          {getGenderText(row.jenis_kelamin_peserta)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[200px] truncate'>
                      {row.email_peserta}
                    </TableCell>
                    <TableCell>{row.nomor_telepon_peserta}</TableCell>
                    <TableCell className='max-w-[200px]'>
                      <div>
                        <p className='font-medium truncate'>
                          {row.workshop.judul_workshop}
                        </p>
                        <p className='text-xs text-zinc-400'>
                          {formatDate(row.workshop.tanggal_workshop)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {formatCurrency(row.workshop.harga_workshop)}
                    </TableCell>
                    <TableCell>{formatDate(row.tanggal_pendaftaran)}</TableCell>
                    <TableCell>
                      <span
                        className={getPaymentStatusBadge(row.status_pembayaran)}
                      >
                        {row.status_pembayaran ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <button className='text-blue-400 font-semibold hover:text-blue-300 transition-colors cursor-pointer'>
                        {row.nomor_tiket}
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
              {selectedRows.length} dari {sortedData.length} data dipilih.
            </span>
            {(searchTerm || monthFilter || yearFilter) && (
              <span className='text-xs bg-zinc-800 px-2 py-1 rounded'>
                Menampilkan {sortedData.length} dari {sales.length} data
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

export default AdminSalesMain;
