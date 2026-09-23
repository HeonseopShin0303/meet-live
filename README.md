# Meet Live

Live transcription, translation and speaker separation in the browser. No server:
the page talks to the [Soniox](https://soniox.com) real-time API directly over a
WebSocket, and transcription, translation and speaker labels all arrive on that one
stream.

## Using it

Open the hosted page, paste a Soniox API key once, press **시작**.

The key is stored in the browser that typed it and never appears in the page
source, so this repository can be public and the hosted page can be shared. Anyone
who opens it supplies their own key, and their own account is billed.

Get a key at [console.soniox.com](https://console.soniox.com) → My First Project →
API Keys.

## What it does

- **Speaker separation** — a rail on the right lists every voice as it appears.
  Type a name and it applies to everything that speaker already said.
- **Sentence pairing** — each line of source sits directly above its own
  translation, rather than two separate walls of text.
- **Resumes** — stopping, restarting, or losing the connection continues the same
  transcript instead of starting a blank page. It survives a reload.
- **Export** — Markdown, as source only, translation only, or both.

## Installing on a phone

Open the page and use **홈 화면에 추가** (iOS Safari share menu) or **앱 설치**
(Android Chrome menu). It then runs full screen with its own icon.

## What it cannot do

**Record with the screen off.** Browsers suspend background pages and stop audio
capture; only a native app can hold a microphone open behind a lock screen. The
page requests a screen wake lock while recording, which is as far as a web app can
go — keep it plugged in for a long meeting.

For recording you do not need to watch live, use the phone's own voice recorder and
transcribe the file afterwards. Soniox's async API is cheaper and its speaker
separation is markedly better, because the model sees the whole recording at once
rather than guessing from the last few seconds.

## Cost

Billed per audio to whoever's key is in the browser. Measured against the dashboard
at roughly **$0.20 per hour** with translation on — the published $0.12/hour covers
transcription, and translation doubles the output text tokens.

## Files

| | |
|---|---|
| `index.html` | the whole app |
| `manifest.webmanifest` | name, icon and full-screen behaviour |
| `sw.js` | service worker; makes it installable and loads the shell offline |
| `icon-*.png` | home-screen icons |
