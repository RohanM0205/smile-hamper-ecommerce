export default function TrustSection() {
    const promises = [
      "Premium Quality Products",
      "Thoughtful Curation",
      "Secure Payments",
      "Dedicated Support",
      "Carefully Assembled Hampers",
    ];
  
    return (
      <section className="py-24 bg-[#f9f6f2]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-[#3f2e22]">
            Our Promise
          </h2>
  
          <ul className="mt-12 space-y-4 text-[#6d4f3b] text-lg">
            {promises.map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }