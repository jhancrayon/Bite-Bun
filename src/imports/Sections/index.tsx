import svgPaths from "./svg-1idjfni629";
import { TopNavRedesign } from "../../app/components/top-nav-redesign";
import { NewDishes } from "../../app/components/new-dishes";
import { Promotions } from "../../app/components/promotions";
import { BestSellers } from "../../app/components/best-sellers";
import { FoodCategories } from "../../app/components/food-categories";
import { FeatureHighlights } from "../../app/components/feature-highlights";
import { BlogSection } from "../../app/components/blog-section";
import { SiteFooter } from "../../app/components/site-footer";
import { CtaBanner } from "../../app/components/cta-banner";
import { AppDownload } from "../../app/components/app-download";
import { OrderModeBar } from "../../app/components/order-mode-bar";
import { Reservation } from "../../app/components/reservation";
import { HeroSearch } from "../../app/components/hero-search";
import imgRectangle20 from "./822b1b74ac70e2fc0500c3e2fb8d2188b58d6a55.png";
import imgRectangle334 from "./435f8f6bbf524ed7cf84c5bd22f61d2222b04ecd.png";
import img6B4Ff6C989F7D6932Bcc1C274A132A721 from "./bebab1f164a2923f90420e9feb229f1a5068d0b4.png";

function CnMtChicBurgerNgon({ className }: { className?: string }) {
  return (
    <div className={className || "h-[88px] relative w-[1072px]"} data-name="Cần một chiếc burger ngon?">
      <p className="[word-break:break-word] absolute font-['Source_Sans_Pro:Bold',sans-serif] inset-[0_20.8%_0_0] leading-none not-italic text-[#fcfcfc] text-[88px] text-shadow-[0px_27px_82px_rgba(255,174,0,0.28),0px_14px_15px_rgba(255,174,0,0.01)] whitespace-nowrap">Cắn là mê, thèm là có!</p>
    </div>
  );
}

function Shadow() {
  return (
    <div className="absolute contents left-[4px] top-0" data-name="Shadow">
      <div className="absolute h-[612px] left-[12px] mix-blend-multiply top-0 w-[611px]">
        <div className="absolute inset-[-13.34%_-13.36%]">
          <svg className="block size-full" fill="none" height="775.24" preserveAspectRatio="none" viewBox="0 0 774.24 775.24" width="774.24">
            <g filter="url(#filter0_f_0_488)" id="Ellipse 96" style={{ mixBlendMode: "multiply" }}>
              <ellipse cx="387.12" cy="387.62" fill="#C4C4C4" fillOpacity="0.7" rx="305.5" ry="306" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="775.24" id="filter0_f_0_488" width="774.24" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_0_488" stdDeviation="40.81" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute h-[540px] left-[4px] mix-blend-multiply top-[11px] w-[539px]">
        <div className="absolute inset-[-4.85%_-4.86%]">
          <svg className="block size-full" fill="none" height="592.411" preserveAspectRatio="none" viewBox="0 0 591.411 592.411" width="591.411">
            <g filter="url(#filter0_f_0_501)" id="Ellipse 97" style={{ mixBlendMode: "multiply" }}>
              <ellipse cx="295.706" cy="296.206" fill="url(#paint0_radial_0_501)" fillOpacity="0.8" rx="269.5" ry="270" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="592.411" id="filter0_f_0_501" width="591.411" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_0_501" stdDeviation="13.1028" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(463.138 61.7263 -61.612 463.997 295.706 296.206)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_501" r="1">
                <stop stopColor="#CDCDCD" />
                <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="absolute contents left-[4.35px] top-[-3.21px]" data-name="Overlay">
      <div className="absolute bg-[#c9c9c9] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.489px_-0.209px] mask-size-[497.138px_497.137px] mix-blend-overlay size-[497px] top-[-3px]" style={{ maskImage: `url("${imgRectangle334}")` }} />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute flex h-[505px] items-center justify-center left-[1096px] top-[103px] w-[604px]">
      <div className="-scale-y-100 flex-none rotate-180">
        <div className="h-[505px] relative w-[604px]" data-name="Image">
          <Shadow />
          <Overlay />
          <div className="absolute flex h-[1568px] items-center justify-center left-[-356px] top-[-572px] w-[1218px]">
            <div className="-scale-y-100 flex-none rotate-180">
              <div className="h-[1568px] relative w-[1218px]" data-name="6b4ff6c989f7d6932bcc1c274a132a72 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img6B4Ff6C989F7D6932Bcc1C274A132A721} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start justify-center relative rounded-[16px] shrink-0" data-name="Title">
      <CnMtChicBurgerNgon className="h-[88px] relative shrink-0 w-[1072px]" />
      <p className="[word-break:break-word] font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#504f4f] text-[22px] text-left whitespace-nowrap">Chỉ với vài cú nhấp chuột, tìm các bữa ăn gần bạn dễ dàng</p>
    </div>
  );
}

function Top() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Top">
      <OrderModeBar />
    </div>
  );
}

function Bottom() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Bottom">
      <div className="content-stretch flex flex-col items-start p-[24px] relative size-full">
        <HeroSearch />
      </div>
    </div>
  );
}

function OrderCard() {
  return (
    <div className="content-stretch drop-shadow-[0px_5px_5px_rgba(255,174,0,0.26),0px_20px_20px_rgba(255,174,0,0.29)] flex flex-col items-start overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="Order Card">
      <Top />
      <div className="h-[0.442px] relative shrink-0 w-full" data-name="HR">
        <div className="absolute inset-[-113.2%_0_-113.19%_0]">
          <svg className="block size-full" fill="none" height="1.44174" preserveAspectRatio="none" viewBox="0 0 856.033 1.44174" width="856.033">
            <path d={svgPaths.p204aa800} id="HR" stroke="#EEEEEE" />
          </svg>
        </div>
      </div>
      <Bottom />
    </div>
  );
}

function TitleOrderCard() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-[220px] top-[132px] w-[856px]" data-name="Title + Order Card">
      <Title />
      <OrderCard />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[#fa6932] block h-[642px] left-[-1px] overflow-clip top-[188px] w-[1943px]" data-name="Header">
      <div
        className="pointer-events-none absolute h-[820px] left-[-84px] top-[-16px] w-[2086px] overflow-hidden"
        style={{
          backgroundImage: [
            /* soft sun behind the burger */
            "radial-gradient(1000px 700px at 70% 40%, rgba(255, 248, 224, 0.6) 0%, rgba(255, 248, 224, 0) 66%)",
            /* base brand ramp */
            "linear-gradient(247deg, #f4de79 62%, #fa6932 112%)",
          ].join(", "),
          backgroundColor: "#f4de79",
        }}
        data-name="Group 1 1"
      >
        {/* single wide halo, just enough to seat the burger */}
        <span className="absolute left-[1250px] top-[40px] size-[700px] rounded-full border border-white/20" />

        {/* one warm glow low-left for depth */}
        <span className="absolute left-[-200px] top-[430px] size-[640px] rounded-full bg-[#fa6932] opacity-25 blur-[150px]" />

        {/* gentle cream curve closing the hero */}
        <span
          className="absolute bottom-[-2px] left-0 h-[150px] w-full"
          style={{
            backgroundColor: "#f3f3f3",
            borderTopLeftRadius: "100% 100%",
            borderTopRightRadius: "100% 100%",
          }}
        />
      </div>
      <Image />
      <TitleOrderCard />
    </div>
  );
}

function TopNavHeader() {
  return (
    <div className="h-[840px] overflow-clip relative shrink-0 w-[1920px]" data-name="Top Nav + Header">
      <div className="absolute h-[851px] left-0 top-px w-[1920px]" />
      <div className="absolute bg-[#f4de79] h-[726px] left-0 top-0 w-[1920px]" />
      <div className="absolute h-[566px] left-[-1px] top-[213px] w-[1920px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[106.61%] left-[0.04%] max-w-none top-[-6.62%] w-full" src={imgRectangle20} />
        </div>
      </div>
      <Header />
      <div className="pointer-events-none absolute h-[620px] left-0 mix-blend-darken top-[159px] w-[1919px]" data-name="Background" />
      <TopNavRedesign />
    </div>
  );
}

function FeaturedRestaurant() {
  return <NewDishes />;
}

function SearchByFoodFeaturesAppDownload() {
  return (
    <div className="content-stretch flex flex-col items-stretch justify-center relative shrink-0 w-full" data-name="Search by Food + Features + App Download">
      <FoodCategories />
      <FeatureHighlights />
      <AppDownload />
    </div>
  );
}

function CtaFooter() {
  return (
    <div className="content-stretch flex w-full flex-col items-stretch relative shrink-0" data-name="CTA + Footer">
      <CtaBanner />
      <SiteFooter />
    </div>
  );
}

export default function Sections() {
  return (
    <div className="content-stretch flex flex-col gap-[31px] items-center relative size-full" data-name="Sections">
      <TopNavHeader />
      <Promotions />
      <BestSellers />
      <FeaturedRestaurant />
      <SearchByFoodFeaturesAppDownload />
      <Reservation />
      <BlogSection />
      <CtaFooter />
    </div>
  );
}