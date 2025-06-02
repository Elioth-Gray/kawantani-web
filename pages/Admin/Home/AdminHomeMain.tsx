'use client';
import React, { use, useEffect, useState } from 'react';
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
import { getAllUsers } from '@/api/userApi';
import { getAllFacilitator } from '@/api/facilitatorApi';
import { getAllArticles } from '@/api/articleApi';
import { getVerifiedWorkshops } from '@/api/workshopApi';

const AdminHomeMain = () => {
  const [users, setUsers] = useState([]);
  const [facilitators, setFacilitators] = useState([]);
  const [articles, setArticles] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        if (response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFaciliators = async () => {
      setLoading(true);
      try {
        const response = await getAllFacilitator();
        if (response.data) {
          setFacilitators(response.data.facilitator);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await getAllArticles();
        if (response.data) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const response = await getVerifiedWorkshops();
        console.log(response);
        if (response.data) {
          setWorkshops(response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchFaciliators();
    fetchArticles();
    fetchWorkshops();
  }, []);

  useEffect(() => {
    console.log(facilitators);
    console.log(users);
  }, [facilitators]);

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

  return (
    <main className='w-full h-screen bg-[#09090B]  px-[5.1rem] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div className='w-full flex flex-row justify-between items-center mb-[3.1rem]'>
          <h1 className='text-[2.25rem] font-semibold'>Dashboard</h1>
          <div className='flex flex-row justify-end items-center gap-[0.4rem]'>
            <div className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center border-[0.18rem] border-[#27272A] rounded-lg gap-[0.5rem]'>
              <CalendarDots size={24} color='#ffff'></CalendarDots>
              <p className='font-semibold'>12 April 2025</p>
            </div>
            <button className='py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]'>
              <DownloadSimple size={24} color='#fffff'></DownloadSimple>
              <p className='font-semibold'>Download</p>
            </button>
          </div>
        </div>
        <div className='w-full h-full grid grid-cols-8'>
          <div className='col-span-5 w-full h-full flex flex-col justify-start items-start gap-[2rem]'>
            <div className='flex flex-row justify-between items-center w-full'>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Total Pengguna (Reguler)</p>
                <p className='font-semibold text-[1.5rem]'>{users.length}</p>
                <p>Pengguna terdaftar</p>
              </div>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Total Facilitator </p>
                <p className='font-semibold text-[1.5rem]'>
                  {facilitators.length > 0 ? facilitators.length : '0'}
                </p>
                <p>Facilitator Terdaftar</p>
              </div>
            </div>
            <div className='flex flex-col justify-start center py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-full h-auto gap-[0.5rem]'>
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
          </div>
          <div className='col-span-3 w-full h-full '>
            <div className='flex flex-col justify-between items-end w-full gap-[2rem] h-full'>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Artikel Terpublish</p>
                <p className='font-semibold text-[1.5rem]'>
                  {' '}
                  {articles.length > 0 ? articles.length : '0'}
                </p>
                <p>Dari total artikel</p>
              </div>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Workshop Terverifikasi</p>
                <p className='font-semibold text-[1.5rem]'>
                  {workshops.length > 0 ? workshops.length : '0'}
                </p>
                <p>Dari total workshop</p>
              </div>
              <div className='flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]'>
                <p>Tanaman Terdaftar</p>
                <p className='font-semibold text-[1.5rem]'>2</p>
                <p>Tanaman pada sistem</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminHomeMain;
