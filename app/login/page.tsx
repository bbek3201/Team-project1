"use client"

import { useRouter } from "next/navigation";
import { Coffeelogo } from "../components/coffeelogo";
import { Mainlogo } from "../components/mainlogo";

export default function Home() {
const router = useRouter()
  return (
   <div className="w-full h-screen flex">
    <div className="w-full h-screen flex flex-col bg-[#FBBF24] justify-center items-center">
      <div className="absolute flex gap-2 top-8 left-20">
        <Coffeelogo/>
        <p className="font-bold text-[16px]">Buy Me Coffee</p>
      </div>
      <div className="w-113.75 h-92.5 flex flex-col justify-center items-center gap-10">
        <Mainlogo/>
        <div className="flex flex-col text-center gap-3">
          <p className="font-bold text-2xl">Fund your creative work</p>
          <p className="font-normal text-[16px]">Accept support. Start a membership. Setup a shop. It’s easier than you think.</p>
        </div>
      </div>
    </div>
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="h-min-64 w-101.75 flex flex-col">
        <button onClick={() => router.push('/signup')} className="absolute top-8 right-20 rounded-md py-2 px-4 bg-[#F4F4F5] cursor-pointer">
          <p className="font-medium text-[14px]">Sign up</p>
        </button>
        <div className="flex flex-col gap-1.5 p-6">
          <p className="font-semibold text-2xl">Welcome back</p>
          <p className="font-normal text-[14px] text-[#71717A]">Choose a username for your page</p>
        </div>
        <div className="flex flex-col gap-2 pt-0 p-6">
          <p className="font-medium text-[14px]">Email</p>
          <input className="px-3 py-2 border border-[#E4E4E7] rounded-md text-[#71717A]" type="text" placeholder="Enter username here" />
        </div>
        <div className="flex flex-col gap-2 pt-0 p-6">
          <p className="font-medium text-[14px]">Password</p>
          <input className="px-3 py-2 border border-[#E4E4E7] rounded-md text-[#71717A]" type="text" placeholder="Enter username here" />
        </div>
        <div className="flex flex-col pt-0 p-6">
          <button className="rounded-md flex items-center justify-center text-white bg-black h-10 w-full cursor-pointer">
            <p>Continue</p>
          </button>
        </div>
      </div>
    </div>
   </div>
  );
}
