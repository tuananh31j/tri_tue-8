import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAppNavigation } from "../hooks/useAppNavigation";
import Receipts from "./Receipts";

// Define team member type
interface TeamMember {
  id: number;
  name: string;
  title: string;
  imgSrc: string;
}

// Data for team members
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Lê Đặng Bảo Khanh",
    title: "Teacher",
    imgSrc: "/img/Lê Đặng Bảo Khanh (1).png", // Nam - áo vest đen với hoa
  },
  {
    id: 2,
    name: "Nguyễn Duy Nam",
    title: "Teacher",
    imgSrc: "/img/Nguyễn Duy Nam (4).png", // Nam - áo vest trắng
  },
  {
    id: 3,
    name: "Nguyễn Sĩ Hoàng",
    title: "Teacher",
    imgSrc: "/img/Nguyễn Sĩ Hoàng.png", // Nam - áo đen có kính
  },
  {
    id: 4,
    name: "Nguyễn Thị Hoà",
    title: "Teacher",
    imgSrc: "/img/Nguyễn Thị Hòa (1).png", // Nữ - áo trắng
  },
  {
    id: 5,
    name: "Nguyễn Trần Hương Ly",
    title: "Teacher",
    imgSrc: "/img/Nguyễn Trần Hương Ly.png", // Nữ - váy đen
  },
  {
    id: 6,
    name: "Nguyễn Trúc Linh",
    title: "Teacher",
    imgSrc: "/img/Nguyễn Trúc Linh (1).png", // Nữ - áo trắng với hoa hồng và bằng tốt nghiệp
  },
  {
    id: 7,
    name: "Trần Hải Yến",
    title: "Teacher",
    imgSrc: "/img/Trần Hải Yến.png", // Nữ - áo dài hồng với mic
  },
  {
    id: 8,
    name: "Lê Quang Đại",
    title: "Teacher",
    imgSrc: "/img/Lê Quang Đại.png", // Nam - áo dài xanh với mic
  },
];

// Duplicate for the infinite scroll effect
const duplicatedTeamMembers = [...teamMembers, ...teamMembers];

const LandingPage: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const {
    navigateToSchedule,
    navigateToStudents,
    navigateToTeachers,
    navigateToAttendance,
  } = useAppNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="logo">
            <a href="#">
            {/* Logo */}
          <span className="text-2xl text-white font-extrabold">Trí Tuệ 8+</span>
            </a>
          </div>
          <nav className="auth-buttons">
            {currentUser && (
              <>
                <span className="text-[#86c7cc] font-semibold mr-4">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn btn--primary"
                  style={{
                    background: "linear-gradient(135deg, #86c7cc, #86c7cc)",
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content-wrapper">
            <div className="hero-left">
              <h1>
                <span className="h1-subtitle">Trí Tuệ 8+</span>
              </h1>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button
                  onClick={navigateToSchedule}
                  className="btn btn--primary hero-btn"
                  style={{
                    background: "linear-gradient(135deg, #86c7cc, #86c7cc)",
                  }}
                >
                  Study Schedule
                </button>
                <button
                  onClick={navigateToStudents}
                  className="btn btn--primary hero-btn"
                  style={{
                    background: "linear-gradient(135deg, #86c7cc, #86c7cc)",
                  }}
                >
                  Students
                </button>
                <button
                  onClick={navigateToTeachers}
                  className="btn btn--primary hero-btn"
                  style={{
                    background: "linear-gradient(135deg, #86c7cc, #86c7cc)",
                  }}
                >
                  Teachers
                </button>
                <button
                  onClick={navigateToAttendance}
                  className="btn btn--primary hero-btn"
                  style={{
                    background: "linear-gradient(135deg, #86c7cc, #86c7cc)",
                  }}
                >
                  Attendance
                </button>
              </div>
            </div>
            <div className="hero-right">
              <p className="hero-slogan">Your path to academic excellence</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="container team-section-header">
            <h2 className="section-title">Our Dedicated Team</h2>
            <p className="section-subtitle">
              Meet the amazing people who are always ready to support you.
            </p>
          </div>

          <div className="slider-container">
            <div className="slider-track">
              {/* Danh sách nhân sự (lặp lại 2 lần) */}
              {duplicatedTeamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <img
                    className="team-member__image"
                    src={member.imgSrc}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="team-member__info">
                    <h3 className="team-member__name">{member.name}</h3>
                    <p className="team-member__title">{member.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Preview receipts (tuition & salary) */}
       
      </main>
    </>
  );
};

export default LandingPage;
