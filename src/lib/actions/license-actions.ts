'use server'

import { getLicensesByOrder, getDownloadLink } from "@lib/data"
import { License } from "types/global"
import axios, { AxiosError } from "axios"

export async function fetchLicenses(orderId: string, productId: string) {
  try {
    const licensesData = await getLicensesByOrder(orderId, productId)
    return licensesData
  } catch (error) {
    console.error("Error fetching licenses:", error)
    return null
  }
}

export async function fetchDownloadLink(productId: string) : Promise<string> {
  try {
    const { download_link } = await getDownloadLink(productId)
    return download_link
  } catch (error) {
    console.error("Error fetching Download Link:", error)
    return ""
  }
}

interface LicenseResponse {
  license: License
}

export async function addLicense(orderId: string, productId: string, machineId: string) {
  try {
    const response = await axios.post<LicenseResponse>(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/licenses`, {
      orderid: orderId,
      productid: productId,
      machineid: machineId
    })
    return response.data
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.error || "Failed to generate license")
    }
    throw e
  }
}