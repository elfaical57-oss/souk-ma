import { Metadata } from "next";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de la marketplace JemlaMaroc.",
  alternates: { canonical: `${BASE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Objet</h2>
            <p>
              JemlaMaroc est une marketplace qui met en relation des acheteurs (particuliers,
              revendeurs, professionnels) et des vendeurs/fournisseurs au Maroc. En utilisant le site,
              vous acceptez les présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Rôle de JemlaMaroc</h2>
            <p>
              JemlaMaroc n&apos;est pas vendeur des produits présentés sur la plateforme et n&apos;intervient
              pas dans la transaction, le paiement ou la livraison entre un acheteur et un vendeur. Ces
              échanges sont négociés directement entre les parties, généralement via WhatsApp.
              JemlaMaroc ne gère aucun paiement en ligne.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Compte utilisateur</h2>
            <ul className="list-disc ps-5 space-y-1">
              <li>Vous devez fournir des informations exactes lors de votre inscription</li>
              <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
              <li>Un compte vendeur est soumis à une vérification avant activation</li>
              <li>JemlaMaroc peut suspendre un compte en cas d&apos;usage frauduleux ou abusif</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Obligations des vendeurs</h2>
            <ul className="list-disc ps-5 space-y-1">
              <li>Publier des informations exactes sur leurs produits (prix, quantités minimales, disponibilité)</li>
              <li>Répondre aux acheteurs de bonne foi et honorer les commandes confirmées</li>
              <li>Ne pas publier de produits illégaux, contrefaits ou interdits à la vente</li>
              <li>Respecter la réglementation marocaine applicable à leur activité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Obligations des acheteurs</h2>
            <p>
              Les acheteurs s&apos;engagent à échanger de bonne foi avec les vendeurs et à honorer les
              commandes qu&apos;ils confirment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Contenu publié</h2>
            <p>
              Chaque vendeur reste responsable du contenu (textes, photos) qu&apos;il publie sur sa
              boutique. JemlaMaroc se réserve le droit de retirer tout contenu non conforme à ces
              conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Limitation de responsabilité</h2>
            <p>
              JemlaMaroc met à disposition une plateforme de mise en relation et ne garantit pas la
              qualité, la conformité ou la livraison effective des produits échangés entre utilisateurs.
              Tout litige entre un acheteur et un vendeur doit être réglé directement entre les parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Modifications</h2>
            <p>
              Ces conditions peuvent être mises à jour. Les utilisateurs seront informés de tout
              changement important via le site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">9. Contact</h2>
            <p>
              Pour toute question : <a href="mailto:contact@jemlamaroc.com" className="text-primary hover:underline">contact@jemlamaroc.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
