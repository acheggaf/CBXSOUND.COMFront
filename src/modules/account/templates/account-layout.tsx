import React from "react"
import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { Customer } from "@medusajs/medusa"
import { HelpCircle } from "lucide-react"

interface AccountLayoutProps {
  customer: Omit<Customer, "password_hash"> | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-white via-gray-50 to-blue-50 py-8 sm:py-12" data-testid="account-page">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Account Navigation */}
          {customer && (
            <div className="rounded-xl bg-white shadow-sm border border-gray-200/80 p-4">
              <AccountNav customer={customer} />
            </div>
          )}

          {/* Main Content */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-200/80 p-6 sm:p-8">
            <div className="animate-[fadeIn_0.5s_ease-out]">
              {children}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm border border-gray-200/80 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <HelpCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Need Assistance?
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Find answers to common questions in our customer service section.
                    We're here to help you get the most out of your plugins.
                  </p>
                </div>
              </div>
              
              <div className="group relative self-start sm:self-center">
                <UnderlineLink href="/customer-service">
                  <div className="flex items-center gap-2">
                    <span>Visit Customer Service</span>
                  </div>
                </UnderlineLink>
                <div className="absolute inset-0 -z-10 bg-blue-500/10 rounded-full blur-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout