import type { Metadata } from 'next';
import './super.css';
import Sidebar from './Sidebar';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin dashboard for managing the site',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-screen flex flex-row'>
      <Sidebar />
      {children}
    </div>
  );
}
