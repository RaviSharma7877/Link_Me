import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme } from "./hooks/ThemeContext";
import Link from "next/link";
import { SunIcon, MoonIcon } from "../icon";
import Image from "next/image";
import smalllogo from '../images/smalllogo.png'
import Cookies from 'js-cookie';

// ... (imports and other code)

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const imageUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…ynqlyJaMeIv8AcQaWJALQZvLM4bvcy1neKT5l9Zlmgf2f/9k=";
  useEffect(() => {
    const loginStatus = Cookies.get('login') === 'yes';
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLogout = () => {
    // Clear cookies and update state
    Cookies.remove('login');
    setIsLoggedIn(false);
  };

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
    const closeButton = document.getElementById("close-button");
    if (closeButton) {
      closeButton.classList.toggle("show", isNavOpen);
    }
  };

  useEffect(() => {
    const linkColor = document.querySelectorAll(`.${styles.nav_link}`);

    const colorLink = (event) => {

      const clickedLink = event.currentTarget;

      if (linkColor) {
        linkColor.forEach((l) => l.classList.remove(styles.active));
        clickedLink.classList.add(styles.active);
      }
    };

    // Add the 'active' class to the first link by default
    if (linkColor.length > 0) {
      linkColor[0].classList.add(styles.active);
    }

    linkColor.forEach((l) => l.addEventListener("click", colorLink));

    return () => {
      linkColor.forEach((l) => l.removeEventListener("click", colorLink));
    };
  }, []);

  useEffect(() => {
    const bodypd = document.getElementById("body-pd");
    const headerpd = document.getElementById("header");

    if (bodypd && headerpd) {
      bodypd.classList.toggle("body-pd", isNavOpen);
      headerpd.classList.toggle("body-pd", isNavOpen);
    }
  }, [isNavOpen]);

  return (
    <div
      id="body-pd"
      className={`${styles.body_pd} ${isNavOpen ? styles.body : ""}`}
    >
      <header
        className={`${styles.header} text-${theme} bg-${
          theme == "light" ? "dark" : "light"
        }`}
        id="header"
      >
        <div className={`${styles.header_toggle}`} onClick={handleToggle}>
          <i
            className={`bx ${isNavOpen ? "bx-x" : "bx-menu"} ${styles.menu}`}
            id="header-toggle"
          ></i>
        </div>
        <div className={`${styles.xyz}`}>
          <div className={`${styles.header_img}`}>
            
            <img src={imageUrl} alt="" />
          </div>
          <button
            onClick={toggleTheme}
            className={`ml-3 flex items-center justify-center rounded-full p-1 ${
              theme === "light" ? "bg-light text-dark" : "bg-dark text-light"
            }`}
          >
            {theme === "dark" ? (
              <MoonIcon className={"fill-dark"} />
            ) : (
              <SunIcon className={"fill-dark"} />
            )}
          </button>
        </div>
      </header>
      <div
        className={`${styles.l_navbar} ${
          isNavOpen ? styles.show : ""
        } text-${theme} bg-${theme == "light" ? "dark" : "light"}`}
        id="nav-bar"
      >
        <nav className={`${styles.nav}`}>
          <div>
            
            <div className={`${styles.nav_logo}`}>
              <Image src={smalllogo} width={20} alt="" />
              <span className={`${styles.nav_logo_name}`}>Link_Me</span>
            </div>
            <div className={`${styles.nav_list}`}>
              <Link href="/dashboard" className={`${styles.nav_link} ${styles.Dashboard}`}>
                
                <i className={`bx bx-grid-alt ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>Dashboard</span>
              </Link>
              <Link href="/" className={`${styles.nav_link} ${styles.Applications}`}>
                
                <i
                  className={`bx bx-bar-chart-alt-2 ${styles.nav_icon}`}
                ></i>
                <span className={`${styles.nav_name}`}>Applications</span>
              </Link>
              <Link href="/bookmarks" className={`${styles.nav_link} ${styles.Bookmark}`}>
                
                <i className={`bx bx-bookmark ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>Bookmark</span>
              </Link>
              <Link href="/about" passHref className={`${styles.nav_link} ${styles.About}`}>
                
                <i className={`bx bx-folder ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>About</span>
              </Link>
              <Link href="/contact" passHref className={`${styles.nav_link} ${styles.Contact}`}>
                
                <i className={`bx bx-phone ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>Contact</span>
              </Link>
              
            </div>
          </div>
          <div>
          <Link href="/profile" passHref className={`${styles.nav_link} ${styles.Profile}`}>
                
                <i className={`bx bx-user ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>Profile</span>
              </Link>
          {isLoggedIn ? (
              <Link href="/dashboard" className={`${styles.nav_link}`} onClick={handleLogout}>
                <i className={`bx bx-log-out ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>Sign Out</span>
              </Link>
            ) : (
              <Link href="/login" className={`${styles.nav_link}`}>
                <i className={`bx bx-log-out ${styles.nav_icon}`}></i>
                <span className={`${styles.nav_name}`}>Get Start</span>
              </Link>
            )}
            </div>
        </nav>
      </div>
    </div>
    
  );
}

export default Navbar;
