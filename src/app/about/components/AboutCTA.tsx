import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="py-28 bg-[#3f2e22] text-center text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl">
          Ready to Create Something Special?
        </h2>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
          <Link
            href="/hampers"
            className="px-8 py-3 bg-white text-[#3f2e22] rounded-full font-medium"
          >
            Explore Our Hampers
          </Link>

          <Link
            href="/make-your-own"
            className="px-8 py-3 border border-white rounded-full"
          >
            Make Your Own Hamper
          </Link>
        </div>
      </div>
    </section>
  );
}