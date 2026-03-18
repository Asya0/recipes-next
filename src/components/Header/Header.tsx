"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import logo from "../../../public/assets/logo.svg";
import { NAV_CONFIG, NavItem } from "./config";
import FavoriteIcon from "../icons/FavoriteIcon/FavoriteIcon";
import ProfileIcon from "../icons/ProfileIcon/ProfileIcon";
import { useTheme } from "@/hooks/useTheme";
import Button from "../Button";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const SunIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link href="/" onClick={closeMenu}>
              <Image
                className={styles["logo-icon"]}
                src={logo}
                alt="logo"
                width={32}
                height={32}
                priority
              />
              <span className={styles["logo-text"]}>Food Client</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            {NAV_CONFIG.map(({ id, label }: NavItem) => {
              const isActive = pathname === id;
              return (
                <Link
                  key={id}
                  href={id}
                  className={
                    isActive ? styles["nav-link--active"] : styles["nav-link"]
                  }
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={toggleTheme}
              className={styles["theme-toggle"]}
              aria-label={
                mounted && theme === "light"
                  ? "Включить тёмную тему"
                  : "Включить светлую тему"
              }
              title={
                mounted && theme === "light" ? "Dark theme" : "Light theme"
              }
            >
              {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link
              href="/favorites"
              className={styles["icon-button"]}
              onClick={closeMenu}
            >
              <FavoriteIcon width={19} height={19} color="accent" />
            </Link>
            <Link
              href="/profile"
              className={styles["icon-button"]}
              onClick={closeMenu}
            >
              <ProfileIcon width={24} height={24} color="accent" />
            </Link>

            <button
              className={`${styles["burger-button"]} ${isMenuOpen ? styles["burger-button--open"] : ""}`}
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles["mobile-menu"]} ${isMenuOpen ? styles["mobile-menu--open"] : ""}`}
      >
        <div className={styles["mobile-menu__content"]}>
          <nav className={styles["mobile-nav"]}>
            {NAV_CONFIG.map(({ id, label }: NavItem) => {
              const isActive = pathname === id;
              return (
                <Link
                  key={id}
                  href={id}
                  className={
                    isActive
                      ? styles["mobile-nav-link--active"]
                      : styles["mobile-nav-link"]
                  }
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles["mobile-actions"]}>
            <Link
              href="/favorites"
              className={styles["mobile-action-button"]}
              onClick={closeMenu}
            >
              <FavoriteIcon width={24} height={24} color="accent" />
              <span>Избранное</span>
            </Link>
            <Link
              href="/profile"
              className={styles["mobile-action-button"]}
              onClick={closeMenu}
            >
              <ProfileIcon width={24} height={24} color="accent" />
              <span>Профиль</span>
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles["menu-overlay"]} onClick={closeMenu} />
      )}
    </>
  );
};

export default Header;
