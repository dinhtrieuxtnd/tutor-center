'use client';

import { Logo1 } from "@/components";
import { HomePageHeaderDropdown } from "@/components";
import { useState } from "react";
import { LinkDropdown } from "@/components";
import Link from "next/link";

const Nav = ({ title, ignoreSelector, children }: { title: string; ignoreSelector: string; children?: React.ReactNode }) => {
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
    <div className="py-2 md:py-3 inline-flex flex-col justify-center items-start">
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
    {children && (
      <HomePageHeaderDropdown 
        isOpen={isOpen} 
        setIsOpen={handleDropdownClose}
        ignoreSelectors={[ignoreSelector]}
      >
        {children}
      </HomePageHeaderDropdown>
    )}
  </div>
);}

const LoginButton = () => (
  <Link href="/auth/login">
    <div
      className="w-32 md:w-40 lg:w-44 px-3 md:px-4 lg:px-5 py-2 md:py-3 bg-primary hover:bg-secondary hover:text-primary rounded-lg inline-flex justify-center items-center transition-colors cursor-pointer"
    >
      <div className="justify-start text-white text-sm md:text-base lg:text-lg font-bold font-open-sans">
        Đăng nhập
      </div>
    </div>
  </Link>
);

export const HomepageHeader = () => {
  return (
    <header className="flex justify-between lg:justify-center gap-4 md:gap-6 lg:gap-8 items-center w-full bg-white shadow-md px-4 md:px-6 lg:px-8">
      <Logo1 className="" />
      <nav className="hidden md:flex gap-2 lg:gap-4">
        <Link href="/" className="py-2 md:py-3 inline-flex flex-col justify-center items-start">
          <div className="px-2 md:px-3 lg:px-4 py-2 md:py-3 hover:bg-[#CEE7FF] hover:text-primary rounded-lg inline-flex justify-center items-center cursor-pointer">
            <div className="justify-start text-black text-sm md:text-base lg:text-lg font-semibold font-open-sans transition-colors">
              Trang chủ
            </div>
          </div>
        </Link>
        
        <Nav title="Khóa học" ignoreSelector=".nav-trigger-courses">
          <LinkDropdown label="Khóa học online" href="/courses/online" />
          <LinkDropdown label="Khóa học offline" href="/courses/offline" />
          <LinkDropdown label="Tất cả khóa học" href="/courses" />
        </Nav>
        
        <Nav title="Giới thiệu" ignoreSelector=".nav-trigger-about">
          <LinkDropdown label="Về trung tâm" href="/about" />
          <LinkDropdown label="Đội ngũ giáo viên" href="/about/teachers" />
          <LinkDropdown label="Thành tích" href="/about/achievements" />
        </Nav>
        
        <Nav title="Thư viện" ignoreSelector=".nav-trigger-library">
          <LinkDropdown label="Tài liệu học tập" href="/library/documents" />
          <LinkDropdown label="Đề thi mẫu" href="/library/exams" />
          <LinkDropdown label="Bài tập thực hành" href="/library/exercises" />
        </Nav>
        
        <Nav title="Liên hệ" ignoreSelector=".nav-trigger-contact" />
      </nav>
      <LoginButton />
    </header>
  );
};
