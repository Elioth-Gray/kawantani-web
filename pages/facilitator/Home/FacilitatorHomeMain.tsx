'use client';

import React, { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CalendarDots, DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import {
  getLatestSales,
  getTicketsSold,
  getTotalRevenue,
} from '@/api/facilitatorApi';
import {
  getOwnActiveParticipants,
  getOwnPopularWorkshops,
} from '@/api/workshopApi';

export type TicketSale = {
  id: number;
  participantName: string;
  workshopTitle: string;
  amount: string;
  formattedAmount: string;
  registrationDate: string;
  avatar: string;
  workshopImage: string;
  facilitator: string;
};

export type PopularWorkshop = {
  rank: number;
  id: string;
  title: string;
  date: string;
  formattedDate: string;
  participantCount: number;
  facilitator: string;
  facilitatorId: string;
  capacity: number;
  price: string;
  image: string;
};

const FacilitatorHomeMain = () => {
  const [revenue, setRevenue] = useState<number | undefined>();
  const [tickets, setTickets] = useState<number | undefined>();
  const [activeParticipants, setActiveParticipants] = useState<
    number | undefined
  >();
  const [latestSales, setLatestSales] = useState<TicketSale[]>([]);
  const [popularWorkshops, setPopularWorkshops] = useState<PopularWorkshop[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);

  const salesData = [
    { month: 'January', sales: 4500 },
    { month: 'February', sales: 5200 },
    { month: 'March', sales: 4800 },
    { month: 'April', sales: 6300 },
    { month: 'May', sales: 5800 },
    { month: 'June', sales: 7100 },
    { month: 'July', sales: 8200 },
    { month: 'August', sales: 7600 },
  ];

  const chartConfig = {
    sales: {
      label: 'Sales',
      color: '#ADFA1D',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          revenueResponse,
          ticketsResponse,
          participantsResponse,
          salesResponse,
          popularWorkshopResponse,
        ] = await Promise.all([
          getTotalRevenue(),
          getTicketsSold(),
          getOwnActiveParticipants(),
          getLatestSales(),
          getOwnPopularWorkshops(),
        ]);

        if (revenueResponse.data) {
          setRevenue(revenueResponse.data);
        }

        if (ticketsResponse.data) {
          setTickets(ticketsResponse.data);
        }

        if (participantsResponse.data) {
          setActiveParticipants(participantsResponse.data);
        }

        if (salesResponse.data) {
          setLatestSales(salesResponse.data.sales);
        }

        if (popularWorkshopResponse.data) {
          setPopularWorkshops(popularWorkshopResponse.data.workshops);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function formatToRupiah(value: number | string): string {
    const number = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(number)) return 'Rp0';

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  }

  const date = new Date();

  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <main className='w-full h-screen bg-[#09090B] px-[5.1rem] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[3.1rem]'>
          <h1 className='text-[2.25rem] font-semibold'>Dashboard</h1>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <div className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center border-[0.18rem] border-[#27272A] rounded-lg gap-[0.5rem]'>
              <CalendarDots size={24} color='#ffff' />
              <p className='font-semibold'>{formattedDate}</p>
            </div>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#000000' />
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>
        <div className='w-full h-full grid grid-cols-8'>
          <div className='col-span-5 w-full h-full flex flex-col justify-start items-start gap-[2rem]'>
            <div className='flex flex-row justify-between items-center w-full'>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Total Pendapatan</p>
                <p className='font-semibold text-[1.5rem]'>
                  {revenue ? formatToRupiah(revenue) : 'Rp0'}
                </p>
                <p>Dari total workshop</p>
              </div>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Tiket Terjual</p>
                <p className='font-semibold text-[1.5rem]'>{tickets ?? 0}</p>
                <p>Dari workshop</p>
              </div>
            </div>
            <div className='flex flex-col justify-start items-center py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-full h-auto gap-[0.5rem]'>
              <p className='font-semibold'>Grafik Pendapatan</p>
              <ChartContainer config={chartConfig} className='h-full w-full'>
                <BarChart
                  accessibilityLayer
                  data={salesData}
                  margin={{
                    left: 8,
                    right: 8,
                    top: 8,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tickFormatter={(value) => `Rp ${value}`}
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(234, 179, 8, 0.1)' }}
                  />
                  <Bar
                    dataKey='sales'
                    fill='var(--color-sales)'
                    radius={[5, 5, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            <div className='flex flex-col justify-start items-center py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-full h-auto gap-[0.5rem]'>
              <p className='font-semibold'>Workshop Terpopuler</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px] text-white'>
                      Nomor
                    </TableHead>
                    <TableHead className='text-white w-[12rem]'>Nama</TableHead>
                    <TableHead className='text-white'>Tanggal</TableHead>
                    <TableHead className='text-right text-white'>
                      Peserta
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularWorkshops && popularWorkshops.length > 0 ? (
                    popularWorkshops.map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell className='font-medium'>
                          {workshop.rank}
                        </TableCell>
                        <TableCell>{workshop.title}</TableCell>
                        <TableCell>
                          {workshop.formattedDate || workshop.date}
                        </TableCell>
                        <TableCell className='text-right'>
                          {workshop.participantCount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className='text-center text-gray-400'
                      >
                        Belum ada data workshop terpopuler
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className='col-span-3 w-full h-full '>
            <div className='flex flex-col justify-end items-end w-full gap-[2rem] h-full'>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Pendaftar Aktif Saat Ini</p>
                <p className='font-semibold text-[1.5rem]'>
                  {activeParticipants ?? 0}
                </p>
                <p>Pada workshop</p>
              </div>
              <div className='flex flex-col justify-start items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-full gap-[0.8rem] '>
                <div>
                  <p>Penjualan Terbaru</p>
                  <p className='text-[0.75rem]'>
                    Kamu menjual {latestSales.length} tiket bulan ini!
                  </p>
                </div>
                {latestSales && latestSales.length > 0 ? (
                  latestSales.map((sale) => (
                    <div key={sale.id} className='grid grid-cols-3 w-full'>
                      <div className='col-span-2 h-[3rem] flex flex-row justify-start items-start gap-[0.5rem]'>
                        <div className='size-[2rem] rounded-full overflow-clip object-cover'>
                          <Image
                            src={
                              `${baseURL}/users/${sale.avatar}` ||
                              '/images/bayam.webp'
                            }
                            width={100}
                            height={100}
                            className='w-full h-full object-cover'
                            alt={`Avatar ${sale.participantName}`}
                            unoptimized
                          />
                        </div>
                        <div className='flex flex-col justify-start items-start'>
                          <p className='text-[0.75rem] font-semibold'>
                            {sale.participantName}
                          </p>
                          <p className='text-[0.5rem]'>
                            {sale.workshopTitle || 'Workshop Teknik Tanam Padi'}
                          </p>
                        </div>
                      </div>
                      <div className='col-span-1 flex flex-row justify-end items-start'>
                        <p className='text-[0.6rem] font-semibold'>
                          {sale.formattedAmount || formatToRupiah(sale.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='flex flex-col justify-center items-center w-full h-[6rem] text-gray-400'>
                    <p className='text-[0.75rem]'>
                      Belum ada penjualan terbaru
                    </p>
                  </div>
                )}
                <div className='h-full w-full flex flex-col justify-end items-end'>
                  <Link
                    href='/sales'
                    className='w-full text-center text-[0.8rem]'
                  >
                    Lihat Semuanya
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FacilitatorHomeMain;
