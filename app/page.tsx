import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Invitation from "@/components/Invitation";
import PhotoDivider from "@/components/PhotoDivider";
import EventDetails from "@/components/EventDetails";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Hero />
      <Countdown />
      <PhotoDivider imageUrl="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" />
      <Invitation />
      <PhotoDivider imageUrl="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80" />
      <EventDetails />
      <PhotoDivider imageUrl="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80" />
      <RsvpForm />
      <Footer />
    </main>
  );
}
