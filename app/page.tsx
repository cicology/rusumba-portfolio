import { SmoothScroll } from "@/components/SmoothScroll";
import { SceneMount } from "@/components/scene/SceneMount";
import { Header } from "@/components/story/Header";
import { Hero } from "@/components/story/Hero";
import { Load } from "@/components/story/Load";
import { Structure } from "@/components/story/Structure";
import { Record } from "@/components/story/Record";
import { Person } from "@/components/story/Person";
import { Open, Footer } from "@/components/story/Open";
import { projects } from "@/lib/projects";

/**
 * The home page is one story in five chapters, read against a single
 * structure. The camera moves; the structure stays.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SceneMount />
      <Header />
      <main id="main">
        <Hero />
        <Load />
        <Structure />
        <Record projects={projects} />
        <Person />
        <Open />
      </main>
      <Footer />
    </>
  );
}
