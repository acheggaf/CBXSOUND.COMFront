"use client"

import { Popover, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import { User } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import { 
  FiUser,
  FiGrid,
  FiLogOut,
} from "react-icons/fi"
import { signOut } from "@modules/account/actions"
import { Customer } from "@medusajs/medusa"
import { fetchCustomerData } from "@lib/actions/cutomers";

const UserDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [customer, setCustomer] = useState<Omit<Customer, "password_hash"> | null>(null)
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()

  const updateCustomerData = async () => {
    try {
      const customerData = await fetchCustomerData()
      setCustomer(customerData)
    } catch (error) {
      console.error("Error getting customer data:", error)
      setCustomer(null)
    }
  }

  useEffect(() => {
    updateCustomerData()
  }, [])

  const handleMouseEnter = async () => {
    if (customer) {
      setDropdownOpen(true)
    }
    await updateCustomerData()
  }

  const handleMouseLeave = () => {
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    try {
      await signOut(countryCode)
      setCustomer(null)
      setDropdownOpen(false)
      router.push(`/${countryCode}`)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Not logged in - simple link with adjusted icon position
  if (!customer) {
    return (
      <LocalizedClientLink 
        href="/account"
        className="h-full flex items-center"
        onMouseEnter={handleMouseEnter}
      >
        <div className="transform -translate-y-0.25">
          <User size={20} />
        </div>
      </LocalizedClientLink>
    )
  }

  // Logged in - dropdown menu with adjusted icon position
  return (
    <div 
      className="h-full z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Popover className="relative h-full">
        <Popover.Button className="h-full">
          <div className="hover:text-ui-fg-base relative inline-flex items-center">
            <div className="transform -translate-y-0.25">
              <User size={20} />
            </div>
          </div>
        </Popover.Button>
        <Transition
          show={dropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[200px] text-ui-fg-base shadow-lg rounded-b-md"
          >
            <div className="py-2">
              <LocalizedClientLink
                href="/account/profile"
                className="px-4 py-2 flex items-center gap-x-2 w-full hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <FiUser className="text-gray-600" size={16} />
                <span>Profile</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/account/orders"
                className="px-4 py-2 flex items-center gap-x-2 w-full hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <FiGrid className="text-gray-600" size={16} />
                <span>Products</span>
              </LocalizedClientLink>

              <button
                className="px-4 py-2 flex items-center gap-x-2 w-full hover:bg-gray-50 text-left"
                onClick={handleLogout}
              >
                <FiLogOut className="text-gray-600" size={16} />
                <span>Log out</span>
              </button>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default UserDropdown