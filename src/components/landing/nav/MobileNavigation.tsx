"use client";

import {
  MobileNav,
  MobileNavMenu,
  MobileNavHeader,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { NavbarLogo } from "@/components/ui/resizable-navbar";
import { MobileNavToggle } from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { navItems } from "@/lib/utils";

export default function MobileNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <MobileNav>
      <MobileNavHeader>
        <NavbarLogo />
        <MobileNavToggle
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </MobileNavHeader>

      <MobileNavMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {navItems.map((item, idx) => (
          <a
            key={`mobile-link-${idx}`}
            href={item.link}
            onClick={() => setIsMobileMenuOpen(false)}
            className="relative text-neutral-600 dark:text-neutral-300"
          >
            <span className="block">{item.name}</span>
          </a>
        ))}
        <div className="flex w-full flex-col gap-4">
          <NavbarButton
            onClick={() => setIsMobileMenuOpen(false)}
            variant="primary"
            className="w-full"
          >
            Login
          </NavbarButton>
          <NavbarButton
            onClick={() => setIsMobileMenuOpen(false)}
            variant="primary"
            className="w-full"
          >
            Book a call
          </NavbarButton>
        </div>
      </MobileNavMenu>
    </MobileNav>
  );
}
