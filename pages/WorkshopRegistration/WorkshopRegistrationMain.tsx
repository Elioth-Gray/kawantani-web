'use client';

import React from 'react';
import {
  CaretRight,
  Calendar,
  Timer,
  MapPin,
  ArrowLeft,
} from '@phosphor-icons/react/dist/ssr';
import InputField from '@/components/form/InputField';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ActionButton from '@/components/buttons/ActionButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { getWorkshopById, registerWorkshop } from '@/api/workshopApi';

const WorkshopRegistrationMain = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genderSelected, setGenderSelected] = useState<number>();
  const [paymentSelected, setPaymentSelected] = useState<number>();
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const params = useParams();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 0,
    paymentMethod: 0,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'WIB' : 'WIB';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await getWorkshopById(params?.id as string);
        if (response.data) {
          setWorkshop(response.data);
        } else {
          setError(response.message || 'Gagal memuat detail workshop');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [params?.id]);

  const setGender = (newGender: number) => {
    setGenderSelected(newGender);
    setFormData((prev) => ({ ...prev, gender: newGender }));
  };

  const setPayment = (newPayment: number) => {
    setPaymentSelected(newPayment);
    setFormData((prev) => ({ ...prev, paymentMethod: newPayment }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const errors = [];

      if (!formData.firstName.trim()) errors.push('Nama Depan');
      if (!formData.lastName.trim()) errors.push('Nama Belakang');
      if (!formData.email.trim()) errors.push('Email');
      if (!formData.phoneNumber.trim()) errors.push('Nomor Telepon');

      if (formData.gender === 0 || !formData.gender) {
        errors.push('Jenis Kelamin');
      }

      if (formData.paymentMethod === 0 || !formData.paymentMethod) {
        errors.push('Metode Pembayaran');
      }

      if (errors.length > 0) {
        alert(`Harap isi field berikut: ${errors.join(', ')}`);
        return;
      }

      if (!/^[0-9]{10,15}$/.test(formData.phoneNumber)) {
        alert('Nomor telepon harus berupa angka (10-15 digit)');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        alert('Format email tidak valid');
        return;
      }

      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        paymentMethod: formData.paymentMethod,
      };
      setLoading(true);

      const response = await registerWorkshop(
        params?.id as string,
        registrationData,
      );

      if (response && response.data) {
        setRegistrationResult(response.data);
        setCurrentIndex(2);
      } else {
        alert(response.message || 'Gagal mendaftar workshop');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodName = (methodId: number) => {
    switch (methodId) {
      case 1:
        return 'Gopay';
      case 2:
        return 'DANA';
      case 3:
        return 'OVO';
      case 4:
        return 'QRIS';
      default:
        return 'Unknown';
    }
  };

  const navigate = (e: any) => {
    e.preventDefault();

    const registrationTicketData = {
      ticketNumber:
        registrationResult?.ticketNumber || registrationResult?.id || 'N/A',

      // User form data
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      paymentMethod: formData.paymentMethod,

      paymentStatus: 'Berhasil',
    };

    localStorage.setItem(
      'workshopTicket',
      JSON.stringify(registrationTicketData),
    );
    router.push(`${pathname}/success`);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Memuat detail workshop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Workshop tidak ditemukan</p>
      </div>
    );
  }

  const nextIndex = (e: any) => {
    e.preventDefault();
    if (currentIndex < 2) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevIndex = (e: any) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <main className='px-[8.1rem] py-[5.3rem]'>
      <section className='w-full'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointers'
          onClick={() => {
            router.back();
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
      {/* Step Sections */}
      <section>
        <div className='w-full flex flex-row justify-center items-center gap-[2.3rem]'>
          <div className='flex flex-row justify-start items-center gap-[1.3rem]'>
            <div
              className={`rounded-full border-[0.2rem] ${
                currentIndex == 0
                  ? 'bg-[#78D14D] text-white'
                  : 'bg-white text-black'
              } border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center`}
            >
              <p className='font-semibold text-[0.8rem]'>1</p>
            </div>
            <p className='font-semibold text-[0.8rem]'>Pengisian Detail</p>
          </div>
          <CaretRight size={26} color='#000000' />
          <div className='flex flex-row justify-start items-center gap-[1.3rem]'>
            <div
              className={`rounded-full border-[0.2rem] ${
                currentIndex == 1
                  ? 'bg-[#78D14D] text-white'
                  : 'bg-white text-black'
              } border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center`}
            >
              <p className='font-semibold text-[0.8rem]'>2</p>
            </div>
            <p className='font-semibold text-[0.8rem]'>Pembayaran</p>
          </div>
          <CaretRight size={26} color='#000000' />
          <div className='flex flex-row justify-start items-center gap-[1.3rem]'>
            <div
              className={`rounded-full border-[0.2rem] ${
                currentIndex == 2
                  ? 'bg-[#78D14D] text-white'
                  : 'bg-white text-black'
              } border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center`}
            >
              <p className='font-semibold text-[0.8rem]'>3</p>
            </div>
            <p className='font-semibold text-[0.8rem]'>Konfirmasi</p>
          </div>
        </div>
      </section>
      {/* Form Section */}
      <section className='mt-[5.3rem]'>
        <div className='w-full grid grid-cols-2'>
          <div className='col-span-1 flex flex-col justify-start items-start gap-[1.3rem]'>
            <form
              action=''
              className='flex flex-col justify-start items-start gap-[1.7rem] w-full'
            >
              {currentIndex === 0 ? (
                <>
                  <div className='flex flex-col justify-start items-start gap-[0.3rem]'>
                    <h1 className='text-[1.5rem] font-semibold'>
                      Detail Pendaftaran
                    </h1>
                    <p className='text-[0.8rem] w-[80%]'>
                      Detail kontak ini akan digunakan untuk pengisian data diri
                      dan pengiriman e-tiket workshop
                    </p>
                  </div>
                  <div className='flex flex-col justify-start items-start gap-[0.1rem] w-[60%]'>
                    <p className='text-[0.8rem]'>Nama Depan*</p>
                    <InputField
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex flex-col justify-start items-start w-[60%] gap-[0.1rem]'>
                    <p className='text-[0.8rem]'>Nama Belakang*</p>
                    <InputField
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex flex-col justify-start items-start w-[60%] gap-[0.1rem]'>
                    <p className='text-[0.8rem]'>Email*</p>
                    <InputField
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex flex-col justify-start items-start w-[60%] gap-[0.1rem]'>
                    <p className='text-[0.8rem]'>Nomor Telepon*</p>
                    <InputField
                      type='tel'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex flex-col justify-start items-start w-[60%] gap-[0.1rem]'>
                    <p className='text-[0.8rem]'>Jenis Kelamin*</p>
                    <div className='flex flex-row w-full justify-between items-center gap-[1.8rem]'>
                      <button
                        className={`py-[1.125rem]  w-full rounded-lg text-[1rem]  font-semibold cursor-pointer ${
                          genderSelected == 1
                            ? 'bg-[#78D14D] text-white'
                            : 'bg-[#F2F2F2] text-[#4993FA]'
                        }`}
                        type='button'
                        onClick={() => setGender(1)}
                      >
                        Laki-Laki
                      </button>
                      <button
                        className={`py-[1.125rem]  w-full rounded-lg text-[1rem]  font-semibold cursor-pointer ${
                          genderSelected == 2
                            ? 'bg-[#78D14D] text-white'
                            : 'bg-[#F2F2F2] text-[#FF7C7C]'
                        }`}
                        type='button'
                        onClick={() => setGender(2)}
                      >
                        Perempuan
                      </button>
                    </div>
                  </div>
                  <ActionButton
                    textColor='#ffffff'
                    onClickHandler={nextIndex}
                    width='16.25rem'
                    height='3.5rem'
                  >
                    Lanjutkan
                  </ActionButton>
                </>
              ) : currentIndex === 1 ? (
                <>
                  <div className='flex flex-col justify-start items-start gap-[0.3rem]'>
                    <h1 className='text-[1.5rem] font-semibold'>
                      Pilih Metode Pembayaran
                    </h1>
                    <p className='text-[0.8rem] w-[80%]'>
                      Pilih metode untuk melakukan pembayaran workshop
                    </p>
                  </div>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 1
                        ? ' bg-[#78D14D] text-white'
                        : 'bg-[#F2F2F2] text-black'
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type='button'
                    onClick={() => setPayment(1)}
                  >
                    <Image
                      className=' object-cover rounded-lg'
                      width={142}
                      height={54}
                      src={`http://localhost:2000/uploads/paymentmethod/gopay.png`}
                      alt='payment-method'
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. {workshop.harga_workshop}</p>
                  </button>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 2
                        ? ' bg-[#78D14D] text-white'
                        : 'bg-[#F2F2F2] text-black'
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type='button'
                    onClick={() => setPayment(2)}
                  >
                    <Image
                      className=' object-cover rounded-lg'
                      width={122.74}
                      height={35}
                      src={`http://localhost:2000/uploads/paymentmethod/dana.png`}
                      alt='payment-method'
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. {workshop.harga_workshop}</p>
                  </button>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 3
                        ? ' bg-[#78D14D] text-white'
                        : 'bg-[#F2F2F2] text-black'
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type='button'
                    onClick={() => setPayment(3)}
                  >
                    <Image
                      className=' object-cover rounded-lg'
                      width={82}
                      height={26}
                      src={`http://localhost:2000/uploads/paymentmethod/ovo.png`}
                      alt='ovo'
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. {workshop.harga_workshop}</p>
                  </button>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 4
                        ? ' bg-[#78D14D] text-white'
                        : 'bg-[#F2F2F2] text-black'
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type='button'
                    onClick={() => setPayment(4)}
                  >
                    <Image
                      className=' object-cover rounded-lg'
                      width={109.77}
                      height={41}
                      src={`http://localhost:2000/uploads/paymentmethod/qris.png`}
                      alt='payment-method'
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. {workshop.harga_workshop}</p>
                  </button>
                  <div className='w-full flex flex-col justify-start items-start gap-[1rem]'>
                    <ActionButton
                      textColor='#ffffff'
                      onClickHandler={handleRegister}
                      width='16.25rem'
                      height='3.5rem'
                    >
                      Lanjutkan
                    </ActionButton>
                    <SecondaryButton
                      onClickHandler={prevIndex}
                      width='16.25rem'
                      height='3.5rem'
                      hover={false}
                    >
                      Kembali
                    </SecondaryButton>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex flex-col justify-start items-start gap-[0.3rem] w-full'>
                    <h1 className='text-[1.5rem] font-semibold'>
                      Konfirmasi Pendaftaran
                    </h1>
                    <p className='text-[0.8rem] w-[80%]'>
                      Konfirmasi pendaftaran untuk workshop ini
                    </p>
                  </div>
                  <div className='flex flex-col justify-start items-start gap-[0.3rem] w-[60%]'>
                    <h1 className='text-[1.25rem] font-semibold'>
                      Informasi Peserta:
                    </h1>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Nama Peserta</p>
                      <p>
                        : {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Email</p>
                      <p>: {formData.email}</p>
                    </div>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Nomor Telepon</p>
                      <p>: {formData.phoneNumber}</p>
                    </div>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Jenis Kelamin</p>
                      <p>
                        : {formData.gender === 0 ? 'Laki-Laki' : 'Perempuan'}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col justify-start items-start gap-[0.3rem] w-[60%]'>
                    <h1 className='text-[1.25rem] font-semibold'>
                      Informasi Pembayaran:
                    </h1>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Metode Pembayaran</p>
                      <p>: {getPaymentMethodName(formData.paymentMethod)}</p>
                    </div>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Total Harga</p>
                      <p>: Rp. {workshop.harga_workshop}</p>
                    </div>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <p>Status Pembayaran</p>
                      <p>: Berhasil</p>
                    </div>
                  </div>
                  <div className='w-full flex flex-col justify-start items-start gap-[1rem]'>
                    <ActionButton
                      textColor='#ffffff'
                      onClickHandler={navigate}
                      width='16.25rem'
                      height='3.5rem'
                    >
                      Lanjutkan
                    </ActionButton>
                    <SecondaryButton
                      onClickHandler={prevIndex}
                      width='16.25rem'
                      height='3.5rem'
                      hover={false}
                    >
                      Kembali
                    </SecondaryButton>
                  </div>
                </>
              )}
            </form>
          </div>
          <div className='col-span-1 flex flex-row justify-end items-start w-full'>
            <div className='w-[80%] flex flex-col justify-start items-start gap-[2.25rem]'>
              <Image
                className=' object-cover w-full h-[16.8rem] rounded-lg'
                width={545}
                height={307}
                src={`http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`}
                alt='gambar-workshop'
                quality={100}
                unoptimized
              ></Image>
              <h1 className='text-[1.5rem] font-semibold w-[70%]'>
                {workshop.judul_workshop}
              </h1>
              <div className='flex flex-col justify-start items-start gap-[0.9rem]'>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Calendar size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {formatDate(workshop.tanggal_workshop)}
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <MapPin size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {workshop.alaamt_lengkap_workshop},{' '}
                    {workshop.kabupaten.nama_kabupaten},{' '}
                    {workshop.kabupaten.provinsi.nama_provinsi}
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Timer size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {formatTime(workshop.waktu_mulai)} -{' '}
                    {formatTime(workshop.waktu_berakhir)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WorkshopRegistrationMain;
