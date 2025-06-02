export type TArticle = {
  id_artikel: string;
  judul_artikel: string;
  deskripsi_artikel?: string;
  isi_artikel?: string;
  gambar_artikel?: string;
  status_artikel: 'DRAFT' | 'PUBLISHED';
  status_verifikasi?: boolean;
  status_aktif: boolean;
  tanggal_artikel: string;
  id_kategori_artikel?: number;
  id_pengguna?: string;
  kategori?: {
    nama_kategori_artikel: string;
  };
  pengguna?: {
    nama_depan_pengguna: string;
    nama_belakang_pengguna: string;
  };
  komentar_artikel?: TComment[];
  artikel_disukai?: TLike[];
};

export type TComment = {
  id_komentar: string;
  id_artikel: string;
  id_pengguna: string;
  komentar: string;
  tanggal_komentar: string;
  pengguna?: {
    nama_depan_pengguna: string;
    nama_belakang_pengguna: string;
  };
};

export type TLike = {
  id_artikel_disukai: string;
  id_artikel: string;
  id_pengguna: string;
  rating: number;
};

export type TCreateArticle = {
  title: string;
  description: string;
  content: string;
  image: File | string;
  category: string;
  articleStatus: 'DRAFT' | 'PUBLISHED';
};

export type TUpdateArticle = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: File | string;
  articleStatus: 'DRAFT' | 'PUBLISHED';
};

export type TCommentArticle = {
  id: string;
  content: string;
};

export type TSaveArticle = {
  id: string;
};

export type TUnsaveArticle = {
  id: string;
};

export type TLikeArticle = {
  id: string;
  rating: number;
};

export type TUnlikeArticle = {
  id: string;
  rating: number;
};