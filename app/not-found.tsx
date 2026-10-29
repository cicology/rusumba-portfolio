import Link from "next/link";
import { Header } from "@/components/story/Header";

export default function NotFound() {
  return (
    <>
      <Header story={false} />
      <main id="main" className="wrap" style={{ padding: "160px 0 80px" }}>
        <h1 className="display display-l" style={{ marginBottom: 20 }}>Nothing here.</h1>
        <p className="text-l">That page does not exist. The record is at <Link href="/work" style={{ textDecoration: "underline" }}>/work</Link>.</p>
      </main>
    </>
  );
}
