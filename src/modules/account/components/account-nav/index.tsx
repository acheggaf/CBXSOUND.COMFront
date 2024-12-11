"use client"

import React from 'react'
import { Customer } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { signOut } from "@modules/account/actions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WelcomeHeader from '../welcome-card';
import { 
  FiUser,
  FiMapPin,
  FiPackage,
  FiGrid,
  FiKey,
  FiLogOut
} from 'react-icons/fi'

interface AccountNavProps {
  customer: Omit<Customer, "password_hash"> | null
}

const AccountNav = ({ customer }: AccountNavProps) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signOut(countryCode)
  }

  const navItems = [
    { href: '/account', label: 'Overview', icon: FiGrid },
    { href: '/account/profile', label: 'Profile', icon: FiUser },
    { href: '/account/orders', label: 'Orders', icon: FiPackage },
    { href: '/account/licenses', label: 'Licenses', icon: FiKey },
  ]

  return (
    <div className="w-full">
      {/* Mobile Navigation */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <span>Account</span>
          </LocalizedClientLink>
        ) : (
          <>
            <WelcomeHeader customerName={`${customer?.first_name} ${customer?.last_name}`} />
            <div className="text-base-regular">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <LocalizedClientLink
                      href={item.href}
                      className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      data-testid={`${item.label.toLowerCase()}-link`}
                    >
                      <div className="flex items-center gap-x-2">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <FiLogOut size={20} />
                      <span>Log out</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden small:block w-full" data-testid="account-nav">
        <WelcomeHeader customerName={customer?.first_name || ''} />
        
        <div className="flex justify-center w-full mb-8">
          <div className="grid grid-cols-6 gap-6">
            {navItems.map((item) => {
              const active = route.split(countryCode)[1] === item.href
              const Icon = item.icon
              
              return (
                <LocalizedClientLink
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center"
                  data-testid={`${item.label.toLowerCase()}-link`}
                >
                  <div
                    className={clx(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors",
                      {
                        "bg-gray-100 text-gray-900 hover:bg-gray-200": !active,
                        "bg-gray-900 text-white": active
                      }
                    )}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className={clx("text-sm", {
                      "text-gray-600": !active,
                      "text-gray-900 font-medium": active
                    })}
                  >
                    {item.label}
                  </span>
                </LocalizedClientLink>
              )
            })}
            
            <button
              onClick={handleLogout}
              className="flex flex-col items-center"
              data-testid="logout-button"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200">
                <FiLogOut size={24} />
              </div>
              <span className="text-sm text-gray-600">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountNav