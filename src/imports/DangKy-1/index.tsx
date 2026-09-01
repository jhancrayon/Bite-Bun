import svgPaths from "./svg-mjht0ppxmz";
import imgLgPng1 from "./708659b660ec65772cdba16b60cb8bdea47e2645.png";

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#364153] text-[0px] top-[-0.2px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <span className="leading-[1.4] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Họ và Tên `}</span>
        <span className="leading-[1.4] text-[#fb2c36] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          *
        </span>
      </p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0 w-[384.8px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[18px] text-[rgba(10,10,10,0.5)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          Nguyễn Văn A
        </p>
      </div>
      <div aria-hidden className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[14.8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[49.6px] relative shrink-0 w-full" data-name="Container">
      <TextInput />
      <Icon />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[77.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#364153] text-[0px] top-[-0.2px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <span className="leading-[1.4] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Email `}</span>
        <span className="leading-[1.4] text-[#fb2c36] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          *
        </span>
      </p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0 w-[400px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[18px] text-[rgba(10,10,10,0.5)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          example@gmail.com
        </p>
      </div>
      <div aria-hidden className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[14.8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d={svgPaths.pd919a80} id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[49.6px] relative shrink-0 w-full" data-name="Container">
      <EmailInput />
      <Icon1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[77.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Container3 />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#364153] text-[0px] top-[-0.2px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <span className="leading-[1.4] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Số điện thoại `}</span>
        <span className="leading-[1.4] text-[#fb2c36] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          *
        </span>
      </p>
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0 w-[384.8px]" data-name="Phone Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[18px] text-[rgba(10,10,10,0.5)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          0901 234 567
        </p>
      </div>
      <div aria-hidden className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[14.8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g clipPath="url(#clip0_0_6)" id="Icon">
          <path d={svgPaths.p1a7ce800} id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_0_6">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[49.6px] relative shrink-0 w-full" data-name="Container">
      <PhoneInput />
      <Icon2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[77.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <Container5 />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#364153] text-[0px] top-[-0.2px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <span className="leading-[1.4] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Mật khẩu `}</span>
        <span className="leading-[1.4] text-[#fb2c36] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          *
        </span>
      </p>
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0 w-[400px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[18px] text-[rgba(10,10,10,0.5)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          ••••••••
        </p>
      </div>
      <div aria-hidden className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[14.8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[49.6px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput />
      <Icon3 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[77.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <Container7 />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#364153] text-[0px] top-[-0.2px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <span className="leading-[1.4] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Xác nhận mật khẩu `}</span>
        <span className="leading-[1.4] text-[#fb2c36] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          *
        </span>
      </p>
    </div>
  );
}

function PasswordInput1() {
  return (
    <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0 w-[384.8px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[18px] text-[rgba(10,10,10,0.5)] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          ••••••••
        </p>
      </div>
      <div aria-hidden className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[14.8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[49.6px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput1 />
      <Icon4 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[77.6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <Container9 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[52px] relative rounded-[10px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(220.1540571315105deg, rgb(255, 174, 0) 63.845%, rgb(255, 138, 0) 111.94%)" }} data-name="Button">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Source_Sans_Pro:Bold',sans-serif] leading-none left-[200px] not-italic text-[18px] text-center text-white top-[16.6px] whitespace-nowrap">ĐĂNG KÝ</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[39px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[0] left-[192.5px] not-italic text-[#6a7282] text-[0px] text-center top-[-0.4px] w-[384px]">
        <span className="leading-[1.4] text-[14px]">{`Bằng việc đăng ký, bạn đã đồng ý với `}</span>
        <span className="leading-[1.4] text-[#ffae00] text-[14px]">Điều khoản sử dụng</span>
        <span className="leading-[1.4] text-[14px]">{` và `}</span>
        <span className="leading-[1.4] text-[#ffae00] text-[14px]">Chính sách bảo mật</span>
        <span className="leading-[1.4] text-[14px]">{` của Nhã Uyên`}</span>
      </p>
    </div>
  );
}

function Form() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[16px] h-[609px] items-start left-1/2 pt-[24px] px-[24px] rounded-[20px] top-[139px] w-[448px]" style={{ backgroundImage: "linear-gradient(215.44467475357771deg, rgba(255, 174, 0, 0) 28.756%, rgba(255, 138, 0, 0.15) 85.295%)" }} data-name="Form">
      <Container />
      <Container2 />
      <Container4 />
      <Container6 />
      <Container8 />
      <Button />
      <Paragraph />
    </div>
  );
}

function MauSauCh() {
  return (
    <div className="absolute gap-y-[120px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[53px] left-0 top-[86px] w-[448px]" data-name="màu sau chữ">
      <button className="block col-1 cursor-pointer justify-self-stretch relative row-1 self-stretch shrink-0" style={{ backgroundImage: "linear-gradient(-1.3242832338999904deg, rgba(255, 174, 0, 0) 18.201%, rgba(255, 138, 0, 0) 176.68%)" }} />
      <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" style={{ backgroundImage: "linear-gradient(-1.3242832338999904deg, rgba(255, 174, 0, 0) 18.201%, rgba(255, 138, 0, 0.45) 176.68%)" }} />
    </div>
  );
}

function Container10() {
  return (
    <div className="col-1 content-stretch flex flex-col h-[33px] items-center justify-center relative row-1 shrink-0 w-[112px]" data-name="Container">
      <p className="[word-break:break-word] font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#364153] text-[22px] whitespace-nowrap">Đăng nhập</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="col-2 content-stretch flex h-[33px] items-center justify-center relative row-1 shrink-0 w-[112px]" data-name="Container">
      <p className="[word-break:break-word] font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#364153] text-[22px] whitespace-nowrap">Đăng Ký</p>
    </div>
  );
}

function Form1() {
  return (
    <div className="absolute gap-x-[120px] gap-y-[120px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] left-0 px-[52px] py-[10px] top-[86px] w-[448px]" data-name="Form">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[68px]">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="-scale-y-100 flex-none rotate-180 w-full">
          <div className="aspect-[68/69] relative size-full" data-name="LG PNG 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[100.32%] left-[-2.7%] max-w-none top-[-0.16%] w-[105.88%]" src={imgLgPng1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
            <path d="M13 1L1 13" id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
            <path d="M1 1L13 13" id="Vector" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <button className="content-stretch cursor-pointer flex flex-col items-center justify-center relative shrink-0 size-[24px]" data-name="Button">
      <Icon5 />
    </button>
  );
}

function TopLogo() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.87)] content-stretch drop-shadow-[0px_5px_5px_rgba(255,174,0,0.08),0px_20px_20px_rgba(255,174,0,0.05)] flex gap-[323px] h-[85px] items-center justify-center left-0 p-[16px] right-0 top-px" data-name="top logo">
      <Frame />
      <Button1 />
    </div>
  );
}

export default function DangKy() {
  return (
    <div className="bg-white overflow-clip relative rounded-[20px] size-full" data-name="Đăng ký">
      <Form />
      <MauSauCh />
      <Form1 />
      <TopLogo />
    </div>
  );
}