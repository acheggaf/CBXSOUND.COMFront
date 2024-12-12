import { Customer, Order } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"
import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from './styles.module.css'

type OverviewProps = {
  customer: Omit<Customer, "password_hash"> | null
  orders: Order[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressCount = customer?.shipping_addresses?.length || 0

  return (
    <div className={styles.container} data-testid="overview-page-wrapper">
      {/* Header Section */}
      <div className={styles.header}>
        <h1 
          className={styles.welcomeText} 
          data-testid="welcome-message" 
          data-value={customer?.first_name}
        >
          Hello {customer?.first_name}
        </h1>
        <div className={styles.emailText}>
          Signed in as:{" "}
          <span 
            className={styles.emailValue}
            data-testid="customer-email" 
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <h3 className={styles.statTitle}>Profile</h3>
          <div className={styles.statValue}>
            <span 
              className={styles.statNumber}
              data-testid="customer-profile-completion" 
              data-value={profileCompletion}
            >
              {profileCompletion}%
            </span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>

      </div>

      {/* Orders Section */}
      <div className={styles.ordersSection}>
        <h3 className={styles.statTitle}>Recent orders</h3>
        <div className={styles.ordersList} data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <LocalizedClientLink
                key={order.id}
                href={`/account/orders/details/${order.id}`}
                data-testid="order-wrapper"
                data-value={order.id}
              >
                <Container className={styles.orderCard}>
                  <div className={styles.orderGrid}>
                    <div>
                      <div className={styles.orderLabel}>Date placed</div>
                      <div 
                        className={styles.orderValue}
                        data-testid="order-created-date"
                      >
                        {new Date(order.created_at).toDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className={styles.orderLabel}>Order number</div>
                      <div 
                        className={styles.orderValue}
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </div>
                    </div>
                    
                    <div>
                      <div className={styles.orderLabel}>Total amount</div>
                      <div 
                        className={styles.orderValue}
                        data-testid="order-amount"
                      >
                        {formatAmount({
                          amount: order.total,
                          region: order.region,
                          includeTaxes: false,
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className={styles.chevronIcon} 
                    data-testid="open-order-button"
                  >
                    <span className="sr-only">
                      Go to order #{order.display_id}
                    </span>
                    <ChevronDown className="-rotate-90" />
                  </button>
                </Container>
              </LocalizedClientLink>
            ))
          ) : (
            <div className={styles.emptyState} data-testid="no-orders-message">
              No recent orders
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (
  customer: Omit<Customer, "password_hash"> | null
) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  if (customer.billing_address) {
    count++
  }

  return (count / 4) * 100
}

export default Overview