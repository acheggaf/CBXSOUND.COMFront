import { LineItem, Order } from "@medusajs/medusa";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { fetchLicenses, fetchDownloadLink, addLicense } from "@lib/actions/license-actions";
import { License } from "types/global";
import { medusaClient } from "@lib/config";

type LicenseOrderItemProps = {
  item: LineItem;
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
};

export function LicenseOrderItem({
  item,
  order,
  isExpanded,
  onToggle,
}: LicenseOrderItemProps) {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machineId, setMachineId] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getLicenses() {
      if (!isExpanded || !item.variant_id) return;

      setIsLoading(true);
      try {
        const { variant } = await medusaClient.products.variants.retrieve(item.variant_id);
        if (variant.product_id) {
          setProductId(variant.product_id);
          const download_link = await fetchDownloadLink(variant.product_id);
          setDownloadLink(download_link);
          const data = await fetchLicenses(order.id, variant.product_id);
          if (data?.licenses) {
            setLicenses(data.licenses);
          }
        }
      } catch (error) {
        console.error("Error fetching licenses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getLicenses();
  }, [isExpanded, item.variant_id, order.id]);

  const generateLicense = async () => {
    if (!machineId.trim()) {
      setError("Machine ID is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addLicense(order.id, productId, machineId);
      setLicenses((prev) => [...prev, response.license]);
      setError(null);
      setMachineId(""); // Clear the input field
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate license");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.licenseCard}>
      <div
        className={styles.licenseHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
      >
        <div className={styles.licenseContent}>
          <div className={styles.imageContainer}>
            <Image
              src={item.thumbnail || "/placeholder-image.png"}
              alt={item.title}
              width={160}
              height={284}
              sizes="80px"
              quality={100}
              priority
              unoptimized
              className={styles.productImage}
            />
          </div>

          <div className={styles.detailsContainer}>
            <h2 className={styles.productTitle}>{item.title}</h2>
            <p className={styles.downloadText}>
              Download your plugin / Generate a license
            </p>
          </div>

          <div className={styles.purchaseDate}>
            <span>Purchase date: {new Date(order.created_at).toLocaleString()}</span>
            {isExpanded ? (
              <ChevronUp className={styles.chevron} />
            ) : (
              <ChevronDown className={styles.chevron} />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionTitle}>Downloads</h3>
            <button className={styles.downloadButton}>
              <a href={downloadLink}>Download Latest Version</a>
            </button>
          </div>

          <div className={styles.expandedSection}>
            <h3 className={styles.sectionTitle}>Licenses</h3>
            <div className={styles.licensesList}>
              {isLoading ? (
                <p className={styles.loading}>Loading licenses...</p>
              ) : licenses && licenses.length > 0 ? (
                licenses.map((license: License) => (
                  <div key={license.id} className={styles.licenseItem}>
                    <span>{license.licensekey}</span>
                  </div>
                ))
              ) : (
                <p className={styles.noLicenses}>No licenses generated yet</p>
              )}
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.machineIdForm}>
                <input
                  type="text"
                  className={styles.machineIdInput}
                  placeholder="Enter Machine ID"
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                />
                <button
                  className={styles.generateButton}
                  onClick={generateLicense}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Generating..." : "Generate New License"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
