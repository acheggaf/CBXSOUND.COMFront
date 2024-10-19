import { Metadata } from "next"
import styles from "./style.module.css";
import { getFrontpageData } from "@lib/data"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"

export const metadata: Metadata = {
  title: "CBX Sound",
  description: "CBX SOUND provides vst plugins for audio effects and synthesizers.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const { frontpage } = await getFrontpageData(2);
  return (
    <>
      <Hero />
      <div className={styles.featuredProductsContainer}>
        <FeaturedProducts plugins={frontpage} />
      </div>
    </>
  )
}