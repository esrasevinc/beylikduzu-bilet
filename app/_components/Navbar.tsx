import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/app/public/images/bb-logo.png";


const Navbar = () => {

  return (
    <header className="z-[1000] h-[80px] md:h-auto w-full fixed flex md:top-0 py-4 pl-16 bg-black/50">
      <div className="flex items-start w-full">
        <Link href='https://www.beylikduzu.istanbul/' target={"_blank"} >
        <Image 
        src={logo}
        alt="BB Logo"
        className="w-56 md:w-64 h-auto"
        width={200}
        height={50}
        />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;