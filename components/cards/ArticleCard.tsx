import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

// Enum definitions
enum StatusArtikel {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

enum StatusVerifikasiArtikel {
  MENUNGGU = 'MENUNGGU',
  DIVERIFIKASI = 'DIVERIFIKASI',
  DITOLAK = 'DITOLAK',
}

const ArticleCard = ({
  imageURL,
  date,
  title,
  href = '',
  status = '',
  verification = '',
  linkLabel = 'Baca lebih lanjut',
}: {
  imageURL: string;
  date: string;
  title: string;
  href?: string;
  status?: StatusArtikel | string;
  linkLabel?: string;
  verification?: StatusVerifikasiArtikel | string;
}) => {
  // Function to get status styling
  const getStatusStyle = (status: StatusArtikel | string) => {
    switch (status) {
      case StatusArtikel.DRAFT:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
      case StatusArtikel.PUBLISHED:
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  // Function to get verification status styling
  const getVerificationStyle = (
    verification: StatusVerifikasiArtikel | string,
  ) => {
    switch (verification) {
      case StatusVerifikasiArtikel.MENUNGGU:
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case StatusVerifikasiArtikel.DIVERIFIKASI:
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case StatusVerifikasiArtikel.DITOLAK:
        return 'bg-red-100 text-red-700 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  // Function to get status text
  const getStatusText = (status: StatusArtikel | string) => {
    switch (status) {
      case StatusArtikel.DRAFT:
        return 'DRAFT';
      case StatusArtikel.PUBLISHED:
        return 'DITERBITKAN';
      default:
        return typeof status === 'string' ? status.toUpperCase() : status;
    }
  };

  // Function to get verification text
  const getVerificationText = (
    verification: StatusVerifikasiArtikel | string,
  ) => {
    switch (verification) {
      case StatusVerifikasiArtikel.MENUNGGU:
        return 'MENUNGGU VERIFIKASI';
      case StatusVerifikasiArtikel.DIVERIFIKASI:
        return 'TERVERIFIKASI';
      case StatusVerifikasiArtikel.DITOLAK:
        return 'DITOLAK';
      default:
        return typeof verification === 'string'
          ? verification.toUpperCase()
          : verification;
    }
  };

  return (
    <div className='col-span-1 h-fit bg-[#FCF7F1] py-[1rem] px-[1.25rem] rounded-xl overflow-hidden'>
      <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
        <div className='w-full h-40 relative overflow-hidden rounded-xl object-cover'>
          <Image
            src={imageURL}
            alt={title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 200px'
          />
        </div>
        <div className='flex flex-col justify-start items-start w-full gap-[0.1rem]'>
          <p className='text-[0.75rem] font-light'>{date}</p>
          <p className='font-semibold text-[0.9rem]'>{title}</p>

          {/* Status and Verification Container */}
          <div className='flex flex-wrap gap-2 mt-2'>
            {/* Article Status */}
            {status && (
              <span
                className={`px-2 py-1 rounded-full text-[0.7rem] font-medium ${getStatusStyle(
                  status,
                )}`}
              >
                {getStatusText(status)}
              </span>
            )}

            {/* Verification Status */}
            {verification && (
              <span
                className={`px-2 py-1 rounded-full text-[0.7rem] font-medium ${getVerificationStyle(
                  verification,
                )}`}
              >
                {getVerificationText(verification)}
              </span>
            )}
          </div>

          <div className='w-full bg-black h-[0.06rem] mt-[0.3rem]'></div>
        </div>
        <div className='w-full flex flex-row justify-between items-center'>
          <Link href={href} className='text-[0.75rem] underline'>
            {linkLabel}
          </Link>
          <ArrowRight size={17} />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
