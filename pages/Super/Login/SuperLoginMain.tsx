'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { jwtDecode } from 'jwt-decode';
import { loginAdmin } from '@/api/authApi';

const SuperLoginMain = () => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const [warning, setWarning] = useState('');

  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email('Email tidak valid!').min(1, 'Email wajib diisi!'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof formData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setLoading(true);
      const result = await loginAdmin(formData);
      if (result.success == false) {
        setWarning(result.message);
        setLoading(false);
      } else {
        setWarning('');
      }
    }
  };

  return (
    <main className='w-full h-screen flex flex-col justify-center items-center bg-[#09090B]'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle className='text-center'>KawanTani.Co</CardTitle>
          <CardDescription className='text-center'>
            Admin & Facilitator Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  placeholder='Email Anda'
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  type='text'
                />
              </div>
              <div className='flex flex-col space-y-1.5'></div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  placeholder='Password Anda'
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </div>
              <div className='flex flex-col space-y-1.5'></div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button className='w-full cursor-pointer' onClick={handleSubmit}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default SuperLoginMain;
