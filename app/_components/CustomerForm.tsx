"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import agent from "../api/agent";

interface CustomerFormProps {
  selectedSeatId: string; 
}

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [tcNum, setTcNum] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const router = useRouter();


  return (
    <div className="w-full flex flex-col items-center justify-center max-w-7xl px-10 lg:px-20 mx-auto py-12">
      <h2 className="text-lg font-bold">Müşteri Bilgileri</h2>
      <form  className="space-y-4 items-center justify-center">
        <div>
          <label>İsim:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>TC Kimlik No:</label>
          <input
            type="text"
            value={tcNum}
            onChange={(e) => setTcNum(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Telefon:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Adres:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Doğum Tarihi:</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Bilet Oluştur
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
