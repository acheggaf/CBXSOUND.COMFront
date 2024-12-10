import { LineItem, Order } from "@medusajs/medusa";
import Image from "next/image";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { fetchLicenses, fetchDownloadLink, addLicense } from "@lib/actions/license-actions";
import { License } from "types/global";
import { medusaClient } from "@lib/config";
import { IconType } from "react-icons";

type DownloadLink = {
  os: string;
  link: string;
};

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
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machineId, setMachineId] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedLicenseId, setCopiedLicenseId] = useState<number | null>(null);

  useEffect(() => {
    async function getLicenses() {
      if (!isExpanded || !item.variant_id) return;

      setIsLoading(true);
      try {
        const { variant } = await medusaClient.products.variants.retrieve(item.variant_id);
        if (variant.product_id) {
          setProductId(variant.product_id);
          const rawDownloadLinks = await fetchDownloadLink(variant.product_id);
          const parsedLinks = JSON.parse(rawDownloadLinks);
          setDownloadLinks(parsedLinks);
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
      setMachineId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate license");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (licenseKey: string, licenseId: number) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopiedLicenseId(licenseId);
      setTimeout(() => setCopiedLicenseId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getOSInfo = (os: string): { name: string; Icon: IconType } => {
    const osLower = os.toLowerCase();
    if (osLower.includes('win')) return { name: 'Windows', Icon: FaWindows };
    if (osLower.includes('mac') || osLower.includes('darwin') || osLower.includes('apple')) return { name: 'macOS', Icon: FaApple };
    if (osLower.includes('linux') || osLower.includes('ubuntu') || osLower.includes('debian')) return { name: 'Linux', Icon: FaLinux };
    return { name: os, Icon: HiDownload };
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
            <div className={styles.downloadGrid}>
              {downloadLinks.map((download, index) => {
                const { name, Icon } = getOSInfo(download.os);
                return (
                  <a
                    key={index}
                    href={download.link}
                    className={styles.downloadButton}
                    download
                  >
                    <Icon className={styles.osIcon} />
                    <span>Download for {name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className={styles.expandedSection}>
            <h3 className={styles.sectionTitle}>Licenses</h3>
            <div className={styles.licensesTable}>
              {isLoading ? (
                <p className={styles.loading}>Loading licenses...</p>
              ) : licenses && licenses.length > 0 ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Machine Name</th>
                      <th>Operating System</th>
                      <th>License Key</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map((license: License) => (
                      <tr key={license.id} className={styles.tableRow}>
                        <td>{license.machinename}</td>
                        <td>{license.machineos}</td>
                        <td className={styles.licenseKeyCell}>
                          <code>{license.licensekey}</code>
                        </td>
                        <td>
                          <button
                            className={styles.copyButton}
                            onClick={() => copyToClipboard(license.licensekey, license.id)}
                          >
                            {copiedLicenseId === license.id ? (
                              <Check className={styles.copyIcon} />
                            ) : (
                              <Copy className={styles.copyIcon} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noLicenses}>No licenses generated yet</p>
              )}
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.machineIdForm}>
                <input
                  type="text"
                  className={styles.machineIdInput}
                  placeholder="Enter Input Key in the software"
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