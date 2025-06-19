'use client';

import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User } from '@phosphor-icons/react/dist/ssr';
import { useState, useEffect } from 'react';
import { getAdminProfile } from '@/api/authApi';

interface AdminData {
  nama_depan_admin: string;
  nama_belakang_admin: string;
  email_admin: string;
  avatar: string;
}

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL_FILE || 'http://localhost:2000/uploads';

const AdminProfileMain = () => {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminData | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      setInitialLoading(true);
      try {
        const response = await getAdminProfile();

        if (response?.success) {
          setAdmin(response.data.admin);
        } else {
          console.error('Failed to load admin:', response.message);
        }
      } catch (error) {
        console.error('Error loading admin:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (initialLoading) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p>Memuat data admin...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-red-400 mb-4'>Admin tidak ditemukan</p>
            <button
              onClick={() => router.back()}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} color='#fff' weight='bold' />
          <p>Kembali</p>
        </div>

        <div className='w-full mb-[3.1rem]'>
          <h1 className='text-[2.25rem] font-semibold'>Profil Admin</h1>
          <p>Informasi profil Anda</p>
        </div>

        <div className='w-full'>
          {/* Avatar Section */}
          <div className='flex flex-col justify-center items-center w-full mb-10'>
            <div className='flex flex-col justify-start items-center gap-3 mb-4'>
              {admin.avatar ? (
                <img
                  src={`${baseURL}/admin/${admin.avatar}`}
                  alt='Avatar Admin'
                  className='w-32 h-32 rounded-full object-cover border-2 border-white'
                />
              ) : (
                <div className='w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center border-2 border-white'>
                  <User size={48} color='#fff' />
                </div>
              )}
              <p>Foto Profil</p>
            </div>
          </div>

          {/* Profile Information using shadcn components */}
          <div className='flex flex-col gap-[2.1rem] w-full'>
            <div className='flex flex-row gap-[3.5rem]'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Nama Depan</Label>
                <Input
                  value={admin.nama_depan_admin || ''}
                  className='w-[19rem] h-[2.5rem]'
                  readOnly
                />
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Nama Belakang</Label>
                <Input
                  value={admin.nama_belakang_admin || ''}
                  className='w-[19rem] h-[2.5rem]'
                  readOnly
                />
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Email</Label>
                <Input
                  value={admin.email_admin || ''}
                  className='w-[19rem] h-[2.5rem]'
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminProfileMain;
