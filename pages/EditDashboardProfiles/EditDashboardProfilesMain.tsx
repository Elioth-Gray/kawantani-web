'use client';

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { getToken } from '@/api/authApi';

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

const EditDashboardProfileMain = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '0',
    });

    useEffect(() => {
        const token = getToken();
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            setFormData({
                firstName: decoded.firstName || '',
                lastName: decoded.lastName || '',
                email: decoded.email || '',
                phoneNumber: decoded.phoneNumber || '',
                dateOfBirth: decoded.dateOfBirth || '',
                gender: decoded.gender.toString() || '0',
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Data disimpan:', formData);
        router.push('/dashboard/profiles');
    };

    return (
        <main className="min-h-screen bg-white p-10">
            <h1 className="text-xl font-semibold text-[#84BD00] mb-6">Edit Profil</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Depan</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Belakang</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="0">Laki-laki</option>
                            <option value="1">Perempuan</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-[#84BD00] text-white px-6 py-2 rounded-md hover:bg-[#6f9e00] transition"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </main>
    );
};

export default EditDashboardProfileMain;
