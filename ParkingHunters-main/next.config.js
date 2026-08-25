/** @type {import('next').NextConfig} */

// 클라이언트에서 실제로 로드하는 외부 호스트만 허용한다(app/lib/kakao.ts의 dapi.kakao.com
// SDK, app/lib/navi.ts의 map.kakao.com 길찾기 링크). *.daumcdn.net / *.kakaocdn.net은
// 카카오맵 SDK가 내부적으로 불러오는 타일 이미지/리소스 도메인이다 — 정확한 서브도메인은
// 브라우저로 직접 확인해야 하므로, 알려진 카카오 인프라 도메인 계열로 허용해 뒀다.
// 지도가 깨지거나 콘솔에 CSP 위반이 찍히면 이 목록을 넓혀야 한다.
// Next.js dev 모드는 webpack HMR이 모든 모듈을 eval()로 감싸서 실행하므로, 개발 중에는
// 'unsafe-eval'이 없으면 클라이언트 JS 전체가 CSP에 막혀 버튼 등 상호작용이 죽는다.
// 프로덕션 빌드는 이 devtool을 쓰지 않으므로 배포본에는 'unsafe-eval'을 넣지 않는다.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "https://dapi.kakao.com",
  "https://*.daumcdn.net",
  "https://*.kakaocdn.net",
  ...(process.env.NODE_ENV !== "production" ? ["'unsafe-eval'"] : []),
].join(" ");

const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.daumcdn.net https://*.kakaocdn.net https://*.kakao.com",
  "font-src 'self' data:",
  "connect-src 'self' https://dapi.kakao.com https://*.daumcdn.net https://*.kakaocdn.net",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // 카카오맵 SDK(v4.5.x) 로더가 일부 서브리소스(mapjsapi 등)를 http://로 하드코딩해서
  // 불러온다. http 스킴 자체를 허용 목록에 추가하는 대신, 브라우저가 요청을 https로
  // 자동 승격하도록 해서 기존 https 허용 목록만으로 통과되게 한다.
  "upgrade-insecure-requests",
];

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: CSP_DIRECTIVES.join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
