'use client';

import { Logo1 } from "@/components";
import { HomePageHeaderDropdown } from "@/components";
import { useState } from "react";
import { LinkDropdown } from "@/components";

const Nav = ({ title, ignoreSelector }: { title: string; ignoreSelector: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Chỉ đóng dropdown nếu chưa được click
    if (!isClicked) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setIsOpen(true);
  };

  // Reset trạng thái khi click ra ngoài
  const handleDropdownClose = () => {
    setIsOpen(false);
    setIsClicked(false);
  };
  
  return (
  <div 
    className="relative"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <div className="py-2 md:py-3 inline-flex flex-col justify-center  items-start">
      <div
      onClick={handleClick}
      className="px-2 md:px-3 lg:px-4 py-2 md:py-3 hover:bg-[#CEE7FF] hover:text-primary rounded-lg inline-flex justify-center items-center cursor-pointer nav-trigger">
        <div
          className="justify-start text-black text-sm md:text-base lg:text-lg font-semibold font-open-sans transition-colors"
        >
          {title}
        </div>
      </div>
    </div>
    <HomePageHeaderDropdown 
      isOpen={isOpen} 
      setIsOpen={handleDropdownClose}
      ignoreSelectors={[ignoreSelector]}
    >
      <LinkDropdown label="Option 1" href="/" />
      <LinkDropdown label="Option 2" href="/" />
      <LinkDropdown label="Option 3" href="/" />
    </HomePageHeaderDropdown>
  </div>
);}

const LoginButton = () => (
  <div
    className="w-32 md:w-40 lg:w-44 px-3 md:px-4 lg:px-5 py-2 md:py-3 bg-primary hover:bg-secondary hover:text-primary rounded-lg inline-flex justify-center items-center transition-colors cursor-pointer"
  >
    <div className="justify-start text-white text-sm md:text-base lg:text-lg font-bold font-open-sans">
      Đăng nhập
    </div>
  </div>
);

export const HomepageHeader = () => {
  return (
    <header className="flex justify-between lg:justify-center gap-4 md:gap-6 lg:gap-8 items-center w-full bg-white shadow-md px-4 md:px-6 lg:px-8">
      <Logo1 className="" />
      <nav className="hidden md:flex gap-2 lg:gap-4">
        <Nav title="Giới thiệu" ignoreSelector=".nav-trigger-introduction" />
        <Nav title="Khóa online" ignoreSelector=".nav-trigger-online" />
        <Nav title="Khóa offline" ignoreSelector=".nav-trigger-offline" />
        <Nav title="Thư viện" ignoreSelector=".nav-trigger-library" />
        <Nav title="Đội ngũ" ignoreSelector=".nav-trigger-team" />
        <Nav title="Liên hệ" ignoreSelector=".nav-trigger-contact" />
      </nav>
      <LoginButton />
    </header>
  );
};
