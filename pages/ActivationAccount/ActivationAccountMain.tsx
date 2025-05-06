"use client";

import React, { useState } from "react";
import PrimaryLink from "@/components/links/PrimaryLink";
import InputField from "@/components/form/InputField";
import { z } from "zod";
import { CodeSimple } from "@phosphor-icons/react/dist/ssr";
import ActionButton from "@/components/buttons/ActionButton";
import { useRouter, usePathname } from "next/navigation";

const ActivationAccountMain = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<{ code?: string[] } | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const codeSchema = z.object({
    code: z.string().min(4, "Kode harus diisi!"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = codeSchema.safeParse({ code });

    if (!result.success) {
      const formattedError = result.error.format();
      setError({
        code: formattedError.code?._errors || [],
      });
    } else {
      setError(null);
      router.push(`${pathname}/success`);
    }
  };

  return (
    <section className="grid grid-cols-2 w-full h-screen">
      <div className="col-span-1 w-full h-screen overflow-y-auto flex flex-col justify-start items-center py-[6.3rem]">
        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-start w-[23.25rem] gap-[2.8rem]"
        >
          <div className="flex flex-col justify-start items-center gap-[1.6rem] w-full">
            <div className="w-full">
              <h1 className="text-[2.25rem] font-semibold">Verifikasi Akun</h1>
              <p className="mt-[0.5rem] text-[1.25rem] font-light w-full">
                Masukkan kode verifikasi yang dikirimkan ke email kamu
              </p>
            </div>

            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Kode Verifikasi</h1>
              <InputField
                placeholder="Masukkan kode"
                type="text"
                value={code}
                name="code"
                onChange={handleChange}
                error={error?.code?.[0]}
              >
                <CodeSimple
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            {/* <div className="w-full h-[3.5rem] bg-red-300 rounded-md flex flex-row justify-center items-center">
              <h1 className="text-white font-bold"></h1>
            </div> */}
            <ActionButton
              textColor="#ffff"
              height="3.75rem"
              size="1.2rem"
              width="100%"
              onClickHandler={() => {}}
            >
              Selanjutnya
            </ActionButton>
          </div>
        </form>
      </div>
      <div className="login-image col-span-1 w-full h-[100%]"></div>
    </section>
  );
};

export default ActivationAccountMain;
