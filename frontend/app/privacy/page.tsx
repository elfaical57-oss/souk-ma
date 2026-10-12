import { Metadata } from "next";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Politique de confidentialité | JemlaMaroc",
  description:
    "Politique de confidentialité de JemlaMaroc : données collectées, utilisation, cookies et publicité.",
  alternates: { canonical: `${BASE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Qui sommes-nous</h2>
            <p>
              JemlaMaroc (« nous », « notre ») est une marketplace de gros qui met en relation des
              acheteurs et des fournisseurs/vendeurs partout au Maroc, accessible à l&apos;adresse{" "}
              <a href={BASE_URL} className="text-primary hover:underline">jemlamaroc.com</a>. Pour toute
              question relative à vos données personnelles, contactez-nous à{" "}
              <a href="mailto:contact@jemlamaroc.com" className="text-primary hover:underline">contact@jemlamaroc.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Données que nous collectons</h2>
            <p className="mb-2">Lorsque vous créez un compte ou utilisez le site, nous pouvons collecter :</p>
            <ul className="list-disc ps-5 space-y-1">
              <li>Votre nom, numéro de téléphone/WhatsApp et ville</li>
              <li>Les informations de votre boutique si vous êtes vendeur (nom commercial, description, logo, produits)</li>
              <li>Les messages échangés via la messagerie du site ou WhatsApp pour vos commandes</li>
              <li>Des données techniques standards (adresse IP, type d&apos;appareil, pages visitées) collectées automatiquement à des fins de sécurité et d&apos;amélioration du service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Comment nous utilisons vos données</h2>
            <ul className="list-disc ps-5 space-y-1">
              <li>Créer et gérer votre compte acheteur ou vendeur</li>
              <li>Vous mettre en relation avec un vendeur/acheteur via WhatsApp pour finaliser une commande</li>
              <li>Afficher votre boutique et vos produits publiquement si vous êtes vendeur</li>
              <li>Améliorer le site, prévenir la fraude et assurer la sécurité de la plateforme</li>
              <li>Vous contacter au sujet de votre compte ou d&apos;une commande</li>
            </ul>
            <p className="mt-2">
              JemlaMaroc ne gère aucun paiement en ligne : les commandes et paiements sont négociés
              directement entre acheteur et vendeur via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Cookies et publicité</h2>
            <p className="mb-2">
              Notre site utilise des cookies et technologies similaires pour assurer son bon
              fonctionnement, mesurer l&apos;audience et, le cas échéant, afficher des publicités.
            </p>
            <p className="mb-2">
              Nous pouvons utiliser des services publicitaires tiers, dont Google AdSense. Google et
              ses partenaires utilisent des cookies (comme le cookie DoubleClick) pour diffuser des
              annonces en fonction de vos visites sur ce site et d&apos;autres sites. Vous pouvez
              désactiver la publicité personnalisée en consultant les{" "}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                paramètres des annonces Google
              </a>, ou via{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.aboutads.info/choices
              </a>{" "}
              pour les autres fournisseurs tiers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Partage des données</h2>
            <p>
              Vos informations de contact (nom, numéro WhatsApp) sont partagées avec un vendeur ou un
              acheteur uniquement dans le cadre d&apos;une mise en relation que vous initiez. Nous ne
              vendons pas vos données personnelles à des tiers. Elles peuvent être partagées avec nos
              prestataires techniques (hébergement, base de données) strictement pour faire fonctionner
              le service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Conservation des données</h2>
            <p>
              Nous conservons vos données aussi longtemps que votre compte est actif. Vous pouvez
              demander la suppression de votre compte et de vos données à tout moment en nous écrivant à{" "}
              <a href="mailto:contact@jemlamaroc.com" className="text-primary hover:underline">contact@jemlamaroc.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Vos droits</h2>
            <p>
              Vous pouvez demander à accéder à vos données, les corriger ou les supprimer en nous
              contactant. Nous répondons à ces demandes dans un délai raisonnable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité. La date de dernière mise à
              jour est indiquée en haut de cette page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
