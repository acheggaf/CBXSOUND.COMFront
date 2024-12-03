// src/modules/account/components/license-details.tsx
"use client"

import { useState } from "react"
import { Order } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { ArrowLeft } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { License } from "types/global"


interface LicenseForm {
  machineId: string
  lineItemId: string
}

export default function LicenseDetails({ 
  order, 
  initialLicenses 
}: { 
  order: Order
  initialLicenses: License[]
}) {
  const [licenses, setLicenses] = useState<License[]>(initialLicenses)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LicenseForm>()

  const onSubmit = async (data: LicenseForm) => {
    try {
      const response = await fetch("/api/store/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          orderId: order.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const newLicense = await response.json()
      setLicenses(prev => [...prev, newLicense.license])
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate license")
    }
  }

  const getLicensesForItem = (itemId: string) => {
    return licenses.filter(license => license.lineItemId === itemId)
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center gap-x-4">
        <LocalizedClientLink
          href="/account/licenses"
          className="flex items-center gap-x-2 text-gray-700"
        >
          <ArrowLeft/>
          <span>Back to Orders</span>
        </LocalizedClientLink>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl-semi mb-4">Order #{order.display_id}</h2>
        
        {error && (
          <div className="bg-red-100 p-4 rounded text-red-900 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-y-4">
          {order.items.map((item) => {
            const itemLicenses = getLicensesForItem(item.id)
            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-large-semi">{item.title}</h3>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedItem(
                      selectedItem === item.id ? null : item.id
                    )}
                  >
                    {selectedItem === item.id ? 'Hide Licenses' : 'View Licenses'}
                  </Button>
                </div>

                {selectedItem === item.id && (
                  <div className="mt-4">
                    <div className="mb-4">
                      <h4 className="text-base-semi mb-2">Existing Licenses ({itemLicenses.length}/5)</h4>
                      {itemLicenses.length > 0 ? (
                        <div className="flex flex-col gap-y-2">
                          {itemLicenses.map((license) => (
                            <div
                              key={license.id}
                              className="border rounded p-3 flex flex-col gap-y-1"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">Machine ID:</span>
                                <span>{license.machineId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">License Key:</span>
                                <span className="font-mono">{license.licenseKey}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Generated:</span>
                                <span>
                                  {new Date(license.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No licenses generated yet.</p>
                      )}
                    </div>

                    {itemLicenses.length < 5 && (
                      <div className="mt-6">
                        <h4 className="text-base-semi mb-2">Generate New License</h4>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="flex flex-col gap-y-4"
                        >
                          <input
                            type="hidden"
                            {...register("lineItemId")}
                            value={item.id}
                          />
                          <div>
                            <label className="text-base-regular">Machine ID</label>
                            <input
                              className="w-full p-2 border rounded mt-1"
                              {...register("machineId", {
                                required: "Machine ID is required",
                              })}
                              placeholder="Enter your machine ID"
                            />
                            {errors.machineId && (
                              <p className="text-rose-500 text-small-regular mt-1">
                                {errors.machineId.message}
                              </p>
                            )}
                          </div>
                          <Button type="submit" className="w-full">
                            Generate License
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}