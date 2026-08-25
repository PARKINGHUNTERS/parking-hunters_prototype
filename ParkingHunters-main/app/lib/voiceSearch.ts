"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

// 브라우저 Web Speech API(SpeechRecognition)의 공식 TS 타입이 lib.dom에 아직
// 포함돼 있지 않아(크롬 계열만 webkitSpeechRecognition으로 구현), 실제로 쓰는
// 부분만 최소로 선언한다.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

export interface UseVoiceSearchOptions {
  /** BCP-47 언어 태그. 기본값 한국어(ko-KR). */
  lang?: string;
  onResult: (transcript: string) => void;
  /** 브라우저 미지원 / 마이크 권한 거부 / 인식 실패 시 보여줄 안내 메시지 콜백. */
  onError: (message: string) => void;
  unavailableMessage: string;
}

export interface VoiceSearchController {
  /** 이 브라우저가 음성인식을 지원하는지 — 마이크 버튼 자체를 숨기지 않고, 눌렀을 때만 안내한다. */
  isSupported: boolean;
  isListening: boolean;
  toggle: () => void;
}

// 검색창의 마이크 버튼에서 쓰는 훅. Web Speech API를 그대로 감싸서, 결과 텍스트를
// 콜백(onResult)으로 넘긴다 — 검색창에 텍스트를 채운 뒤 어떤 흐름을 탈지는 호출부
// (page.tsx의 runSearch)가 기존 텍스트 검색과 동일하게 그대로 재사용한다.
export function useVoiceSearch({
  lang = "ko-KR",
  onResult,
  onError,
  unavailableMessage,
}: UseVoiceSearchOptions): VoiceSearchController {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const isSupported =
    typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    // 언마운트 시 인식이 계속 마이크를 붙잡고 있지 않도록 정리한다.
    return () => recognitionRef.current?.stop();
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      onError(unavailableMessage);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) onResult(transcript);
    };
    // 'not-allowed'/'service-not-allowed'는 마이크 권한 거부, 그 외(no-speech,
    // network, aborted 등)도 사용자 입장에선 똑같이 "음성인식 실패"라 안내를 통일한다.
    recognition.onerror = () => {
      onError(unavailableMessage);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      onError(unavailableMessage);
    }
  }, [isListening, lang, onError, onResult, unavailableMessage]);

  return { isSupported, isListening, toggle };
}
