let cached: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (cached) return cached
  const voices = window.speechSynthesis?.getVoices?.() ?? []
  cached =
    voices.find((v) => /en[-_]GB/i.test(v.lang)) ??
    voices.find((v) => /en[-_]US/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    null
  return cached
}

export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

/** 用浏览器自带的合成语音朗读，无需任何音频资源或后端 */
export function speak(text: string, rate = 0.95) {
  if (!speechSupported()) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) utter.voice = voice
  utter.lang = voice?.lang ?? 'en-US'
  utter.rate = rate
  window.speechSynthesis.speak(utter)
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // 语音列表在部分浏览器里是异步加载的，加载完要让缓存失效重挑
  window.speechSynthesis.onvoiceschanged = () => {
    cached = null
    pickVoice()
  }
}
