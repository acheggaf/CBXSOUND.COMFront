'use server'

import { getLicensesByOrder, getDownloadLink } from "@lib/data"

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