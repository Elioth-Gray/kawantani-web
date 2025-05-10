import React from "react";
import Image from "next/image";

const DashboardProfilesMain = () => {
    return (
        <main className="p-10 bg-white min-h-screen">
            <h1 className="text-xl font-semibold text-[#84BD00] mb-6">Profil</h1>

            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-8">
                {/* Kiri: Foto dan Info Singkat */}
                <div className="flex flex-col items-center md:w-1/3 text-center">
                    <div className="w-32 h-32 relative mb-4 rounded-xl overflow-hidden">
                        <Image
                            src="/images/gopay.png"
                            alt="Foto Bu Marni"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <h2 className="text-xl font-semibold">Bu Marni</h2>
                    <p className="text-gray-500">marni@gmail.com</p>
                    <p className="text-gray-500">Surabaya, Jawa Timur</p>
                </div>

                {/* Kanan: Info Detail */}
                <div className="flex-1">
                    <div className="grid grid-cols-3 gap-y-4 text-sm text-gray-700">
                        <span className="font-medium">Name</span>
                        <span>:</span>
                        <span className="font-semibold">Bu Marni</span>

                        <span className="font-medium">Role</span>
                        <span>:</span>
                        <span className="font-semibold">User</span>

                        <span className="font-medium">Email</span>
                        <span>:</span>
                        <span className="font-semibold">marni@gmail.com</span>

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
