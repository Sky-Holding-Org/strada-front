import { CheckCircle2 } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-linear-to-br from-gray-50 to-white py-12 sm:py-16 text-justify">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              You Need To Know
            </h2>
            <p className="text-lg sm:text-xl font-semibold text-primary">
              Egypt's Real Estate Market is Evolving - Be Part of It
            </p>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none space-y-4 sm:space-y-6 text-gray-700">
            <p className="leading-relaxed">
              At Strada Properties, we connect you with Egypt's most promising
              new real estate launches - whether you're searching for your next
              home or looking for a high-return investment opportunity.
            </p>

            <p className="leading-relaxed">
              Egypt's property market continues to thrive, with new compounds
              and projects being introduced across the country every year. Many
              of the nation's leading developers have expanded their portfolios
              to include innovative communities designed for modern living and
              long-term value.
            </p>

            <p className="leading-relaxed">
              While purchasing in a newly launched project might seem uncertain,
              it's often one of the smartest moves a buyer or investor can make
              - offering early-bird pricing, flexible payment options, and
              exclusive choices.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why Invest in a Newly Launched Compound?
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {[
                "Better pricing and investment value - early buyers benefit from introductory prices and special deals",
                "Prime selection - choose your preferred location, unit view, and layout before the market rush",
                "First-mover privilege - enjoy being among the first to move into a brand-new development",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                What Is an Expression of Interest (EOI)?
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                An Expression of Interest (EOI) is a refundable deposit set by
                the developer to indicate genuine interest in purchasing a unit
                within a new project. This approach gives buyers the opportunity
                to secure the best units and payment plans before the general
                market release.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Best Areas to Buy Property in Egypt
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "New Cairo",
                  "New Capital",
                  "Sheikh Zayed",
                  "6th of October",
                  "New Zayed",
                  "5th Settlement",
                  "Ain Sokhna",
                  "North Coast",
                  "Mostakbal City",
                ].map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-xl p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Next Move Starts with Strada
            </h3>
            <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
              At Strada Properties, we go beyond listings. We offer insight,
              market analysis, and personalized advice to help you make informed
              real estate decisions. Whether you're buying your first home or
              expanding your investment portfolio, our team ensures your journey
              is seamless, transparent, and rewarding.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
