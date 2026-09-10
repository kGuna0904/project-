import CardGrid from "@/components/CardGrid";
import AsciiCard from "@/components/AsciiCard"
import DonationCard from "@/components/DonationCard";
import NewsletterCard from "@/components/NewsletterCard";
import NavigationBar from "@/components/NavigationBar";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <NavigationBar />
    <div className="px-0 mb-8">
      <Image src="/blog-preview-card-main/assets/images/WelcomeCard.png" alt="Welcome Card" className=" mb-5 w-full h-[800px] object-fit scroll-auto" width={800} height={800} />
    </div>
    <main className="mx-auto max-w-5xl my-auto gap-6">
      <CardGrid id="card-grid" />
      <AsciiCard id="ascii-card" />
      <NewsletterCard id="newsletter-card" />
      <DonationCard id="donation-card" />
    </main>
    </>
  );
}