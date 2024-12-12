'use server'

import { getCustomer } from "@lib/data"

export async function fetchCustomerData() {
  try {
    const customer = await getCustomer()
    return customer
  } catch (error) {
    console.error("Error fetching customer data:", error)
    return null
  }
}