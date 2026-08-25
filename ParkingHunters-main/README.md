# ParkingHunters
대구 주차장 탐색 앱

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