'use client';

import PrimaryButton from '@/components/buttons/PrimaryButton';
import React, { useState, useEffect } from 'react';
import {
  unsaveArticle,
  saveArticle,
  getArticleById,
  getSavedArticles,
  likeArticle,
  unlikeArticle,
  addComment,
  getOwnArticleById,
} from '@/api/articleApi';
import Image from 'next/image';
import {
  Bookmark,
  Star,
  Share,
  ArrowLeft,
  Trash,
  Pencil,
  Dresser,
} from '@phosphor-icons/react/dist/ssr';
import { useRouter, usePathname } from 'next/navigation';
import { toggleArticleStatus, deleteArticle } from '@/api/articleApi';
import { validateToken } from '@/api/authApi';

interface Comment {
  id_komentar: number;
  komentar: string;
  tanggal_komentar: string;
  pengguna: {
    nama_depan_pengguna: string;
    nama_belakang_pengguna: string;
    avatar?: string;
  };
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}

const UserArticleDetailMain = () => {
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    'delete' | 'toggle' | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const getCurrentUser = async () => {
    try {
      const response = await validateToken();
      if (response.valid && response.user) {
        setUser(response.user);
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const checkSavedStatus = async (articleId: string, currentUser?: User) => {
    try {
      const response = await getSavedArticles();
      if (response && response.data && currentUser) {
        const isArticleSaved = response.data.some(
          (savedArticle: any) =>
            savedArticle.id_artikel === articleId &&
            savedArticle.id_pengguna === currentUser.id,
        );
        setIsSaved(isArticleSaved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const checkLikeStatus = async (articleId: string, currentUser?: User) => {
    try {
      const response = await getArticleById(articleId);
      if (response && response.data && currentUser) {
        const liked = response.data.artikel_disukai?.some(
          (like: any) => like.id_pengguna === currentUser.id,
        );
        setIsLiked(liked || false);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const currentUser = await getCurrentUser();

      if (article && currentUser) {
        await checkSavedStatus(article.id_artikel, currentUser);
        await checkLikeStatus(article.id_artikel, currentUser);
      }
    };

    initializeData();
  }, [article]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  };

  const toggleSave = async () => {
    if (!article || isSaving || !user) {
      if (!user) {
        setMessage('Silakan login terlebih dahulu');
        setTimeout(() => setMessage(null), 3000);
      }
      return;
    }

    setIsSaving(true);
    const previousState = isSaved;

    try {
      setIsSaved(!previousState);
      let response;

      if (previousState) {
        response = await unsaveArticle({ id: article.id_artikel });
      } else {
        response = await saveArticle({ id: article.id_artikel });
      }

      if (!response) {
        setIsSaved(previousState);
        setMessage(
          response?.message ||
            (previousState
              ? 'Gagal menghapus dari simpan'
              : 'Gagal menyimpan artikel'),
        );
      } else {
        setMessage(
          previousState ? 'Artikel dihapus dari simpan' : 'Artikel disimpan',
        );
      }
    } catch (error: any) {
      setIsSaved(previousState);
      setMessage(error.message || 'Terjadi kesalahan');
      console.error('Error toggling save:', error);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleLike = async () => {
    if (!article || isLiking || !user) {
      if (!user) {
        setMessage('Silakan login terlebih dahulu');
        setTimeout(() => setMessage(null), 3000);
      }
      return;
    }

    setIsLiking(true);
    const previousState = isLiked;

    try {
      setIsLiked(!previousState);
      let response;

      if (previousState) {
        response = await unlikeArticle({
          id: article.id_artikel,
          rating: 0,
        });
      } else {
        response = await likeArticle({ id: article.id_artikel, rating: 5 });
      }

      if (!response) {
        setIsLiked(previousState);
        setMessage(
          response?.message ||
            (previousState ? 'Gagal menghapus like' : 'Gagal memberikan like'),
        );
      } else {
        setMessage(previousState ? 'Like dihapus' : 'Artikel disukai');
        // Refresh article data to get updated like status
        const updatedArticle = await getArticleById(article.id_artikel);
        if (updatedArticle && updatedArticle.data) {
          setArticle(updatedArticle.data);
          // Re-check like status with current user
          await checkLikeStatus(updatedArticle.data.id_artikel, user);
        }
      }
    } catch (error: any) {
      setIsLiked(previousState);
      setMessage(error.message || 'Terjadi kesalahan');
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCommentSubmit = async () => {
    if (!article || !commentContent.trim() || isCommenting || !user) {
      if (!user) {
        setMessage('Silakan login terlebih dahulu');
        setTimeout(() => setMessage(null), 3000);
      }
      return;
    }

    setIsCommenting(true);
    try {
      const response = await addComment({
        id: article.id_artikel,
        content: commentContent,
      });

      if (response && response.data) {
        setMessage(response.message || 'Komentar berhasil ditambahkan');
        setCommentContent('');

        const newComment = {
          id_komentar: response.data.id_komentar,
          id_artikel: response.data.id_artikel,
          id_pengguna: response.data.id_pengguna,
          komentar: response.data.komentar,
          tanggal_komentar: response.data.tanggal_komentar,
          pengguna: {
            id_pengguna: response.data.pengguna?.id_pengguna || user.id,
            nama_depan_pengguna:
              response.data.pengguna?.nama_depan_pengguna || user.firstName,
            nama_belakang_pengguna:
              response.data.pengguna?.nama_belakang_pengguna || user.lastName,
            avatar: response.data.pengguna?.avatar || user.avatar,
          },
        };

        setArticle((prev: any) => ({
          ...prev,
          komentar_artikel: [
            ...(Array.isArray(prev.komentar_artikel)
              ? prev.komentar_artikel
              : []),
            newComment,
          ],
        }));
      } else {
        setMessage(response?.message || 'Gagal menambahkan komentar');
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      if (error.response) {
        setMessage(
          error.response.data?.message || 'Terjadi kesalahan dari server',
        );
      } else if (error.request) {
        setMessage('Tidak dapat menghubungi server');
      } else {
        setMessage(error.message || 'Terjadi kesalahan saat mengirim komentar');
      }
    } finally {
      setIsCommenting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  const refreshArticleData = async () => {
    const segments = pathname && pathname.split('/');
    const articleId = segments && segments[3];

    try {
      const response = await getOwnArticleById(articleId || '');
      if (response && response.data) {
        setArticle(response.data);
      }
    } catch (error) {
      console.error('Error refreshing article:', error);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const segments = pathname && pathname.split('/');
      const articleId = segments && segments[3];

      try {
        // Get current user first
        const currentUser = await getCurrentUser();

        const response = await getArticleById(articleId || '');

        if (response && response.data) {
          setArticle(response.data);

          // Check saved and like status if user is logged in
          if (currentUser) {
            await checkSavedStatus(articleId || '', currentUser);
            await checkLikeStatus(articleId || '', currentUser);
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setMessage('Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [pathname]);

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  // Check if article is draft - Updated to check current state
  const isDraft =
    article?.status_artikel === 'DRAFT' ||
    article?.status_artikel === 'draft' ||
    article?.status_artikel === 'Draft';

  // Check verification status
  const verificationStatus =
    article?.status_verifikasi_artikel ||
    article?.status_verifikasi ||
    article?.verifikasi_status;

  const isVerificationPending = verificationStatus === 'MENUNGGU';
  const isVerificationRejected = verificationStatus === 'DITOLAK';

  // Combined condition: hide actions and comments if draft OR verification pending/rejected
  const shouldHideActionsAndComments =
    isDraft || isVerificationPending || isVerificationRejected;

  // Helper function to get status color and text
  const getStatusBadge = (status: string, type: 'artikel' | 'verifikasi') => {
    if (type === 'artikel') {
      switch (status) {
        case 'DRAFT':
          return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            text: 'Draft',
          };
        case 'PUBLISHED':
          return {
            color: 'bg-green-100 text-green-800 border-green-300',
            text: 'Published',
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-300',
            text: status,
          };
      }
    } else {
      switch (status) {
        case 'MENUNGGU':
          return {
            color: 'bg-blue-100 text-blue-800 border-blue-300',
            text: 'Menunggu Verifikasi',
          };
        case 'DIVERIFIKASI':
          return {
            color: 'bg-green-100 text-green-800 border-green-300',
            text: 'Diverifikasi',
          };
        case 'DITOLAK':
          return {
            color: 'bg-red-100 text-red-800 border-red-300',
            text: 'Ditolak',
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-300',
            text: status,
          };
      }
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const response = await deleteArticle(article.id_artikel);
      if (response && response.data) {
        showMessage('Artikel berhasil dihapus');

        router.push('/dashboard/articles');
      } else {
        showMessage(response.message || 'Gagal menghapus artikel');
      }
    } catch (error: any) {
      showMessage(error.message || 'Terjadi kesalahan saat menghapus artikel');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsProcessing(true);
    try {
      const response = await toggleArticleStatus(article.id_artikel);
      if (response && response.data) {
        // Refresh article data from server to get the most current state
        await refreshArticleData();

        const newStatus =
          article.status_artikel === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        showMessage(
          response.message ||
            `Artikel berhasil ${
              newStatus === 'DRAFT' ? 'diarsipkan' : 'dipublikasikan'
            }`,
        );
      } else {
        showMessage(response.message || 'Gagal mengubah status artikel');
      }
    } catch (error: any) {
      showMessage(error.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'delete') {
      handleDelete();
    } else if (confirmAction === 'toggle') {
      handleToggleStatus();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  if (isLoading)
    return <div className='text-center py-8'>Memuat artikel...</div>;
  if (!article)
    return <div className='text-center py-8'>Artikel tidak ditemukan.</div>;

  const navigate = () => {
    router.push(`${pathname}/edit`);
  };

  return (
    <>
      {/* Main Content */}
      <div
        className={`${
          showConfirmDialog ? 'blur-sm pointer-events-none' : ''
        } transition-all duration-200`}
      >
        <main className='py-[6.4rem] px-[14rem]'>
          <section className='w-full'>
            <div
              className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointers'
              onClick={() => {
                router.push('/dashboard/articles');
              }}
            >
              <ArrowLeft
                size={24}
                color='#00000'
                weight='bold'
                className='cursor-pointer'
              />
              <p className='cursor-pointer'>Kembali</p>
            </div>
          </section>

          <section className='w-full mb-[3.6rem]'>
            <div className='w-full flex flex-row justify-center items-center gap-[3.8rem]'>
              {/* Edit */}
              <div
                className='flex flex-row justify-center items-center gap-[1.1rem] cursor-pointer hover:text-blue-600 transition-colors'
                onClick={() => navigate()}
              >
                <Pencil size={24} color='#0d0d0d' />
                <p>Edit Artikel</p>
              </div>

              {/* Delete */}
              <div
                className='flex flex-row justify-center items-center gap-[1.1rem] cursor-pointer hover:text-red-600 transition-colors'
                onClick={() => {
                  setConfirmAction('delete');
                  setShowConfirmDialog(true);
                }}
              >
                <Trash size={24} color='#0d0d0d' />
                <p>Hapus Artikel</p>
              </div>

              {/* Toggle Status */}
              <div
                className='flex flex-row justify-center items-center gap-[1.1rem] cursor-pointer hover:text-green-600 transition-colors'
                onClick={() => {
                  setConfirmAction('toggle');
                  setShowConfirmDialog(true);
                }}
              >
                <Dresser size={24} color='#0d0d0d' />
                <p>
                  {article.status_artikel === 'PUBLISHED'
                    ? 'Arsipkan'
                    : 'Publikasikan'}
                </p>
              </div>
            </div>
          </section>

          {/* Message Display */}
          {message && (
            <div className='fixed top-4 right-4 z-40 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg'>
              {message}
            </div>
          )}

          {/* Header Section */}
          <section className='flex flex-col items-center gap-4 mb-12 text-center'>
            <div className='flex flex-row gap-4 items-center text-gray-600'>
              <p>Diterbitkan {formatDate(article.tanggal_artikel)}</p>
              <div className='w-[1rem] h-[1rem] rounded-full bg-[#D9D9D9]'></div>
              <p>
                Oleh {article.pengguna?.nama_depan_pengguna}{' '}
                {article.pengguna?.nama_belakang_pengguna}
              </p>
            </div>
            <h1 className='text-3xl font-semibold'>{article.judul_artikel}</h1>
            <p className='max-w-2xl text-gray-700 break-words overflow-wrap-anywhere hyphens-auto'>
              {article.deskripsi_artikel}
            </p>
            <div className='flex flex-col items-center gap-3'>
              <PrimaryButton textColor='#ffffff'>
                {article.kategori?.nama_kategori_artikel || 'Tanpa Kategori'}
              </PrimaryButton>

              {/* Status Labels */}
              <div className='flex flex-row gap-4 items-center mt-3'>
                {/* Status Artikel */}
                {article.status_artikel && (
                  <div
                    className={`px-3 py-1 rounded-full border text-sm font-medium ${
                      getStatusBadge(article.status_artikel, 'artikel').color
                    }`}
                  >
                    {getStatusBadge(article.status_artikel, 'artikel').text}
                  </div>
                )}

                {/* Status Verifikasi Artikel */}
                {(article.status_verifikasi_artikel ||
                  article.status_verifikasi ||
                  article.verifikasi_status) && (
                  <div
                    className={`px-3 py-1 rounded-full border text-sm font-medium ${
                      getStatusBadge(
                        article.status_verifikasi_artikel ||
                          article.status_verifikasi ||
                          article.verifikasi_status,
                        'verifikasi',
                      ).color
                    }`}
                  >
                    {
                      getStatusBadge(
                        article.status_verifikasi_artikel ||
                          article.status_verifikasi ||
                          article.verifikasi_status,
                        'verifikasi',
                      ).text
                    }
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tombol Aksi - Hidden for Draft or Verification Issues */}
          {!shouldHideActionsAndComments && (
            <section className='mb-12 flex justify-center gap-6'>
              <button
                onClick={toggleSave}
                aria-label={isSaved ? 'Hapus dari simpan' : 'Simpan artikel'}
                disabled={isSaving}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isSaved
                    ? 'bg-[#78D14D] border-[#78D14D] text-white'
                    : 'border border-black hover:bg-[#78D14D] hover:border-[#78D14D]'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Bookmark size={24} weight={isSaved ? 'fill' : 'regular'} />
              </button>
              <button
                onClick={toggleLike}
                aria-label={isLiked ? 'Hapus like' : 'Like artikel'}
                disabled={isLiking}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isLiked
                    ? 'bg-[#78D14D] border-[#78D14D] text-white'
                    : 'border border-black hover:bg-[#78D14D] hover:border-[#78D14D]'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Star size={24} weight={isLiked ? 'fill' : 'regular'} />
              </button>
              <button className='w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-[#78D14D] hover:border-[#78D14D] transition'>
                <Share size={24} />
              </button>
            </section>
          )}

          {/* Gambar Artikel */}
          <section className='mb-12 flex justify-center'>
            <div className='w-full h-[29rem] overflow-hidden rounded-xl shadow-lg'>
              <Image
                src={`${baseURL}/articles/${article.gambar_artikel}`}
                alt={article.judul_artikel}
                width={1000}
                height={464}
                className='w-full h-full object-cover'
                priority
              />
            </div>
          </section>

          {/* Isi Artikel */}
          <section className='mb-12 text-lg leading-8'>
            <div
              className='prose max-w-none break-words overflow-wrap-anywhere [&>*]:max-w-full [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_table]:overflow-x-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:break-all'
              dangerouslySetInnerHTML={{ __html: article.isi_artikel }}
            />
          </section>

          {/* Comment Section - Hidden for Draft or Verification Issues */}
          {!shouldHideActionsAndComments && (
            <section className='w-full flex flex-col gap-[3.1rem] justify-start items-start'>
              <div className='w-full h-[15rem] bg-[#F2F2F2] rounded-lg px-[3.3rem] py-[2.25rem] flex flex-col'>
                <textarea
                  placeholder='Tulis Komentar........'
                  className='w-full outline-none text-gray-800 placeholder-gray-500 resize-none h-[60%] bg-transparent'
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={isCommenting}
                ></textarea>
                <div className='flex flex-row justify-end items-center h-[20%] w-full'>
                  <PrimaryButton
                    textColor='#ffffff'
                    onClickHandler={handleCommentSubmit}
                    disabled={isCommenting || !commentContent.trim()}
                  >
                    {isCommenting ? 'Mengirim...' : 'Kirim Komentar'}
                  </PrimaryButton>
                </div>
              </div>
              <div className='bg-black h-[0.06rem] w-full'></div>
              <div className='flex flex-col justify-start items-start gap-[2.5rem] w-full'>
                <div className='flex flex-row justify-start items-start gap-[1.7rem]'>
                  <p className='font-semibold text-[2rem]'>Komentar</p>
                  <div className='w-[5rem] h-[3rem] flex flex-col justify-center items-center text-white bg-[#78D14D] rounded-full'>
                    <p className='text-[1.25rem]'>
                      {article.komentar_artikel?.length || 0}
                    </p>
                  </div>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-[3.75rem]'>
                  {article.komentar_artikel?.length > 0 ? (
                    article.komentar_artikel.map((comment: any) => (
                      <div
                        key={comment.id_komentar}
                        className='flex flex-row justify-start items-start gap-[2rem]'
                      >
                        <div className='object-cover size-[4rem] overflow-clip rounded-full flex-shrink-0'>
                          {comment.pengguna?.avatar ? (
                            <Image
                              src={`${baseURL}/users/${comment.pengguna.avatar}`}
                              width={89}
                              height={89}
                              alt={comment.pengguna.nama_depan_pengguna}
                              className='object-cover w-full h-full'
                            />
                          ) : (
                            <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                              <span className='text-lg font-semibold'>
                                {comment.pengguna?.nama_depan_pengguna?.charAt(
                                  0,
                                )}
                                {comment.pengguna?.nama_belakang_pengguna?.charAt(
                                  0,
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
                          <div className='flex flex-row justify-start items-start gap-[1.1rem]'>
                            <p className='font-semibold'>
                              {comment.pengguna?.nama_depan_pengguna}{' '}
                              {comment.pengguna?.nama_belakang_pengguna}
                            </p>
                            <p>{formatDate(comment.tanggal_komentar)}</p>
                          </div>
                          <p>{comment.komentar}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500'>Belum ada komentar</p>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative'>
            <h2 className='text-lg font-semibold mb-4 text-gray-900'>
              Konfirmasi
            </h2>
            <p className='mb-6 text-gray-700'>
              {confirmAction === 'delete'
                ? 'Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.'
                : `Apakah Anda yakin ingin ${
                    article.status_artikel === 'PUBLISHED'
                      ? 'mengarsipkan artikel'
                      : 'mempublikasikan artikel'
                  }?`}
            </p>
            <div className='flex justify-end gap-3'>
              <button
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer'
                onClick={handleCancelDialog}
                disabled={isProcessing}
              >
                Batal
              </button>
              <button
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${
                  confirmAction === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={handleConfirmAction}
                disabled={isProcessing}
              >
                {isProcessing ? 'Memproses...' : 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserArticleDetailMain;
