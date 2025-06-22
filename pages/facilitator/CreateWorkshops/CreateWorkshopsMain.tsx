'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { getAllProvinces, getProvinceRegency } from '@/api/locationApi';
import { createWorkshop } from '@/api/workshopApi';
import { Image } from '@phosphor-icons/react/dist/ssr';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-[400px] bg-gray-700 rounded-lg animate-pulse' />
  ),
});

type Provinces = {
  id_provinsi: number;
  nama_provinsi: string;
};

type Regency = {
  id_kabupaten: number;
  nama_kabupaten: string;
};

const geocodeLocation = async (
  query: string,
): Promise<[number, number] | null> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=id&limit=1`,
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      return [lat, lon];
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&countrycodes=id`,
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();
    return data.display_name || `${lat}, ${lon}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat}, ${lon}`;
  }
};

const workshopSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  startTime: z.string().min(1, 'Waktu mulai wajib diisi'),
  endTime: z.string().min(1, 'Waktu berakhir wajib diisi'),
  provinceId: z.number().min(1, { message: 'Provinsi wajib dipilih' }),
  regencyId: z.number().min(1, { message: 'Kabupaten wajib dipilih' }),
  address: z.string().min(1, 'Alamat wajib diisi'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  capacity: z.number().min(1, 'Kapasitas minimal 1 orang'),
  lat: z.number().min(-90).max(90, 'Latitude tidak valid'),
  long: z.number().min(-180).max(180, 'Longitude tidak valid'),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'Ukuran file maksimal 10MB',
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'Format file harus JPG, JPEG, atau PNG',
    )
    .optional(),
});

const CreateWorkshopsMain = () => {
  const [provinces, setProvinces] = useState<Provinces[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedRegency, setSelectedRegency] = useState<number | null>(null);
  const [selectedRegencyName, setSelectedRegencyName] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    provinceId: 0,
    regencyId: 0,
    address: '',
    price: 0,
    capacity: 0,
    lat: -6.2088,
    long: 106.8456,
    image: null as File | null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const updateLocationFromGeocode = async (
    provinceName: string,
    regencyName?: string,
  ) => {
    setGeocodingLoading(true);

    try {
      let query = '';
      if (regencyName) {
        query = `${regencyName}, ${provinceName}, Indonesia`;
      } else {
        query = `${provinceName}, Indonesia`;
      }

      const coordinates = await geocodeLocation(query);

      if (coordinates) {
        const [lat, lon] = coordinates;

        setFormData((prev) => ({
          ...prev,
          lat: parseFloat(lat.toFixed(6)),
          long: parseFloat(lon.toFixed(6)),
        }));

        const locationName = await reverseGeocode(lat, lon);
        setCurrentLocationName(locationName);
      } else {
        const defaultLat = -6.2088;
        const defaultLon = 106.8456;

        setFormData((prev) => ({
          ...prev,
          lat: defaultLat,
          long: defaultLon,
        }));

        setCurrentLocationName('Jakarta, Indonesia (default)');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      lat: parseFloat(lat.toFixed(6)),
      long: parseFloat(lng.toFixed(6)),
    }));

    // Update location name
    reverseGeocode(lat, lng).then(setCurrentLocationName);
  };

  useEffect(() => {
    if (selectedRegencyName && selectedProvinceName) {
      updateLocationFromGeocode(selectedProvinceName, selectedRegencyName);
    } else if (selectedProvinceName && !selectedRegencyName) {
      updateLocationFromGeocode(selectedProvinceName);
    }
  }, [selectedRegencyName, selectedProvinceName]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getAllProvinces();
        setProvinces(response.data.provinces);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchRegencies = async () => {
      if (selectedProvince === null) return;
      try {
        const response = await getProvinceRegency(selectedProvince);
        setRegencies(response.data.regencies);
        setSelectedRegency(null);
        setSelectedRegencyName('');
        setFormData((prev) => ({ ...prev, regencyId: 0 }));
      } catch (error) {
        console.error('Failed to fetch regencies:', error);
      }
    };
    fetchRegencies();
  }, [selectedProvince]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Clean up previous preview URL
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: undefined }));
      }
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const searchAddress = async () => {
    if (!formData.address.trim()) {
      alert('Silakan masukkan alamat terlebih dahulu');
      return;
    }

    setGeocodingLoading(true);

    try {
      let query = formData.address;
      if (selectedRegencyName && selectedProvinceName) {
        query += `, ${selectedRegencyName}, ${selectedProvinceName}, Indonesia`;
      } else {
        query += ', Indonesia';
      }

      const coordinates = await geocodeLocation(query);

      if (coordinates) {
        const [lat, lon] = coordinates;

        setFormData((prev) => ({
          ...prev,
          lat: parseFloat(lat.toFixed(6)),
          long: parseFloat(lon.toFixed(6)),
        }));

        const locationName = await reverseGeocode(lat, lon);
        setCurrentLocationName(locationName);
      } else {
        alert(
          'Alamat tidak ditemukan. Silakan coba alamat yang lebih spesifik.',
        );
      }
    } catch (error) {
      console.error('Error searching address:', error);
      alert('Terjadi kesalahan saat mencari alamat');
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setErrors((prev) => ({
        ...prev,
        image: 'Banner workshop wajib diunggah',
      }));
      return;
    }

    const parsed = workshopSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof typeof formData, string>> = {};
      parsed.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof formData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const form = new FormData();

    const isoDate = formData.date
      ? new Date(formData.date).toISOString()
      : null;

    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('date', isoDate || '');
    form.append('address', formData.address);
    form.append('price', formData.price.toString());
    form.append('capacity', formData.capacity.toString());
    form.append('lat', formData.lat.toString());
    form.append('long', formData.long.toString());
    form.append('startTime', formData.startTime);
    form.append('endTime', formData.endTime);
    form.append('fullAddress', formData.address);
    form.append('regency', formData.regencyId?.toString() || '');
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const result = await createWorkshop(form);
      if (result.success === false) {
        alert(result.message);
      } else {
        alert('Workshop berhasil dibuat!');
        router.push('/facilitator/dashboard/workshops');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white'></div>
        </div>
      </main>
    );
  }

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} color='#fff' weight='bold' />
          <p>Kembali</p>
        </div>

        <div className='w-full mb-[3.1rem]'>
          <h1 className='text-[2.25rem] font-semibold'>Buat Workshop</h1>
          <p>Mulai buat workshop untuk memberi pengetahuan kepada orang lain</p>
        </div>

        <form className='w-full'>
          <div className='flex flex-col justify-center items-center w-full mb-10'>
            {bannerPreview ? (
              <div className='flex flex-col justify-start items-center gap-3 mb-4 w-full'>
                <div className='w-2/3 max-w-md h-48 rounded-lg object-cover border-2 border-white overflow-hidden'>
                  <img
                    src={bannerPreview}
                    alt='Banner Workshop'
                    className='w-full h-full object-cover'
                  />
                </div>
                <p>
                  Banner Workshop <span className='text-red-500'>*</span>
                </p>
              </div>
            ) : (
              <div className='flex flex-col justify-start items-center gap-3 mb-4 w-full'>
                <div className='w-2/3 max-w-md h-48 bg-white rounded-lg flex flex-col justify-center items-center'>
                  <Image size={32} color='#09090B'></Image>
                </div>
                <p>
                  Banner Workshop <span className='text-red-500'>*</span>
                </p>
              </div>
            )}
            <div className='w-full max-w-md'>
              <Input
                type='file'
                accept='image/*'
                onChange={handleBannerChange}
                className='text-white w-full'
              />
              {errors.image && (
                <p className='text-red-500 text-sm mt-1'>{errors.image}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-[2.1rem] w-full'>
            <h1 className='text-[1.5rem] font-semibold'>Data Workshop</h1>

            <div className='flex flex-row gap-[3.5rem] flex-wrap'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Judul</Label>
                <Input
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='Judul Workshop'
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Tanggal Pelaksanaan</Label>
                <Input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.date && (
                  <p className='text-red-500 text-sm'>{errors.date}</p>
                )}
              </div>
            </div>

            <div className='flex flex-row gap-[3.5rem]'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Provinsi</Label>
                <Select
                  onValueChange={(value) => {
                    const provinceId = parseInt(value, 10);
                    const province = provinces.find(
                      (p) => p.id_provinsi === provinceId,
                    );
                    setSelectedProvince(provinceId);
                    setSelectedProvinceName(province?.nama_provinsi || '');
                    setFormData((prev) => ({
                      ...prev,
                      provinceId: provinceId,
                    }));
                  }}
                >
                  <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                    <SelectValue placeholder='Pilih Provinsi' />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((provinsi) => (
                      <SelectItem
                        key={provinsi.id_provinsi}
                        value={provinsi.id_provinsi.toString()}
                      >
                        {provinsi.nama_provinsi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.provinceId && (
                  <p className='text-red-500 text-sm'>{errors.provinceId}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Kabupaten</Label>
                <Select
                  onValueChange={(value) => {
                    const regencyId = parseInt(value, 10);
                    const regency = regencies.find(
                      (r) => r.id_kabupaten === regencyId,
                    );
                    setSelectedRegency(regencyId);
                    setSelectedRegencyName(regency?.nama_kabupaten || '');
                    setFormData((prev) => ({
                      ...prev,
                      regencyId: regencyId,
                    }));
                  }}
                >
                  <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                    <SelectValue placeholder='Pilih Kabupaten' />
                  </SelectTrigger>
                  <SelectContent>
                    {regencies.map((kabupaten) => (
                      <SelectItem
                        key={kabupaten.id_kabupaten}
                        value={kabupaten.id_kabupaten.toString()}
                      >
                        {kabupaten.nama_kabupaten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regencyId && (
                  <p className='text-red-500 text-sm'>{errors.regencyId}</p>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-[0.6rem]'>
              <Label className='text-[1.25rem]'>Alamat Lengkap</Label>
              <div className='flex gap-2'>
                <Textarea
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Alamat Lengkap Workshop'
                  className='w-full min-h-[90px] resize-vertical'
                />
              </div>
              {errors.address && (
                <p className='text-red-500 text-sm'>{errors.address}</p>
              )}
            </div>

            <div className='flex flex-col gap-[0.6rem]'>
              <Label className='text-[1.25rem]'>Pilih Titik Pada Peta</Label>
              <LeafletMap
                lat={formData.lat}
                lng={formData.long}
                onLocationChange={handleLocationChange}
              />
              {currentLocationName && (
                <p className='text-sm text-gray-400 mt-2'>
                  Lokasi saat ini: {currentLocationName}
                </p>
              )}
            </div>

            <div className='flex flex-row gap-[3.5rem] flex-wrap'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Waktu Mulai</Label>
                <Input
                  type='time'
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleChange}
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.startTime && (
                  <p className='text-red-500 text-sm'>{errors.startTime}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Waktu Berakhir</Label>
                <Input
                  type='time'
                  name='endTime'
                  value={formData.endTime}
                  onChange={handleChange}
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.endTime && (
                  <p className='text-red-500 text-sm'>{errors.endTime}</p>
                )}
              </div>
            </div>

            <div className='flex flex-row gap-[3.5rem] flex-wrap'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>
                  Harga Tiket (Dalam Rupiah)
                </Label>
                <Input
                  type='number'
                  name='price'
                  value={formData.price === 0 ? '' : formData.price}
                  onChange={handleChange}
                  placeholder='Harga Workshop'
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.price && (
                  <p className='text-red-500 text-sm'>{errors.price}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Kapasitas Ruangan</Label>
                <Input
                  type='number'
                  name='capacity'
                  value={formData.capacity === 0 ? '' : formData.capacity}
                  onChange={handleChange}
                  placeholder='Kapasitas Peserta'
                  className='w-[19rem] h-[2.5rem]'
                  min='1'
                />
                {errors.capacity && (
                  <p className='text-red-500 text-sm'>{errors.capacity}</p>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-[0.6rem]'>
              <Label className='text-[1.25rem]'>Deskripsi Workshop</Label>
              <Textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Deskripsi lengkap workshop...'
                className='w-full min-h-[120px] resize-vertical'
                rows={5}
              />
              {errors.description && (
                <p className='text-red-500 text-sm'>{errors.description}</p>
              )}
            </div>

            <button
              type='submit'
              onClick={handleSubmit}
              className='py-[0.8rem] px-[1.2rem] bg-white text-black rounded-lg font-semibold w-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              disabled={loading}
            >
              {loading ? 'Menambah workshop...' : 'Ajukan Workshop'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateWorkshopsMain;
