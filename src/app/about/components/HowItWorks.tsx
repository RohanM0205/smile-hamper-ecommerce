export default function HowItWorks() {
    const steps = [
      "Choose Your Box",
      "Add Your Favorite Products",
      "Include a Personal Message",
      "We Carefully Pack & Deliver",
    ];
  
    return (
      <section className="py-24 bg-[#f3ede6]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#3f2e22]">
            Create Your Perfect Hamper
          </h2>
  
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-2xl font-serif text-[#8b6b55]">
                  {index + 1}
                </div>
                <p className="mt-4 text-[#3f2e22]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }