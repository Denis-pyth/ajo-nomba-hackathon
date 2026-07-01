import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { MacStudioMockup } from "./components/MacStudioMockup";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white min-h-full">
      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 gap-8 md:gap-14">
        <Nav />
        <Hero />
        <MacStudioMockup />
      </main>
    </div>
  );
}
