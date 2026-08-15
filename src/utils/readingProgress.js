const STORAGE_KEY = 'angerit-comics:reading-progress'

function readState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { parts: {} }
  } catch {
    return { parts: {} }
  }
}

function writeState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing and storage quotas should not interrupt reading.
  }
}

export function clearReadingProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Private browsing and storage quotas should not interrupt reading.
  }
}

export function saveReadingProgress(partId, pageOrder) {
  const state = readState()
  const previous = state.parts[partId]
  if (previous?.completed || (previous && pageOrder <= previous.pageOrder)) return

  state.parts[partId] = {
    pageOrder,
    updatedAt: Date.now(),
    completed: false,
  }
  writeState(state)
}

export function completeReadingPart(partId) {
  const state = readState()
  if (!state.parts[partId]) return
  state.parts[partId].completed = true
  state.parts[partId].updatedAt = Date.now()
  writeState(state)
}

export function getLatestUnfinishedProgress() {
  const state = readState()
  return Object.entries(state.parts)
    .filter(([, progress]) => !progress.completed)
    .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
    .map(([partId, progress]) => ({ partId: Number(partId), ...progress }))[0]
}
