'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { getToken } from "@/api/authApi"; // Pastikan path ini sesuai
type DecodedToken = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    iat: number;
    exp: number;
};

const DashboardProfilesMain = () => {
    const [userData, setUserData] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const token = getToken(); // Ambil dari localStorage
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            setUserData(decoded);
        }
    }, []);

    return (
        <main className="p-10 bg-white min-h-screen">
            <h1 className="text-xl font-semibold text-[#84BD00] mb-6">Profil</h1>

            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-8">
                {/* Kiri: Foto dan Info Singkat */}
                <div className="flex flex-col items-center md:w-1/3 text-center">
                    <div className="w-32 h-32 relative mb-4 rounded-xl overflow-hidden">
                        <Image
                            src="/images/gopay.png"
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
                <div className="flex-1">
                    <div className="grid grid-cols-3 gap-y-4 text-sm text-gray-700">
                        <span className="font-medium">Name</span>
                        <span>:</span>
                        <span className="font-semibold">
                            {userData ? `${userData.firstName} ${userData.lastName}` : '-'}
                        </span>

                        <span className="font-medium">Role</span>
                        <span>:</span>
                        <span className="font-semibold">User</span>

                        <span className="font-medium">Email</span>
                        <span>:</span>
                        <span className="font-semibold">{userData?.email || '-'}</span>

                        <span className="font-medium">Verifikasi Email</span>
                        <span>:</span>
                        <span className="text-[#D09257] font-semibold">Pending</span>

                        <span className="font-medium">Kontak</span>
                        <span>:</span>
                        <span className="font-semibold">0812345678912</span>

                        <span className="font-medium">Verifikasi Nomor</span>
                        <span>:</span>
                        <span className="text-[#7AC36A] font-semibold">Aktif</span>

                        <span className="font-medium">Status</span>
                        <span>:</span>
                        <span className="text-[#7AC36A] font-semibold">Aktif</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardProfilesMain;
