import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import { ShoppingBag, ArrowRight } from "lucide-react"

const EmptyCartMessage = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
      data-testid="empty-cart-message"
    >
      {/* Animated Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-100/50" />
        <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-full p-6 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Heading with gradient */}
      <Heading
        level="h1"
        className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4"
      >
        Your Cart is Empty
      </Heading>

      {/* Descriptive text */}
      <Text className="text-lg text-gray-600 max-w-md mb-8">
        You don&apos;t have anything in your cart yet. Let&apos;s find the perfect plugin for your sound.
      </Text>

      {/* Enhanced call-to-action */}
      <div className="relative group">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-sm transition-all duration-200 group-hover:shadow-md">
          <InteractiveLink href="/store">
            <div className="flex items-center gap-2">
              <span>Explore Plugins</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </InteractiveLink>
        </div>
        
        {/* Subtle hover effect */}
        <div className="absolute inset-0 -z-10 bg-blue-500/10 rounded-full blur-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(0,0,255,0.02)_0,rgba(255,255,255,0)_100%)]" />
    </div>
  )
}

export default EmptyCartMessage