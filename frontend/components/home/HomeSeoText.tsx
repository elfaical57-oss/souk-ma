import Link from "next/link";
import { CATEGORIES, citySlug } from "@/lib/catalog";

const HOME_CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];

export default function HomeSeoText({ lang = "fr" }: { lang?: "fr" | "ar" }) {
  const isArabic = lang === "ar";

  return (
    <section className="container py-10 max-w-3xl">
      <div className="prose-sm text-gray-600 leading-relaxed space-y-4 text-sm">
        {isArabic ? (
          <p>
            جملة ماروك هي سوق إلكتروني للبيع بالجملة يربط مباشرة بين الموزعين والتجار والمحترفين
            وموردين مغاربة، بدون وسيط. وباعتبارها سوق جملة إلكتروني في المغرب، تعتمد المنصة على
            مبدأ بسيط: البحث عن مورد، والتفاوض معه مباشرة عبر واتساب، والطلب بسعر الجملة. سواء
            كنت تاجرًا في الدار البيضاء، أو حرفيًا في مراكش، أو تبدأ نشاط إعادة بيع من أي مدينة في
            المملكة، فإن كل مورد مسجل في جملة ماروك يملك متجره الخاص بمنتجاته ومدينته وبيانات
            التواصل عبر واتساب.
          </p>
        ) : (
          <p>
            JemlaMaroc est une marketplace de vente en gros qui connecte directement revendeurs,
            commerçants et professionnels à des fournisseurs marocains, sans intermédiaire. En tant
            que grossiste en ligne au Maroc, la plateforme centralise l&apos;achat en gros au Maroc
            autour d&apos;un principe simple : trouver un fournisseur, négocier directement par
            WhatsApp, et commander au prix de gros. Que vous soyez commerçant à Casablanca, artisan
            à Marrakech ou que vous démarriez une activité de revente depuis n&apos;importe quelle
            ville du Royaume, chaque fournisseur référencé sur JemlaMaroc dispose de sa propre
            boutique avec ses produits, sa ville et ses coordonnées WhatsApp.
          </p>
        )}

        {/* Rest of the text stays in the HTML for crawlers either way —
            <details> just lets visitors collapse it instead of the page
            always showing the full 450-word block. */}
        <details className="group space-y-4 [&_p]:mt-4">
          <summary className="list-none cursor-pointer inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
            <span className="group-open:hidden">{isArabic ? "اقرأ المزيد ↓" : "Lire plus ↓"}</span>
            <span className="hidden group-open:inline">{isArabic ? "عرض أقل ↑" : "Lire moins ↑"}</span>
          </summary>

          {isArabic ? (
            <>
              <p>
                يشمل الكتالوج ثماني فئات رئيسية: الإلكترونيات، الموضة والملابس، المنزل والديكور،
                المواد الغذائية، السيارات والدراجات النارية، الفلاحة، مواد البناء، والصناعة
                التقليدية المغربية. يحدد كل مورد بنفسه الكمية الدنيا للطلب وأسعاره التنازلية وشروط
                التوصيل، وتُذكر مباشرة في كل بطاقة منتج - فلا توجد قاعدة موحدة تفرضها المنصة، مما
                يترك مرونة سواء للموزع الصغير الذي يجرب أول طلبية أو للتاجر الذي يشتري بكميات
                كبيرة طوال السنة.
              </p>
              <p>
                تاريخيًا، كانت تجارة الجملة في المغرب تتمحور حول أسواق فعلية مثل درب عمر بالدار
                البيضاء، المرجع الأساسي للمنسوجات والموضة بالجملة. تستلهم جملة ماروك من هذا النموذج
                وتنقله إلى الإنترنت، في شكل سوق جملة إلكتروني يمكن الوصول إليه من الهاتف، دون تنقل
                ودون وسيط، مع إمكانية التوصيل المباشر إلى مدينتك أينما كانت في المغرب.
              </p>
              <p>
                كيف تطلب بالجملة على جملة ماروك؟ يكفي تصفح فئة أو مدينة، وفتح بطاقة منتج أو مورد
                يهمك، ثم التواصل معه مباشرة عبر واتساب للتفاوض حول الكمية والسعر وشروط التوصيل. لا
                حاجة لأي تسجيل للشراء - الموردون فقط من ينشئون حساب متجر، وكل تبادل يتم بعد ذلك
                مباشرة بين المشتري والبائع، بكل شفافية في الأسعار والشروط.
              </p>
              <p>
                ينضم موردون جدد بانتظام إلى المنصة من مختلف جهات المغرب. إذا كنت تاجر جملة أو
                مستوردًا أو مُصنّعًا وتبحث عن قناة إضافية للبيع لموزعين في جميع أنحاء البلاد، فإن{" "}
                <Link href="/vendre" className="text-primary font-semibold hover:underline">
                  التسجيل كمورد في جملة ماروك
                </Link>{" "}
                مجاني ويستغرق بضع دقائق فقط: أنشئ متجرك، أضف منتجك الأول، ويتم تفعيل حسابك تلقائيًا
                - دون انتظار موافقة يدوية أو دفع رسوم تسجيل.
              </p>
              <p>
                تعمل جملة ماروك إذن كسوق جملة إلكتروني في المغرب، حيث يبقى كل مورد قابلاً للتواصل
                المباشر، بدون رسوم أو وسيط خفي. وللعثور بسرعة على ما تبحث عنه، تصفح الفئات -{" "}
                {CATEGORIES.map((c, i) => (
                  <span key={c.slug}>
                    <Link href={`/products/categorie/${c.slug}`} className="text-primary hover:underline">
                      {c.labelAr}
                    </Link>
                    {i < CATEGORIES.length - 1 ? "، " : ""}
                  </span>
                ))}
                {" "}- أو مباشرة حسب المدينة:{" "}
                {HOME_CITIES.map((city, i) => (
                  <span key={city}>
                    <Link href={`/products/ville/${citySlug(city)}`} className="text-primary hover:underline">
                      {city}
                    </Link>
                    {i < HOME_CITIES.length - 1 ? "، " : ""}
                  </span>
                ))}
                .
              </p>
            </>
          ) : (
            <>
              <p>
                Le catalogue couvre huit grandes catégories : électronique, mode et vêtements, maison et
                décoration, alimentation, auto et moto, agriculture, matériaux BTP et artisanat marocain.
                Chaque fournisseur fixe sa propre quantité minimale de commande, ses tarifs dégressifs et
                ses conditions de livraison, indiqués directement sur chaque fiche produit - il
                n&apos;y a pas de règle unique imposée par la plateforme, ce qui laisse de la souplesse
                aussi bien au petit revendeur qui teste une première commande qu&apos;au commerçant qui
                achète en volume toute l&apos;année.
              </p>
              <p>
                Historiquement, le commerce de gros au Maroc s&apos;est organisé autour de marchés
                physiques comme Derb Omar à Casablanca, référence incontournable pour le textile et la
                mode en gros. JemlaMaroc s&apos;inspire de ce modèle et le transpose en ligne, sous la
                forme d&apos;un grossiste en ligne accessible depuis un téléphone, sans se déplacer et
                sans passer par un intermédiaire, avec souvent la possibilité de se faire livrer
                directement dans sa ville, où qu&apos;elle se trouve au Maroc.
              </p>
              <p>
                Comment commander en gros sur JemlaMaroc ? Il suffit de parcourir une catégorie ou une
                ville, d&apos;ouvrir la fiche d&apos;un produit ou d&apos;un fournisseur qui vous
                intéresse, puis de le contacter directement par WhatsApp pour négocier quantité, prix et
                modalités de livraison. Aucune inscription n&apos;est nécessaire pour acheter - seuls
                les fournisseurs créent un compte boutique, et chaque échange se fait ensuite directement
                entre l&apos;acheteur et le vendeur, en toute transparence sur les prix et les
                conditions.
              </p>
              <p>
                De nouveaux fournisseurs rejoignent régulièrement la plateforme dans différentes régions
                du Maroc. Si vous êtes grossiste, importateur ou fabricant et que vous cherchez un canal
                supplémentaire pour vendre à des revendeurs partout au pays,{" "}
                <Link href="/vendre" className="text-primary font-semibold hover:underline">
                  devenir fournisseur sur JemlaMaroc
                </Link>{" "}
                est gratuit et prend quelques minutes : créez votre boutique, ajoutez votre premier
                produit, et votre compte est automatiquement activé - sans attendre de validation
                manuelle ni payer de frais d&apos;inscription.
              </p>
              <p>
                JemlaMaroc fonctionne ainsi comme un grossiste Maroc en ligne, où chaque fournisseur
                Maroc reste joignable directement, sans frais ni intermédiaire caché. Pour trouver
                rapidement ce que vous cherchez, parcourez les catégories -{" "}
                {CATEGORIES.map((c, i) => (
                  <span key={c.slug}>
                    <Link href={`/products/categorie/${c.slug}`} className="text-primary hover:underline">
                      {c.label}
                    </Link>
                    {i < CATEGORIES.length - 1 ? ", " : ""}
                  </span>
                ))}
                {" "}- ou directement par ville :{" "}
                {HOME_CITIES.map((city, i) => (
                  <span key={city}>
                    <Link href={`/products/ville/${citySlug(city)}`} className="text-primary hover:underline">
                      {city}
                    </Link>
                    {i < HOME_CITIES.length - 1 ? ", " : ""}
                  </span>
                ))}
                .
              </p>
            </>
          )}
        </details>
      </div>
    </section>
  );
}
