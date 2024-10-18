import { useEffect, useState } from "react"

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speechLoaded, setSpeechLoaded] = useState<boolean>(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
      setSpeechLoaded(true)
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  function speak(text: string) {
    if (!voices.length) {
      console.error("No voices found")
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.pitch = 0.5
    utterance.volume = 0.5
    utterance.rate = 1.35

    speechSynthesis.speak(utterance)
  }

  return {
    voices,
    speechLoaded,
    speak
  }
}
