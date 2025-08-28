"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaTwitter, FaBars, FaTimes } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Weddings", to: "/weddings" },
    { name: "Portraits", to: "/portraits" },
    { name: "Contact", to: "/contact" },
  ];

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setAnimateMenu(true);
    } else {
      const timer = setTimeout(() => setAnimateMenu(false), 300);
      return () => clearTimeout(timer);
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="relative z-30 w-full px-4 sm:px-8 md:px-12 lg:px-24 py-6 md:py-8 bg-transparent shadow-sm flex items-center font-serif">
      {/* Logo */}
      <div
        className="flex-shrink-0 flex items-center h-16"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        <Link href="/">
          <div className="relative w-[220px] md:w-[520px] h-auto aspect-[3/1]">
            <Image
              src="/unit.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Hamburger Icon */}
      <div
        className="md:hidden flex items-center ml-auto"
        data-aos="fade-down"
        data-aos-delay="300"
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-black focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Desktop Nav */}
      <div
        className="hidden md:flex flex-1 justify-end items-center gap-8 lg:gap-12"
        data-aos="fade-down"
        data-aos-delay="200"
      >
        {navLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.to}
            className={`group relative !text-[#111111eb] text-sm uppercase tracking-widest transition duration-300 ease-in-out hover:!text-[#000000] no-underline ${
              isActive(link.to) ? "!text-[#00000021]" : ""
            }`}
          >
            <span className="block pb-1">{link.name}</span>
            <span
              className={`absolute left-0 bottom-0 h-[2px] bg-[#111111] transition-all duration-300 ease-in-out ${
                isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
        ))}
      </div>

      {/* Desktop Social Icons */}
      <div
        className="hidden md:flex items-center gap-4 flex-shrink-0 ml-8"
        data-aos="fade-down"
        data-aos-delay="300"
      >
        <a
          href="https://www.instagram.com/shutterunit/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram className="w-6 h-6 text-black" />
        </a>
        <a
          href="https://www.x.com/shutterunit"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter className="w-6 h-6 text-black" />
        </a>
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="w-6 h-6 fill-black"
          >
            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.43 0 225.36 0C141.09 0 89.5 54.42 89.5 154.69V195.3H0v92.66h89.5V512h107.86V288z" />
          </svg>
        </a>
      </div>

      {/* Mobile Dropdown */}
      {(menuOpen || animateMenu) && (
        <div
          ref={menuRef}
          className={`fixed top-0 left-0 w-full bg-white shadow-md flex flex-col items-start px-10 py-6 space-y-6 font-serif md:hidden z-50 border-b border-gray-200
            transform origin-top transition-all duration-300
            ${
              menuOpen
                ? "opacity-100 scale-y-100"
                : "opacity-0 scale-y-0 pointer-events-none"
            }`}
          aria-label="Mobile menu"
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-6 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:scale-105 transition duration-200"
            aria-label="Close Menu"
          >
            &times;
          </button>

          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.to}
              onClick={() => setMenuOpen(false)}
              className={`group relative !text-[#111111e7] text-sm uppercase tracking-widest transition duration-300 ease-in-out hover:!text-[#000000] no-underline ${
                isActive(link.to) ? "!text-[#000000]" : ""
              }`}
            >
              <span className="block pb-1">{link.name}</span>
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-[#111111d3] transition-all duration-300 ease-in-out ${
                  isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}

          <div className="flex items-center space-x-4 pt-2">
            <a
              href="https://www.instagram.com/shutterunit/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6 text-black" />
            </a>
            <a
              href="https://www.x.com/shutterunit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="w-6 h-6 text-black" />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="w-6 h-6 fill-black"
              >
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.43 0 225.36 0C141.09 0 89.5 54.42 89.5 154.69V195.3H0v92.66h89.5V512h107.86V288z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
