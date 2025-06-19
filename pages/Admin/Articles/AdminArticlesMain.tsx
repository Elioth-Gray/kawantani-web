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
import { deleteUser, getAllUsers } from '@/api/userApi';
import { usePathname, useRouter } from 'next/navigation';
import { getAllArticlesAdmin, getAllCategoies } from '@/api/articleApi';

// Enum untuk status verifikasi
enum StatusVerifikasiWorkshop {
  MENUNGGU = 'MENUNGGU',
  DIVERIFIKASI = 'DIVERIFIKASI',
  DITOLAK = 'DITOLAK',
}

// Interface yang sesuai dengan data API
type ArticleResponse = {
  id: number;
  id_artikel: string;
  judul_artikel: string;
  kategori: {
    nama_kategori_artikel: string;
  };
  pengguna: {
    nama_depan_pengguna: string;
    nama_belakang_pengguna: string;
  };
  tanggal_artikel: string;
  status_aktif: boolean;
  status_artikel: 'DRAFT' | 'PUBLISHED' | string;
  gambar_artikel: string;
  status_verifikasi: StatusVerifikasiWorkshop;
};

type ArticleCategory = {
  id_kategori_artikel: number;
  nama_kategori_artikel: string;
};

type SortConfig = {
  key: keyof ArticleResponse | 'author_name' | null;
  direction: 'asc' | 'desc';
};

const AdminArticlesMain = () => {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const itemsPerPage = 10;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await getAllArticlesAdmin();
        if (response.data) {
          const articles = response.data;
          const segmentedArticles = articles.map(
            (article: any, index: number) => ({
              ...article,
              id: index + 1,
            }),
          );
          setArticles(segmentedArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getAllCategoies();
        if (response.data) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    fetchCategories();
  }, []);

  const requestSort = (key: keyof ArticleResponse | 'author_name') => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Fungsi untuk memfilter data berdasarkan search term dan filter
  const filteredData = useMemo(() => {
    let filtered = articles;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter((article) => {
        const title = article.judul_artikel.toLowerCase();
        const category = article.kategori.nama_kategori_artikel.toLowerCase();
        const authorName =
          `${article.pengguna.nama_depan_pengguna} ${article.pengguna.nama_belakang_pengguna}`.toLowerCase();
        const status = article.status_artikel.toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
          title.includes(search) ||
          category.includes(search) ||
          authorName.includes(search) ||
          status.includes(search)
        );
      });
    }

    // Filter berdasarkan kategori
    if (categoryFilter) {
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(
          (article) =>
            article.kategori.nama_kategori_artikel === categoryFilter,
        );
      }
    }

    // Filter berdasarkan status artikel
    if (statusFilter) {
      if (statusFilter !== 'all') {
        filtered = filtered.filter(
          (article) => article.status_artikel === statusFilter,
        );
      }
    }

    // Filter berdasarkan status verifikasi
    if (verificationFilter) {
      if (verificationFilter !== 'all') {
        filtered = filtered.filter(
          (article) => article.status_verifikasi === verificationFilter,
        );
      }
    }

    return filtered;
  }, [articles, searchTerm, categoryFilter, statusFilter, verificationFilter]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle special cases for combined fields
        if (sortConfig.key === 'author_name') {
          aValue = `${a.pengguna.nama_depan_pengguna} ${a.pengguna.nama_belakang_pengguna}`;
          bValue = `${b.pengguna.nama_depan_pengguna} ${b.pengguna.nama_belakang_pengguna}`;
        } else if (sortConfig.key === 'kategori') {
          aValue = a.kategori.nama_kategori_artikel;
          bValue = b.kategori.nama_kategori_artikel;
        } else {
          aValue = a[sortConfig.key as keyof ArticleResponse];
          bValue = b[sortConfig.key as keyof ArticleResponse];
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
  const getSortIcon = (key: keyof ArticleResponse | 'author_name') => {
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
  }, [searchTerm, categoryFilter, statusFilter, verificationFilter]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = articles.map(
      (article) => article.kategori.nama_kategori_artikel,
    );
    return [...new Set(categories)].sort();
  }, [articles]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
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

  const getStatusBadge = (status: string) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'PUBLISHED':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'DRAFT':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Fungsi untuk mendapatkan badge status verifikasi
  const getVerificationBadge = (status: StatusVerifikasiWorkshop) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case StatusVerifikasiWorkshop.DIVERIFIKASI:
        return `${baseClass} bg-green-100 text-green-800`;
      case StatusVerifikasiWorkshop.MENUNGGU:
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case StatusVerifikasiWorkshop.DITOLAK:
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Fungsi untuk mendapatkan teks status verifikasi
  const getVerificationText = (status: StatusVerifikasiWorkshop) => {
    switch (status) {
      case StatusVerifikasiWorkshop.DIVERIFIKASI:
        return 'Diverifikasi';
      case StatusVerifikasiWorkshop.MENUNGGU:
        return 'Menunggu';
      case StatusVerifikasiWorkshop.DITOLAK:
        return 'Ditolak';
      default:
        return 'Unknown';
    }
  };

  const onViewArticle = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const onDeleteArticle = async (id_artikel: string) => {
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus artikel ini?',
    );
    if (!confirmed) return;

    try {
      // Assuming you have a deleteArticle API function
      // const result = await deleteArticle(id_artikel);
      // if (result.status === true) {
      setArticles((prev) => {
        const filtered = prev.filter(
          (article) => article.id_artikel !== id_artikel,
        );
        return filtered.map((article, index) => ({
          ...article,
          id: index + 1,
        }));
      });

      setSelectedRows([]);
      alert('Berhasil menghapus artikel.');
      // } else {
      //   alert(result.message || 'Ada kesalahan');
      // }
    } catch (error) {
      alert('Ada kesalahan saat menghapus artikel');
    }
  };

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[2rem]'>
          <div>
            <h1 className='text-[2.25rem] font-semibold'>Daftar Artikel</h1>
            <p>Lihat daftar artikel yang ada pada sistem</p>
          </div>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Menunggu Verifikasi</h3>
            <p className='text-2xl font-bold font-bold text-yellow-400'>
              {
                articles.filter(
                  (article) =>
                    article.status_verifikasi ===
                    StatusVerifikasiWorkshop.MENUNGGU,
                ).length
              }
            </p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Diverifikasi</h3>
            <p className='text-2xl font-bold text-green-400'>
              {
                articles.filter(
                  (article) =>
                    article.status_verifikasi ===
                    StatusVerifikasiWorkshop.DIVERIFIKASI,
                ).length
              }
            </p>
          </div>
          <div className='bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className='text-sm text-zinc-400'>Ditolak</h3>
            <p className='text-2xl font-bold text-red-400'>
              {
                articles.filter(
                  (article) =>
                    article.status_verifikasi ===
                    StatusVerifikasiWorkshop.DITOLAK,
                ).length
              }
            </p>
          </div>
        </div>

        <div className='w-full flex flex-row justify-between items-center gap-[1rem] mb-6'>
          <div className='flex flex-row items-center gap-4'>
            <Input
              type='text'
              placeholder='Cari artikel, kategori, penulis, atau status...'
              className='w-[20rem]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Filter Kategori */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Semua Kategori' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id_kategori_artikel}
                    value={category.nama_kategori_artikel}
                  >
                    {category.nama_kategori_artikel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Filter Status Artikel */}

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Semua Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Status</SelectItem>
                <SelectItem value='DRAFT'>Draft</SelectItem>
                <SelectItem value='PUBLISHED'>Published</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Semua Verifikasi' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Verifikasi</SelectItem>
                <SelectItem value={StatusVerifikasiWorkshop.DIVERIFIKASI}>
                  Diverifikasi
                </SelectItem>
                <SelectItem value={StatusVerifikasiWorkshop.MENUNGGU}>
                  Menunggu
                </SelectItem>
                <SelectItem value={StatusVerifikasiWorkshop.DITOLAK}>
                  Ditolak
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm ||
            categoryFilter ||
            statusFilter ||
            verificationFilter) && (
            <Button
              variant='outline'
              onClick={clearAllFilters}
              className='bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Articles Table */}
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
                  onClick={() => requestSort('judul_artikel')}
                >
                  Judul Artikel {getSortIcon('judul_artikel')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('kategori')}
                >
                  Kategori {getSortIcon('kategori')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('author_name')}
                >
                  Penulis {getSortIcon('author_name')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('tanggal_artikel')}
                >
                  Tanggal {getSortIcon('tanggal_artikel')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('status_artikel')}
                >
                  Status {getSortIcon('status_artikel')}
                </TableHead>
                <TableHead
                  className='cursor-pointer text-white'
                  onClick={() => requestSort('status_verifikasi')}
                >
                  Verifikasi {getSortIcon('status_verifikasi')}
                </TableHead>
                <TableHead className='text-center'></TableHead>
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
                    {searchTerm ||
                    categoryFilter ||
                    statusFilter ||
                    verificationFilter
                      ? 'Tidak ada artikel yang sesuai dengan filter'
                      : 'Tidak ada artikel'}
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
                      {row.judul_artikel}
                    </TableCell>
                    <TableCell>{row.kategori.nama_kategori_artikel}</TableCell>
                    <TableCell>
                      {row.pengguna.nama_depan_pengguna +
                        ' ' +
                        row.pengguna.nama_belakang_pengguna}
                    </TableCell>
                    <TableCell>{formatDate(row.tanggal_artikel)}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(row.status_artikel)}>
                        {row.status_artikel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={getVerificationBadge(row.status_verifikasi)}
                      >
                        {getVerificationText(row.status_verifikasi)}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex flex-row justify-center items-center gap-3'>
                        <button
                          className='text-blue-400 font-semibold hover:text-blue-300 transition-colors cursor-pointer'
                          onClick={() => onViewArticle(row.id_artikel)}
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
              {selectedRows.length} dari {sortedData.length} artikel dipilih.
            </span>
            {(searchTerm ||
              categoryFilter ||
              statusFilter ||
              verificationFilter) && (
              <span className='text-xs bg-zinc-800 px-2 py-1 rounded'>
                Menampilkan {sortedData.length} dari {articles.length} artikel
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

export default AdminArticlesMain;
