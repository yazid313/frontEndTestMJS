"use client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center z-10 shadow-md bg-white">
      <div className="container flex justify-center items-center text-3xl font-semibold font-serif text-yellow-600">
        Test MJS
      </div>
    </header>
  );
}
