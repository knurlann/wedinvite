import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import Countdown from "@/components/Countdown";
import EventDetails from "@/components/EventDetails";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      <Invitation />
      <Countdown />
      <EventDetails />
      <RsvpForm />
      <Footer />
    </main>
  );
}
