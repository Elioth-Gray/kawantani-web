"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

const CreateFacilitatorsMain = () => {
    const router = useRouter();

    return (
        <main className="w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto">
            <section className="w-full h-fit my-[4.5rem] mb-[4.5rem]">
                <div className="w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer"
                    onClick={() => router.back()}>
                    <ArrowLeft size={24} color="#fff" weight="bold" />
                    <p>Kembali</p>
                </div>

                <div className="w-full mb-[3.1rem]">
                    <h1 className="text-[2.25rem] font-semibold">Tambah Fasilitator</h1>
                    <p>Masukkan data fasilitator baru ke sistem</p>
                </div>

                <form className="w-full">
                    <div className="flex flex-col gap-[2.1rem]">
                        <div className="flex flex-row gap-[3.5rem]">
                            <div className="flex flex-col gap-[0.6rem]">
                                <Label className="text-[1.25rem]">Nama Depan</Label>
                                <Input placeholder="Nama Depan" className="w-[20rem] h-[2.5rem]" />
                            </div>
                            <div className="flex flex-col gap-[0.6rem]">
                                <Label className="text-[1.25rem]">Nama Belakang</Label>
                                <Input placeholder="Nama Belakang" className="w-[20rem] h-[2.5rem]" />
                            </div>
                        </div>

                        <div className="flex flex-row gap-[3.5rem]">
                            <div className="flex flex-col gap-[0.6rem]">
                                <Label className="text-[1.25rem]">Username</Label>
                                <Input placeholder="Username" className="w-[20rem] h-[2.5rem]" />
                            </div>
                            <div className="flex flex-col gap-[0.6rem]">
                                <Label className="text-[1.25rem]">Email</Label>
                                <Input placeholder="Email" type="email" className="w-[20rem] h-[2.5rem]" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[0.6rem] w-[20rem]">
                            <Label className="text-[1.25rem]">Password</Label>
                            <Input placeholder="Password" type="password" className="h-[2.5rem]" />
                        </div>

                        <button
                            type="submit"
                            className="py-[0.5rem] px-[0.8rem] flex justify-center items-center bg-white text-black rounded-lg gap-[0.5rem] cursor-pointer"
                        >
                            <p className="font-semibold">Tambah Fasilitator</p>
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default CreateFacilitatorsMain;
