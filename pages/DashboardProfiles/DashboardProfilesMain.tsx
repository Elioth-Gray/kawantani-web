'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '@/api/authApi';
import { FaEdit } from 'react-icons/fa';

type DecodedToken = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: number;
    iat: number;
    exp: number;
};

const DashboardProfilesMain = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [userData, setUserData] = useState<DecodedToken>({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 0,
        iat: 0,
        exp: 0,
    });

    const router = useRouter();

    useEffect(() => {
        const storedToken = getToken();
        setIsLogin(true);
        if (storedToken) {
            const decoded = jwtDecode<DecodedToken>(storedToken);
            setUserData(decoded);
        }
    }, []);

    const renderGender = (gender: number | null) => {
        if (gender === 0) return 'Laki-laki';
        if (gender === 1) return 'Perempuan';
        return '-';
    };

    return (
        <main className="p-10 bg-white min-h-screen">
            <h1 className="text-xl font-semibold text-[#84BD00] mb-6">Profil</h1>

            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-8">
                {/* Kiri: Foto dan Info Singkat */}
                <div className="flex flex-col items-center md:w-1/3 text-center">
                    <div className="w-32 h-32 relative mb-4 rounded-xl overflow-hidden">
                        <Image
                            src="/images/gopay.webp"
                            alt="Foto Profil"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <h2 className="text-xl font-semibold">
                        {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
                    </h2>
                    <p className="text-gray-500">{userData?.email || '-'}</p>
                    <p className="text-gray-500">Surabaya, Jawa Timur</p>
                </div>

                {/* Kanan: Info Detail */}
                <div className="flex-1 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Informasi Pribadi</h3>
                        <button
                            onClick={() => router.push('/edit-profile')}
                            className="text-[#84BD00] hover:text-[#6f9e00] transition"
                            aria-label="Edit Profile"
                        >
                            <FaEdit size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-y-4 text-sm text-gray-700">
                        <span className="font-medium">Nama Depan</span>
                        <span>:</span>
                        <span className="font-semibold">{userData?.firstName || '-'}</span>

                        <span className="font-medium">Nama Belakang</span>
                        <span>:</span>
                        <span className="font-semibold">{userData?.lastName || '-'}</span>

                        <span className="font-medium">Email</span>
                        <span>:</span>
                        <span className="font-semibold">{userData?.email || '-'}</span>

                        <span className="font-medium">Nomor Telepon</span>
                        <span>:</span>
                        <span className="font-semibold">{userData?.phoneNumber || '-'}</span>

                        <span className="font-medium">Tanggal Lahir</span>
                        <span>:</span>
                        <span className="font-semibold">{userData?.dateOfBirth || '-'}</span>

                        <span className="font-medium">Jenis Kelamin</span>
                        <span>:</span>
                        <span className="font-semibold">{renderGender(userData?.gender ?? null)}</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardProfilesMain;
