import { Metadata } from "next";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Mentions légales | JemlaMaroc",
  description: "Mentions légales de la marketplace JemlaMaroc.",
  alternates: { canonical: `${BASE_URL}/legal` },
};

export default function LegalPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Mentions légales</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Éditeur du site</h2>
            <p>
              Le site JemlaMaroc (jemlamaroc.com) est édité par [Raison sociale / Nom du responsable],
              [forme juridique, ex. auto-entrepreneur / SARL], immatriculé(e) au registre du commerce de
              [ville] sous le numéro RC [à compléter], ICE [à compléter], dont le siège est situé à
              [adresse], Maroc.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Contact : <a href="mailto:contact@jemlamaroc.com" className="text-primary hover:underline">contact@jemlamaroc.com</a> — 0629 26 86 42
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
              (vercel.com).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments du site JemlaMaroc (textes, logo, interface) est protégé par le
              droit de la propriété intellectuelle. Les contenus publiés par les vendeurs (photos,
              descriptions) restent leur propriété.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Liens utiles</h2>
            <p>
              <a href="/privacy" className="text-primary hover:underline">Politique de confidentialité</a>
              {" · "}
              <a href="/terms" className="text-primary hover:underline">Conditions d&apos;utilisation</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
