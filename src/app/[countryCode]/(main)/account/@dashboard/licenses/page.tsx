import { Metadata } from "next"
import { listCustomerOrders } from "@lib/data"
import { notFound } from "next/navigation"
import LicenseOrderList from "@modules/account/components/license-order-list"

export const metadata: Metadata = {
  title: "Licenses",
  description: "Manage your plugin licenses and activations.",
}

export default async function Licenses() {
  const orders = await listCustomerOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="licenses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Plugin Licenses</h1>
        <p className="text-base-regular">
          View and manage licenses for your purchased plugins. Each plugin can be activated on up to 3 machines.
        </p>
      </div>
      <div>
        <LicenseOrderList orders={orders} />
      </div>
    </div>
  )
}