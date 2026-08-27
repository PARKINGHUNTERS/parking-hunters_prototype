# ParkingHunters

대구 주차 — 목적지 주변 주차공간 찾기

## 이 앱은

대구에 사는 사람이나 여행객이 목적지 근처에 어떤 주차장이 있는지 몰라서 갓길에 세우는 일을
막기 위해 만들었습니다. 현재 위치나 검색한 목적지를 기준으로 가까운 주차장을 실시간으로
찾아 보여줍니다.

## 주요 기능

- 현재 위치 또는 검색한 목적지 주변 주차장을 거리순으로 조회
- 대구시 실시간 혼잡도 / 잔여 주차면수 (지원 주차장 한정)
- 공영·민영, 무료·유료, 전기차 충전, 장애인 전용 등 조건 필터
- 즐겨찾기 등록, 최근 검색어
- 목소리로 목적지 검색 (음성인식)
- 카카오맵 기반 지도 보기 / 리스트 보기
- 길찾기 (카카오내비 연동 — Flutter 앱에서는 인앱 내비게이션)
- 한국어/영어, 라이트/다크 테마

## 구성

- `app/` — Next.js 웹앱 (Vercel 배포, 실제 서비스 화면)
- `mobile/` — Flutter 앱. 위 웹앱을 WebView로 띄우고, 위치 권한/음성인식/인앱 내비게이션/
  로컬 DB(즐겨찾기·최근 검색어) 같은 네이티브 기능을 브릿지로 붙여준다.

## 데이터 출처

- 공공데이터포털 — 전국주차장정보표준데이터 (경상북도 등 대구시 API가 다루지 않는 지역)
- 대구광역시 통합주차정보시스템 — 주차장 기본정보 + 실시간 혼잡도
- 카카오맵 — 지도, 장소 검색, 길찾기

## Vercel 환경변수 설정

Vercel 프로젝트 → Settings → Environment Variables에서 아래 항목을 추가한다. 실제 값은
비밀번호 관리 도구(1Password 등)나 팀 채널에서 확인 — 이 파일에는 절대 실제 키를 적지
않는다 (이 리포지토리는 public).

| Key | 설명 |
| --- | --- |
| `FIXIE_URL` | 고정 IP 프록시 URL (`http://proxyuser:<비밀번호>@<host>:<port>`) |
| `DAEGU_PARKING_INFO_KEY` | 대구시 주차장 기본정보 API 키 |
| `DAEGU_PARKING_CONGESTION_KEY` | 대구시 실시간 혼잡도 API 키 |
| `DATA_GO_KR_PARKING_SERVICE_KEY` | 공공데이터포털 전국주차장정보표준데이터 API 키 |
| `KAKAO_REST_API_KEY` | 카카오 REST API 키 |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript 키 (Web 플랫폼에 배포 도메인 등록 필요) |

Environment는 Production/Preview/Development 다 체크한다. 저장 후 Deployments 탭에서
Redeploy를 눌러야 적용된다.