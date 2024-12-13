import { Order } from "@medusajs/medusa"
import { Heading } from "@medusajs/ui"
import { cookies } from "next/headers"
import styles from './styles.module.css'
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"

type OrderCompletedTemplateProps = {
  order: Order
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const isOnboarding = cookies().get("_medusa_onboarding")?.value === "true"

  return (
  <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div className={styles.orderContainer} data-testid="order-complete-container">
          <div className={styles.summaryContainer}>
            <OrderDetails order={order} />
            <div className="mt-8">
              <h2 className={styles.summaryTitle}>Summary</h2>
              <Items items={order.items} region={order.region} />
              <CartTotals data={order} />
              <PaymentDetails order={order} />
              <Help />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
