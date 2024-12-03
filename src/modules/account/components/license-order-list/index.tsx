import { Order } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function LicenseOrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="flex flex-col gap-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <LocalizedClientLink
            href={`/account/licenses/${order.id}`}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl-semi">Order #{order.display_id}</h3>
              <span className="text-small-regular text-gray-700">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-x-4">
                  <div className="flex-1">
                    <p className="text-base-regular">{item.title}</p>
                    <p className="text-small-regular text-gray-700">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </LocalizedClientLink>
        </div>
      ))}
    </div>
  )
}