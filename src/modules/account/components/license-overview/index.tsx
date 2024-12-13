"use client"

import { useEffect, useState } from "react"
import { medusaClient } from "@lib/config"
import { Button } from "@modules/common/components/custom-button"
import { useForm } from "react-hook-form"

interface License {
  id: string
  orderId: string
  licenseKey: string
  machineId: string
  date: string
}

interface LicenseForm {
  machineId: string
  orderId: string
}

const LicenseOverview = () => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LicenseForm>()

  const fetchLicenses = async (orderId: string) => {
    try {
      const response = await fetch(`/api/store/licenses?orderId=${orderId}`)
      const data = await response.json()
      setLicenses(data.licenses)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch licenses")
      setLoading(false)
    }
  }

  const onSubmit = async (data: LicenseForm) => {
    try {
      const response = await fetch("/api/store/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      // Refresh licenses list
      fetchLicenses(data.orderId)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate license")
    }
  }

  return (
    <div className="flex flex-col gap-y-8">
      {error && (
        <div className="bg-red-100 p-4 rounded text-red-900 mb-4">
          {error}
        </div>
      )}
      
      {/* License List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl-semi mb-4">Your Licenses</h2>
        {loading ? (
          <div className="text-center">Loading licenses...</div>
        ) : licenses.length > 0 ? (
          <div className="flex flex-col gap-y-4">
            {licenses.map((license) => (
              <div
                key={license.id}
                className="border rounded p-4 flex flex-col gap-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Machine ID:</span>
                  <span className="text-gray-700">{license.machineId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">License Key:</span>
                  <span className="text-gray-700 font-mono">{license.licenseKey}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Generated:</span>
                  <span className="text-gray-700">
                    {new Date(license.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No licenses found for this order.</p>
        )}
      </div>

      {/* New License Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl-semi mb-4">Generate New License</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
          <div>
            <label className="text-base-semi">Machine ID</label>
            <input
              className="w-full p-2 border rounded mt-2"
              {...register("machineId", { required: "Machine ID is required" })}
              placeholder="Enter your machine ID"
            />
            {errors.machineId && (
              <p className="text-red-500 text-small-regular mt-1">
                {errors.machineId.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-base-semi">Order ID</label>
            <input
              className="w-full p-2 border rounded mt-2"
              {...register("orderId", { required: "Order ID is required" })}
              placeholder="Enter your order ID"
            />
            {errors.orderId && (
              <p className="text-red-500 text-small-regular mt-1">
                {errors.orderId.message}
              </p>
            )}
          </div>
          <Button
            className="w-full mt-2"
            type="submit"
          >
            Generate License
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LicenseOverview