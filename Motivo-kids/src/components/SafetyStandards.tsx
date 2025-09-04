import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const SafetyStandards: React.FC = () => {
  const { theme } = useTheme();

  const bgMain =
    theme === "light"
      ? "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800"
      : "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200";

  const cardBg =
    theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200";

  const linkColor = theme === "light" ? "text-blue-600" : "text-blue-300";

  return (
    <div className={`min-h-screen py-12 px-6 md:px-20 ${bgMain}`}>
      <div className={`max-w-5xl mx-auto shadow-lg rounded-2xl p-8 ${cardBg}`}>
        <h1 className="text-4xl font-bold mb-8 text-center">Safety Standards</h1>
        <p className="mb-6">
          At <strong>Motivo Kids</strong>, safety is our top priority. We ensure that all products meet strict quality and safety regulations to provide a secure and enjoyable experience for children.
        </p>

        {/* Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Product Testing</h2>
          <p>
            Every toy and product undergoes rigorous testing in accredited labs to ensure compliance with national and international safety standards. This includes tests for:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Choking hazards</li>
            <li>Toxic materials and chemicals</li>
            <li>Durability and structural safety</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Age-Appropriate Labeling</h2>
          <p>
            Each product comes with clear labeling indicating the recommended age group. We ensure that children are not exposed to items unsuitable for their age.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Safe Materials</h2>
          <p>
            All toys are made from non-toxic, BPA-free, and phthalate-free materials. We carefully select suppliers who comply with chemical safety standards to protect children from harmful substances.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Mechanical Safety</h2>
          <p>
            Toys are tested for mechanical safety including sharp edges, pinch points, and small detachable parts. We ensure that all items are designed to prevent accidental injury during normal play.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Electrical Safety</h2>
          <p>
            Any electronic toys or battery-operated products are tested for safe voltage, insulation, and protection against overheating. Batteries are safely enclosed to prevent accidental ingestion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Quality Control</h2>
          <p>
            Before shipping, every product undergoes a strict quality control check to ensure durability, functionality, and overall safety. Only products passing these inspections reach our customers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Packaging Safety</h2>
          <p>
            Packaging is designed to be child-friendly, avoiding plastic bags or small parts that may pose choking hazards. Instructions and warnings are clearly visible on the packaging.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Hygiene Standards</h2>
          <p>
            All products are sanitized and packaged under hygienic conditions to prevent contamination. This includes regular cleaning of production and storage areas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Staff Training</h2>
          <p>
            Our staff is trained in safety protocols, quality checks, and handling of toys to ensure that every product meets the highest safety expectations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">10. Incident Reporting</h2>
          <p>
            Any incidents or safety concerns are immediately documented and addressed. We maintain transparent records and work proactively to prevent similar issues in the future.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">11. Compliance with Standards</h2>
          <p>
            Motivo Kids products comply with relevant national and international safety regulations including:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>IS 9873 (Indian Toy Safety Standards)</li>
            <li>EN 71 (European Toy Safety Standards)</li>
            <li>ASTM F963 (American Toy Safety Standards)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">12. Safe Play Guidelines</h2>
          <p>
            We provide clear instructions and guidelines for safe play. Parents and guardians are encouraged to supervise playtime, especially for younger children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">13. Continuous Improvement</h2>
          <p>
            Safety is an ongoing commitment. We continually update our safety standards based on the latest research, technology, and customer feedback.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">14. Contact for Safety Concerns</h2>
          <p>
            If you notice any safety issues or defects in our products, please contact us immediately at{" "}
            <a href="mailto:support@motivokids.com" className={`${linkColor} underline`}>
              support@motivokids.com
            </a>{" "}
            or call 1-800-MOTIVO-KIDS. Your feedback helps us keep all children safe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">15. Closing Statement</h2>
          <p>
            At Motivo Kids, every child's safety is our responsibility. We pledge to uphold the highest safety standards to create a fun, secure, and educational play experience.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SafetyStandards;
