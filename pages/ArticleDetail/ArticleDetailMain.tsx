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
} from '@/api/articleApi';
import Image from 'next/image';
import {
  Bookmark,
  Star,
  Share,
  ArrowLeft,
} from '@phosphor-icons/react/dist/ssr';
import { useRouter, usePathname } from 'next/navigation';

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

const ArticleDetailMain = () => {
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

  const checkSavedStatus = async (articleId: string) => {
    try {
      const response = await getSavedArticles();
      if (response && response.data) {
        const isArticleSaved = response.data.some(
          (savedArticle: any) => savedArticle.id_artikel === articleId,
        );
        setIsSaved(isArticleSaved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const checkLikeStatus = async (articleId: string) => {
    try {
      const response = await getArticleById(articleId);
      console.log(response);
      if (response && response.data) {
        const liked = response.data.artikel_disukai?.some(
          (like: any) =>
            like.id_pengguna === response.data.pengguna?.id_pengguna,
        );
        setIsLiked(liked || false);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  useEffect(() => {
    if (article) {
      checkSavedStatus(article.id_artikel);
      checkLikeStatus(article.id_artikel);
    }
  }, [article]);

  const toggleSave = async () => {
    if (!article || isSaving) return;

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
          response.message ||
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
    if (!article || isLiking) return;

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
          response.message ||
            (previousState ? 'Gagal menghapus like' : 'Gagal memberikan like'),
        );
      } else {
        setMessage(previousState ? 'Like dihapus' : 'Artikel disukai');
        const updatedArticle = await getArticleById(article.id_artikel);
        setArticle(updatedArticle.data);
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
    if (!article || !commentContent.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const response = await addComment({
        id: article.id_artikel,
        content: commentContent,
      });

      // Perbaikan: Periksa response dengan lebih teliti
      if (response && response.data) {
        setMessage(response.message || 'Komentar berhasil ditambahkan');
        setCommentContent('');

        console.log('Response data:', response.data);

        const newComment = {
          id_komentar: response.data.id_komentar,
          id_artikel: response.data.id_artikel,
          id_pengguna: response.data.id_pengguna,
          komentar: response.data.komentar,
          tanggal_komentar: response.data.tanggal_komentar,
          pengguna: {
            id_pengguna: response.data.pengguna?.id_pengguna,
            nama_depan_pengguna: response.data.pengguna?.nama_depan_pengguna,
            nama_belakang_pengguna:
              response.data.pengguna?.nama_belakang_pengguna,
            avatar: response.data.pengguna?.avatar,
          },
        };

        console.log(newComment);

        // Perbaikan: Pastikan komentar_artikel adalah array
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
        // Perbaikan: Handle ketika response tidak sesuai ekspektasi
        setMessage(response?.message || 'Gagal menambahkan komentar');
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      // Perbaikan: Lebih detail dalam error handling
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
      // Perbaikan: Hapus pesan setelah beberapa detik
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

  useEffect(() => {
    const fetchArticle = async () => {
      const segments = pathname && pathname.split('/');
      const articleId = segments && segments[2];

      try {
        const response = await getArticleById(articleId || '');

        if (response && response.data) {
          setArticle(response.data);
          await checkSavedStatus(articleId || '');
          await checkLikeStatus(articleId || '');
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

  if (isLoading)
    return <div className='text-center py-8'>Memuat artikel...</div>;
  if (!article)
    return <div className='text-center py-8'>Artikel tidak ditemukan.</div>;

  return (
    <main className='py-[6.4rem] px-[14rem]'>
      {/* Message display */}
      {message && (
        <div className='fixed top-4 right-4 z-40 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg'>
          {message}
        </div>
      )}

      {/* Tombol Kembali */}
      <section className='w-full'>
        <div
          className='flex flex-row items-center gap-4 mb-8 cursor-pointer hover:text-[#78D14D] transition'
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} weight='bold' />
          <p>Kembali</p>
        </div>
      </section>

      {/* Header */}
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
        <PrimaryButton textColor='#ffffff'>
          {article.kategori?.nama_kategori_artikel || 'Tanpa Kategori'}
        </PrimaryButton>
      </section>

      {/* Tombol Aksi */}
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

      {/* Comment Section */}
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
                {Array.isArray(article.komentar_artikel)
                  ? article.komentar_artikel.length
                  : 0}
              </p>
            </div>
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-[3.75rem]'>
            {Array.isArray(article.komentar_artikel) &&
            article.komentar_artikel.length > 0 ? (
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
                        alt={comment.pengguna.nama_depan_pengguna || 'User'}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                        <span className='text-lg font-semibold'>
                          {comment.pengguna?.nama_depan_pengguna?.charAt(0) ||
                            ''}
                          {comment.pengguna?.nama_belakang_pengguna?.charAt(
                            0,
                          ) || ''}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
                    <div className='flex flex-row justify-start items-start gap-[1.1rem]'>
                      <p className='font-semibold'>
                        {comment.pengguna?.nama_depan_pengguna || ''}{' '}
                        {comment.pengguna?.nama_belakang_pengguna || ''}
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
    </main>
  );
};

export default ArticleDetailMain;
