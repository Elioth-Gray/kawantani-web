'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { FacebookLogo } from '@phosphor-icons/react/dist/ssr';
import { XLogo } from '@phosphor-icons/react/dist/ssr';
import { LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import { InstagramLogo } from '@phosphor-icons/react/dist/ssr';
import { Envelope } from '@phosphor-icons/react/dist/ssr';
import { Phone, Copyright } from '@phosphor-icons/react/dist/ssr';
import { useState, useEffect } from 'react';
import { getAllArticles } from '@/api/articleApi';
import { TArticle } from '@/types/articleTypes';

const Footer = () => {
  const [latestArticles, setLatestArticles] = useState<TArticle[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await getAllArticles();
        if (response.data) {
          // Sort articles by date (newest first) and take the first 3
          const sortedArticles = [...response.data].sort(
            (a, b) =>
              new Date(b.tanggal_artikel).getTime() -
              new Date(a.tanggal_artikel).getTime(),
          );
          setLatestArticles(sortedArticles.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  const formatTitle = (title: string) => {
    if (title.length > 30) {
      return `${title.substring(0, 30)}...`;
    }
    return title;
  };

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <footer>
      <section className='footer-image w-full h-[31.8rem] text-white'>
        {/* Footer Container */}
        <div className='w-full h-full backdrop-blur-[0.7rem] flex flex-col justify-center items-center gap-[3.25rem] px-[6.9rem]'>
          {/* Upper Footer */}
          <div className='flex flex-row justify-between items-start gap-[7.5rem]'>
            <div className='flex flex-col justify-center items-start gap-[1.25rem]'>
              <Image
                src='/images/logo.webp'
                width={181}
                height={58}
                alt='logo'
              ></Image>
              <p className='text-[0.8rem] font-bold'>
                Pertanian Lebih Mudah dengan{' '}
                <span className='text-[#50B34B]'>KawanTani</span>{' '}
              </p>
              <div className=' flex flex-row justify-center items-center w-full gap-[1rem]'>
                <input
                  className='px-[1.25rem] py-[1rem] border border-white rounded-lg w-full'
                  placeholder='Email'
                ></input>
                <button className='px-[1.25rem] py-[1rem] bg-white rounded-md'>
                  <ArrowRight size={26} color='#00000'></ArrowRight>
                </button>
              </div>
              <div className='flex flex-row gap-[1.03rem]'>
                <FacebookLogo size={32} color='#fcfcfc' weight='bold' />
                <XLogo size={32} color='#fcfcfc' weight='bold' />
                <LinkedinLogo size={32} color='#fcfcfc' weight='bold' />
                <InstagramLogo size={32} color='#fcfcfc' weight='bold' />
              </div>
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.8rem]'>
              <h1 className='text-[1.25rem] font-semibold'>Navigasi</h1>
              <ul className='flex flex-col justify-start items-start gap-[1.25rem] '>
                <li>
                  <Link href='/' className='text-[1rem] hover:text-[#50B34B]'>
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href='/#about'
                    className='text-[1rem] hover:text-[#50B34B]'
                  >
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link
                    href='/plants'
                    className='text-[1rem] hover:text-[#50B34B]'
                  >
                    Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    href='/articles'
                    className='text-[1rem] hover:text-[#50B34B]'
                  >
                    Artikel
                  </Link>
                </li>
                <li>
                  <Link
                    href='/workshops'
                    className='text-[1rem] hover:text-[#50B34B]'
                  >
                    Workshop
                  </Link>
                </li>
              </ul>
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.8rem]'>
              <h1 className='text-[1.25rem] font-semibold'>Artikel Terbaru</h1>
              {isLoading ? (
                <p className='text-sm'>Memuat artikel...</p>
              ) : latestArticles.length === 0 ? (
                <p className='text-sm'>Tidak ada artikel</p>
              ) : (
                <div className='flex flex-col justify-start items-start gap-[1.25rem]'>
                  {latestArticles.map((article) => (
                    <Link
                      key={article.id_artikel}
                      href={`/articles/${article.id_artikel}/details`}
                      className='hover:text-[#50B34B]'
                    >
                      <div className='flex flex-row justify-start items-start gap-[0.625rem]'>
                        <div className='w-[1.8rem] h-[1.8rem] overflow-clip rounded-md'>
                          <Image
                            src={`${baseURL}/articles/${article.gambar_artikel}`}
                            width={30}
                            height={30}
                            alt='article'
                            className='object-cover w-full h-full'
                          />
                        </div>
                        <p>{formatTitle(article.judul_artikel)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.8rem]'>
              <h1 className='text-[1.25rem] font-semibold'>Hubungi Kami</h1>
              <div className='flex flex-col justify-start items-start gap-[1.25rem] '>
                <div className='flex flex-row justify-start items-start gap-[0.625rem]'>
                  <Envelope size={27} color='#fcfcfc' weight='bold' />
                  <p>kawantani@company.com</p>
                </div>
                <div className='flex flex-row justify-start items-start gap-[0.625rem]'>
                  <Phone size={27} color='#fcfcfc' weight='bold' />
                  <p>{'(0363) 123457'}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Footer */}
          <div className='w-full flex flex-col justify-center items-center gap-[1.8rem]'>
            <div className='w-full py-[0.06rem] bg-white'></div>
            <div className='flex flex-row justify-center items-center gap-[0.4rem]'>
              <Copyright size={24} color='#fcfcfc' weight='bold' />
              <p>
                Copyright 2025 <span className='text-[#50B34B]'>KawanTani</span>
                . All rights reserved
              </p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
