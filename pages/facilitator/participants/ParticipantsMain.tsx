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
import { getAllParticipants } from '@/api/workshopApi';

// Interface untuk data peserta
type ParticipantResponse = {
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
  key: keyof ParticipantResponse | 'participant_name' | 'workshop_title' | null;
  direction: 'asc' | 'desc';
};

const AdminParticipantsMain = () => {
  const [participants, setParticipants] = useState<ParticipantResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [workshopFilter, setWorkshopFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const itemsPerPage = 10;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchParticipantsData = async () => {
      setLoading(true);
      try {
        const response = await getAllParticipants();
        console.log(response.data);

        if (response.data) {
          const participantsData = response.data;
          const segmentedParticipants = participantsData.map(
            (participant: any, index: number) => ({
              ...participant,
              id: index + 1,
            }),
          );
          setParticipants(segmentedParticipants);
        }
      } catch (error) {
        console.error('Error fetching participants data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantsData();
  }, []);

  const requestSort = (
    key: keyof ParticipantResponse | 'participant_name' | 'workshop_title',
  ) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Get unique workshops for filter
  const availableWorkshops = useMemo(() => {
    const workshops = participants.map((participant) => ({
      id: participant.workshop.id_workshop,
      title: participant.workshop.judul_workshop,
    }));

    // Remove duplicates based on workshop ID
    const uniqueWorkshops = workshops.filter(
      (workshop, index, self) =>
        index === self.findIndex((w) => w.id === workshop.id),
    );

    return uniqueWorkshops.sort((a, b) => a.title.localeCompare(b.title));
  }, [participants]);

  // Fungsi untuk memfilter data berdasarkan search term dan filter workshop
  const filteredData = useMemo(() => {
    let filtered = participants;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter((participant) => {
        const participantName =
          `${participant.nama_depan_peserta} ${participant.nama_belakang_peserta}`.toLowerCase();
        const email = participant.email_peserta.toLowerCase();
        const phone = participant.nomor_telepon_peserta.toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
          participantName.includes(search) ||
          email.includes(search) ||
          phone.includes(search)
        );
      });
    }

    // Filter berdasarkan workshop
    if (workshopFilter && workshopFilter !== 'all') {
      filtered = filtered.filter((participant) => {
        return participant.workshop.id_workshop === workshopFilter;
      });
    }

    // Filter berdasarkan status pembayaran
    if (paymentStatusFilter && paymentStatusFilter !== 'all') {
      filtered = filtered.filter((participant) => {
        if (paymentStatusFilter === 'paid') {
          return participant.status_pembayaran === true;
        } else if (paymentStatusFilter === 'unpaid') {
          return participant.status_pembayaran === false;
        }
        return true;
      });
    }

    return filtered;
  }, [participants, searchTerm, workshopFilter, paymentStatusFilter]);

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
        } else {
          aValue = a[sortConfig.key as keyof ParticipantResponse];
          bValue = b[sortConfig.key as keyof ParticipantResponse];
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
    key: keyof ParticipantResponse | 'participant_name' | 'workshop_title',
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
  }, [searchTerm, workshopFilter, paymentStatusFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setWorkshopFilter('');
    setPaymentStatusFilter('');
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

  const getGenderText = (gender: number) => {
    return gender === 0 ? 'Laki-laki' : 'Perempuan';
  };

  const onViewParticipantDetail = (id: number) => {
    router.push(`${pathname}/${id}`);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalParticipants = filteredData.length;
    const maleCount = filteredData.filter(
      (p) => p.jenis_kelamin_peserta === 0,
    ).length;
    const femaleCount = filteredData.filter(
      (p) => p.jenis_kelamin_peserta === 1,
    ).length;
    const paidCount = filteredData.filter((p) => p.status_pembayaran).length;
    const unpaidCount = filteredData.filter((p) => !p.status_pembayaran).length;

    return {
      total: totalParticipants,
      male: maleCount,
      female: femaleCount,
      paid: paidCount,
      unpaid: unpaidCount,
    };
  }, [filteredData]);

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[2rem]'>
          <div>
            <h1 className='text-[2.25rem] font-semibold'>
              Daftar Peserta Workshop
            </h1>
            <p>Lihat daftar peserta workshop yang terdaftar pada sistem</p>
          </div>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-6'>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Total Peserta</h3>
            <p className='text-2xl font-bold'>{stats.total}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Laki-laki</h3>
            <p className='text-2xl font-bold text-blue-400'>{stats.male}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Perempuan</h3>
            <p className='text-2xl font-bold text-pink-400'>{stats.female}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Sudah Bayar</h3>
            <p className='text-2xl font-bold text-green-400'>{stats.paid}</p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Belum Bayar</h3>
            <p className='text-2xl font-bold text-red-400'>{stats.unpaid}</p>
          </div>
        </div>

        <div className='w-full flex flex-row justify-between items-center gap-[1rem] mb-6'>
          <div className='flex flex-row items-center gap-4'>
            <Input
              type='text'
              placeholder='Cari peserta berdasarkan nama, email, atau telepon...'
              className='w-[25rem]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Workshop */}
            <Select value={workshopFilter} onValueChange={setWorkshopFilter}>
              <SelectTrigger className='w-[300px]'>
                <SelectValue placeholder='Pilih Workshop' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Workshop</SelectItem>
                {availableWorkshops.map((workshop) => (
                  <SelectItem key={workshop.id} value={workshop.id}>
                    {workshop.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Status Pembayaran */}
            <Select
              value={paymentStatusFilter}
              onValueChange={setPaymentStatusFilter}
            >
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Status Pembayaran' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Status</SelectItem>
                <SelectItem value='paid'>Sudah Bayar</SelectItem>
                <SelectItem value='unpaid'>Belum Bayar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || workshopFilter || paymentStatusFilter) && (
            <Button
              variant='outline'
              onClick={clearAllFilters}
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Participants Table */}
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
                  onClick={() => requestSort('participant_name')}
                >
                  Nama {getSortIcon('participant_name')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('email_peserta')}
                >
                  Email {getSortIcon('email_peserta')}
                </TableHead>
                <TableHead className='text-white'>
                  Tanggal Pendaftaran
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('jenis_kelamin_peserta')}
                >
                  Jenis Kelamin {getSortIcon('jenis_kelamin_peserta')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('nomor_telepon_peserta')}
                >
                  Nomor Telepon {getSortIcon('nomor_telepon_peserta')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('status_pembayaran')}
                >
                  Status Pembayaran {getSortIcon('status_pembayaran')}
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
                  <TableCell colSpan={9} className='text-center py-8'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='text-center py-8'>
                    {searchTerm || workshopFilter || paymentStatusFilter
                      ? 'Tidak ada peserta yang sesuai dengan filter'
                      : 'Tidak ada data peserta'}
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
                    <TableCell className='min-w-[200px]'>
                      <div>
                        <p className='font-medium'>
                          {row.nama_depan_peserta} {row.nama_belakang_peserta}
                        </p>
                        <p className='text-xs text-zinc-400'>
                          {row.workshop.judul_workshop}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[250px] truncate'>
                      {row.email_peserta}
                    </TableCell>
                    <TableCell>
                      {formatDate(row.tanggal_pendaftaran || '')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          row.jenis_kelamin_peserta === 1
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {getGenderText(row.jenis_kelamin_peserta)}
                      </span>
                    </TableCell>
                    <TableCell>{row.nomor_telepon_peserta}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          row.status_pembayaran
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.status_pembayaran ? 'Sudah Bayar' : 'Belum Bayar'}
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
            {(searchTerm || workshopFilter || paymentStatusFilter) && (
              <span className='text-xs bg-zinc-800 px-2 py-1 rounded'>
                Menampilkan {sortedData.length} dari {participants.length} data
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

export default AdminParticipantsMain;
