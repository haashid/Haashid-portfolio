import { PortfolioPage } from "@/components/portfolio-page";
import { personJsonLd, websiteJsonLd } from "@/lib/data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <PortfolioPage />
    </>
  );
}
