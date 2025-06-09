export type TPlant = {
  id_tanaman: string;
  nama_tanaman: string;
  deskripsi_tanaman?: string;
  gambar_tanaman?: string;
  durasi_penanaman: number;
  tingkat_kesulitan: string;
  kebutuhan_sinar_matahari: string;
  kebutuhan_air: string;
  id_kategori_tanaman: number;
  kategori?: TCategory;
  instruksi_tanaman?: TPlantInstruction[];
  hari_penanaman?: TPlantDay[];
};

export type TCategory = {
  id_kategori_tanaman: number;
  nama_kategori_tanaman: string;
};

export type TPlantInstruction = {
  id_instruksi: string;
  urutan: number;
  deskripsi: string;
  gambar_instruksi?: string;
  id_tanaman: string;
};

export type TPlantDay = {
  id_hari_penanaman: string;
  hari_ke: number;
  nama_fase: string;
  id_tanaman: string;
  tugas_penanaman: TPlantTask[];
};

export type TPlantTask = {
  id_tugas: string;
  nama_tugas: string;
  jenis_tugas: string;
  estimasi_waktu: number;
  id_hari_penanaman: string;
};

export type TUserPlant = {
  id_tanaman_pengguna: string;
  nama_custom: string;
  tanggal_penanaman: Date;
  tanggal_target_panen: Date;
  status_penanaman: "BELUM_DIMULAI" | "SEDANG_BERJALAN" | "SELESAI";
  progress_persen: number;
  id_tanaman: string;
  id_pengguna: string;
  tanaman?: TPlant;
  hari_tanaman?: TUserPlantDay[];
};

export type TUserPlantDay = {
  id_hari_tanaman_pengguna: string;
  hari_ke: number;
  tanggal_aktual: Date;
  fase_penanaman: string;
  total_tugas: number;
  tugas_selesai: number;
  progress_hari_persen: number;
  status_hari: "BELUM_DIMULAI" | "SEDANG_BERJALAN" | "SELESAI";
  id_tanaman_pengguna: string;
  tugas_penanaman: TUserPlantTask[];
};

export type TUserPlantTask = {
  id_tugas_penanaman_pengguna: number;
  nama_tugas: string;
  jenis_tugas: string;
  estimasi_waktu: number;
  status_selesai: boolean;
  tanggal_selesai: Date | null;
  id_hari_tanaman_pengguna: string;
};

export type TCreateUserPlant = {
  plantId: string;
  customName: string;
};

export type TUpdateTaskProgress = {
  userPlantId: string;
  taskId: number;
  doneStatus: boolean;
};
