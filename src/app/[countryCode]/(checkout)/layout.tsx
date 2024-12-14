import { type ReactNode } from 'react'
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard,
  LockIcon,
} from "lucide-react"

interface CheckoutLayoutProps {
  children: ReactNode
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/80 shadow-sm">
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <LocalizedClientLink
            href="/cart"
            className="group flex items-center gap-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-gray-900"
            data-testid="back-to-cart-link"
          >
            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 transition-all duration-200 group-hover:bg-gray-200">
              <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="hidden sm:block relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gray-900 after:transition-all after:duration-200 group-hover:after:w-full">
              Back to cart
            </span>
            <span className="sm:hidden">Back</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="store-link"
          >
            <div 
              className="bg-[url('/img/cbxlogo.svg')] bg-no-repeat bg-contain bg-center w-[216px] h-6"
              role="img"
              aria-label="CBX Sound Logo"
            />
          </LocalizedClientLink>

          <div className="w-[68px] sm:w-[140px]" aria-hidden="true" />
        </nav>
      </header>

      <main 
        className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8"
        data-testid="checkout-container"
      >
        <div
          className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-6 sm:p-8"
        >
          {children}
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200/80 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-3 text-gray-400">
              <CreditCard className="h-6 w-6" />
              <LockIcon className="h-5 w-5" />
            </div>
            
            <LocalizedClientLink 
              href="/"
              className="group relative text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 flex items-center gap-2"
            >
              <span>
                Powered by CBX Sound
                <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-200 group-hover:w-full" />
              </span>
            </LocalizedClientLink>
          </div>
        </div>
      </footer>

      {/* Modern loading overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
          <span className="text-sm text-gray-600">Processing your purchase...</span>
        </div>
      </div>
    </div>
  );
}