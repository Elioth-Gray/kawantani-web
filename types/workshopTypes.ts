export type TCreateWorkshopRequest = {
  title: string;
  date: string;
  address: string;
  description: string;
  price: string;
  capacity: string;
  lat: string;
  long: string;
  image: File;
  regency: string;
};

export type TWorkshopVerificationRequest = {
  id: string;
};

export type TWorkshopResponse = {
  success: boolean;
  message: string;
  data:
    | {
        id_workshop: string;
        judul_workshop: string;
        tanggal_workshop: string;
        status_verifikasi: boolean;
        status_aktif: boolean;
        gambar_workshop: string;
        facilitator: {
          nama_facilitator: string;
        };
      }[]
    | null;
};

export type TVerifiedWorkshopResponse = {
  success: boolean;
  message: string;
  data:
    | {
        id_workshop: string;
        judul_workshop: string;
        tanggal_workshop: string;
        status_verifikasi: boolean;
        status_aktif: boolean;
        gambar_workshop: string;
        alaamt_lengkap_workshop: string;
        harga_workshop: string;
        waktu_berakhir: string;
        waktu_mulai: string;
        facilitator: {
          nama_facilitator: string;
        };
        kabupaten: {
          nama_kabupaten: string;
          provinsi: {
            nama_provinsi: string;
          };
        };
      }[]
    | null;
};

export type TWorkshopDetailResponse = {
  success: boolean;
  message: string;
  data: {
    id_workshop: string;
    judul_workshop: string;
    tanggal_workshop: string;
    alaamt_lengkap_workshop: string;
    deskripsi_workshop: string;
    harga_workshop: string;
    kapasitas: number;
    lat_lokasi: number;
    long_lokasi: number;
    gambar_workshop: string;
    id_kabupaten: number;
    status_verifikasi: boolean;
    status_aktif: boolean;
    facilitator: {
      id: string;
      nama_facilitator: string;
      email_facilitator: string;
      foto_facilitator: string;
      deskripsi_facilitator: string;
    };
  } | null;
};

export type TWorkshopFormValues = {
  title: string;
  date: string;
  address: string;
  description: string;
  price: string;
  capacity: string;
  lat: string;
  long: string;
  image: File | null;
  regency: string;
};

export type TRegisterWorkshopRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: number;
  paymentMethod: number;
};

export type TRegisterWorkshopResponse = {
  success: boolean;
  message: string;
  data: {
    id_pendaftaran: string;
    nomor_tiket: string;
    nama_depan_peserta: string;
    nama_belakang_peserta: string;
    email_peserta: string;
    nomor_telepon_peserta: string;
    jenis_kelamin_peserta: number;
    tanggal_pendaftaran: Date;
    status_pembayaran: boolean;
    id_workshop: string;
    id_metode_pembayaran: number;
  } | null;
};

export type TPayWorkshopRequest = {
  ticketNumber: string;
};

export type TPayWorkshopResponse = {
  success: boolean;
  message: string;
  data: {
    id_pendaftaran: string;
    nomor_tiket: string;
    status_pembayaran: boolean;
  } | null;
};
