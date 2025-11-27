<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>FAITH MBTI 신앙 유형 테스트</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <script>
    (function() {
      // 인앱 브라우저 확인 (카카오톡, 네이버, 라인, 인스타그램 등)
      var userAgent = navigator.userAgent.toLowerCase();
      var targetUrl = location.href;

      if (userAgent.match(/kakaotalk|line|inapp|naver|instagram/i)) {
        
        // 1. 안드로이드인 경우: 크롬으로 강제 전환 (intent 사용)
        if (userAgent.match(/android/i)) {
          // 크롬으로 열기 위한 intent 스키마 생성
          // intent://주소#Intent;scheme=https;package=com.android.chrome;end
          var cleanUrl = targetUrl.replace(/https?:\/\//i, '');
          var intentUrl = 'intent://' + cleanUrl + '#Intent;scheme=https;package=com.android.chrome;end';
          
          location.href = intentUrl;
        }
        
        // 2. iOS(아이폰)인 경우:
        // * iOS는 보안 정책상 자동으로 사파리를 띄우는 것을 막고 있습니다.
        // * 따라서 팝업을 띄워 "사파리에서 열기"를 유도하거나, 현재 상태를 유지합니다.
        // * 무리하게 탈출을 시도하면 오히려 에러가 날 수 있어, 안드로이드만 강제 전환하는 것이 일반적입니다.
        else if (userAgent.match(/iphone|ipad|ipod/i)) {
          // 필요하다면 이곳에 "더 나은 환경을 위해 사파리에서 열어주세요" 같은 안내 모달을 띄울 수 있습니다.
          console.log('iOS 인앱 브라우저 감지됨');
        }
      }
    })();
  </script>
