"use client"

import {
  useSearchParams,
  useRouter,
  usePathname,
  useParams,
} from "next/navigation"
import { Cart, Customer } from "@medusajs/medusa"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text, useToggleState } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"

import BillingAddress from "../billing_address"
import ShippingAddress from "../shipping-address"
import { setAddresses } from "../../actions"
import { SubmitButton } from "../submit-button"
import { useFormState } from "react-dom"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"

const Addresses = ({
  cart,
  customer,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  customer: Omit<Customer, "password_hash"> | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const countryCode = params.countryCode as string

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsShipping, toggle: toggleSameAsShipping } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useFormState(setAddresses, null)

  // Custom form action wrapper to handle the country code
  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result == null) {
      router.push(`/${countryCode}/checkout?step=payment`)
    }
    return result
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Billing Address
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.billing_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={handleSubmit}>
        <div className="pb-8">
          <BillingAddress cart={cart} countryCode={countryCode} />

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={toggleSameAsShipping}
                id="same-as-billing"
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="ml-2 text-base text-gray-700">
                Same as billing address
              </span>
            </label>
          </div>

          {!sameAsShipping && (
            <div className="mt-6">
              <Heading
                level="h2"
                className="text-3xl-regular gap-x-4 pb-6"
              >
                Shipping address
              </Heading>

              <ShippingAddress
                customer={customer}
                countryCode={countryCode}
                cart={cart}
                checked={sameAsShipping}
                onChange={toggleSameAsShipping}
              />
            </div>
          )}
          
          <input type="hidden" name="countryCode" value={countryCode} />
          
          <SubmitButton className="mt-6" data-testid="submit-address-button">
            Continue to delivery
          </SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </div>
      </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div className="flex flex-col w-1/3" data-testid="billing-address-summary">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Billing Address
                    </Text>
                    {cart.billing_address && (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.first_name}{" "}
                          {cart.billing_address.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.address_1}{" "}
                          {cart.billing_address.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.postal_code},{" "}
                          {cart.billing_address.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col w-1/3" data-testid="billing-contact-summary">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Contact
                    </Text>
                    {cart.billing_address && (
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.billing_address.phone}
                      </Text>
                    )}
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div className="flex flex-col w-1/3" data-testid="shipping-address-summary">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Shipping Address
                    </Text>

                    {sameAsShipping ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Shipping and billing address are the same.
                      </Text>
                    ) : (
                      cart.shipping_address && (
                        <>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.shipping_address.first_name}{" "}
                            {cart.shipping_address.last_name}
                          </Text>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.shipping_address.address_1}{" "}
                            {cart.shipping_address.address_2}
                          </Text>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.shipping_address.postal_code},{" "}
                            {cart.shipping_address.city}
                          </Text>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.shipping_address.country_code?.toUpperCase()}
                          </Text>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses