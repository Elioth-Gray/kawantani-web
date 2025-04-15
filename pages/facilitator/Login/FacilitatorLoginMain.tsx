"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FacilitatorLoginMain = () => {
  const router = useRouter();

  const login = () => {
    router.push("/facilitator/dashboard/home");
  };

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center bg-[#09090B]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">KawanTani.Co</CardTitle>
          <CardDescription className="text-center">
            Admin & Facilitator Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input id="name" placeholder="Email Anda" />
              </div>
              <div className="flex flex-col space-y-1.5"></div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input id="name" placeholder="Password Anda" />
              </div>
              <div className="flex flex-col space-y-1.5"></div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full cursor-pointer" onClick={() => login()}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default FacilitatorLoginMain;
