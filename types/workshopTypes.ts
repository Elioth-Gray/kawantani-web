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
