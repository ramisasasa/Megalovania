import { useEffect, useMemo, useState, useCallback } from 'react'
import BottomNav from './components/BottomNav'
import LoginGate from './components/LoginGate'
import PlaceDetail from './components/PlaceDetail'
import AddSpotModal from './components/AddSpotModal'
import HomeScreen from './screens/HomeScreen'
import AskScreen from './screens/AskScreen'
import ExploreScreen from './screens/ExploreScreen'
import SavedScreen from './screens/SavedScreen'
import ProfileScreen from './screens/ProfileScreen'
import EditProfileScreen from './screens/EditProfileScreen'
import InterestsScreen from './screens/InterestsScreen'
import SettingsScreen from './screens/SettingsScreen'
import { SEED_PLACES, CITY } from './data/places'
import { searchPlaces, runNaturalSearch } from './lib/search'
import { distanceMeters, bayesianScore } from './lib/geo'
import { loadState, saveState, resetState } from './lib/store'

const BASE_FILTERS = { categories: [], maxBudget: 3500, openNow: false, tags: [] }

/** Which bottom-nav tab should light up for a given screen. */
const TAB_FOR = {
  home: 'home', explore: 'explore', ask: 'ask', saved: 'saved',
  profile: 'profile', settings: 'profile', editProfile: 'profile', interests: 'profile',
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [gateDismissed, setGateDismissed] = useState(false)
  const [screen, setScreen] = useState('home')

  const [userLocation, setUserLocation] = useState(CITY.center)
  const [locStatus, setLocStatus] = useState('locating')
  const [radius, setRadius] = useState(state.settings.proximity)
  const [filters, setFilters] = useState(BASE_FILTERS)

  const [answer, setAnswer] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [aiResults, setAiResults] = useState(null)

  const [selectedId, setSelectedId] = useState(null)
  const [pinMode, setPinMode] = useState(false)
  const [pendingCoords, setPendingCoords] = useState(null)

  const hour = new Date().getHours()

  useEffect(() => saveState(state), [state])

  // Settings is the source of truth for range; Explore can override per-session.
  useEffect(() => setRadius(state.settings.proximity), [state.settings.proximity])

  // Location is required by the product, but a denied prompt or a bad fix must
  // never brick the demo — fall back to the campus centroid.
  useEffect(() => {
    if (!navigator.geolocation) return setLocStatus('unavailable')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus('live')
      },
      () => setLocStatus('fallback'),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  const allPlaces = useMemo(() => {
    const byPlace = state.reviews.reduce((acc, r) => {
      ;(acc[r.placeId] ||= []).push(r)
      return acc
    }, {})
    return [...SEED_PLACES, ...state.userPlaces].map((p) => ({
      ...p,
      reviews: [...(byPlace[p.id] ?? []), ...p.reviews],
    }))
  }, [state.reviews, state.userPlaces])

  const effectiveFilters = useMemo(
    () => ({ ...filters, openNow: filters.openNow || state.settings.openOnly }),
    [filters, state.settings.openOnly]
  )

  const ctx = useMemo(
    () => ({ userLocation, radius, filters: effectiveFilters, hour }),
    [userLocation, radius, effectiveFilters, hour]
  )

  const browseResults = useMemo(() => searchPlaces(allPlaces, ctx), [allPlaces, ctx])
  const results = aiResults ?? browseResults

  /** Interest-weighted picks for the home screen. */
  const forYou = useMemo(() => {
    const interests = state.user?.interests ?? []
    if (!interests.length) return []
    return searchPlaces(allPlaces, {
      userLocation, radius, hour,
      filters: { ...BASE_FILTERS, categories: interests },
    }).slice(0, 6)
  }, [allPlaces, state.user, userLocation, radius, hour])

  const nearby = useMemo(
    () => searchPlaces(allPlaces, { userLocation, radius, hour, filters: BASE_FILTERS })
      .sort((a, b) => a.dist - b.dist),
    [allPlaces, userLocation, radius, hour]
  )

  const savedResults = useMemo(
    () => state.favourites
      .map((id) => allPlaces.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => ({
        place: p,
        dist: distanceMeters(userLocation, p),
        stars: bayesianScore(p.reviews),
        open: true,
      })),
    [state.favourites, allPlaces, userLocation]
  )

  const selected = useMemo(() => {
    const hit = allPlaces.find((p) => p.id === selectedId)
    return hit ? { ...hit, __dist: distanceMeters(userLocation, hit) } : null
  }, [allPlaces, selectedId, userLocation])

  // ── Actions ───────────────────────────────────────────────────────────────

  const runSearch = useCallback(
    (q) => {
      setScreen('ask')
      setThinking(true)
      setAnswer(null)
      setState((s) => ({ ...s, recents: [q, ...s.recents.filter((r) => r !== q)].slice(0, 8) }))

      // Small delay so Sans visibly "thinks" instead of the UI snapping.
      setTimeout(() => {
        const { results: r, answer: a, radius: newRadius } = runNaturalSearch(q, allPlaces, ctx)
        if (newRadius !== radius) setRadius(newRadius)
        setAiResults(a.unknown ? null : r)
        setAnswer(a)
        setThinking(false)
      }, 500)
    },
    [allPlaces, ctx, radius]
  )

  function clearSearch() { setAiResults(null); setAnswer(null) }

  function openPlace(id) {
    setSelectedId(id)
    setState((s) => ({ ...s, visits: { ...s.visits, [id]: (s.visits[id] ?? 0) + 1 } }))
  }

  function toggleFavourite(id) {
    setState((s) => ({
      ...s,
      favourites: s.favourites.includes(id)
        ? s.favourites.filter((f) => f !== id)
        : [id, ...s.favourites],
    }))
  }

  function addReview({ stars, body }) {
    if (!state.user || !selected) return
    setState((s) => ({
      ...s,
      reviews: [{
        placeId: selected.id,
        user: s.settings.anonymous ? 'Anonymous' : s.user.name,
        userEmail: s.user.email,
        stars, body,
        date: new Date().toISOString().slice(0, 10),
      }, ...s.reviews],
      user: { ...s.user, points: s.user.points + 10 },
    }))
  }

  function addSpot(spot) {
    const place = { ...spot, id: `u${Date.now()}`, userAdded: true, reviews: [] }
    setState((s) => ({
      ...s,
      userPlaces: [place, ...s.userPlaces],
      user: s.user ? { ...s.user, points: s.user.points + 25 } : s.user,
    }))
    setPendingCoords(null)
    setPinMode(false)
    clearSearch()
    setSelectedId(place.id)
  }

  function openCategory(id) {
    clearSearch()
    setFilters({ ...BASE_FILTERS, categories: [id] })
    setScreen('explore')
  }

  function hardReset() {
    resetState()
    setState(loadState())
    setGateDismissed(false)
    setScreen('home')
  }

  // ── Gates ─────────────────────────────────────────────────────────────────

  if (!state.user && !gateDismissed) {
    return (
      <div className="frame"><div className="phone">
        <LoginGate
          onSignIn={(user) => { setState((s) => ({ ...s, user })); setScreen('home') }}
          onSkip={() => setGateDismissed(true)}
        />
      </div></div>
    )
  }

  if (state.user && !state.user.onboarded) {
    return (
      <div className="frame"><div className="phone">
        <header className="topbar"><div className="topbar__title">MEGALOVANIA</div></header>
        <InterestsScreen
          user={state.user}
          firstRun
          onSave={(interests) =>
            setState((s) => ({ ...s, user: { ...s.user, interests, onboarded: true } }))}
        />
      </div></div>
    )
  }

  // ── Screens ───────────────────────────────────────────────────────────────

  const screens = {
    home: (
      <HomeScreen
        user={state.user}
        hour={hour}
        recents={state.recents}
        forYou={forYou}
        nearby={nearby}
        onNavigate={setScreen}
        onAsk={runSearch}
        onCategory={openCategory}
        onSelectPlace={openPlace}
      />
    ),
    explore: (
      <ExploreScreen
        userLocation={userLocation}
        radius={radius}
        setRadius={(r) => { setRadius(r); clearSearch() }}
        filters={filters}
        setFilters={(f) => { setFilters(f); clearSearch() }}
        results={results}
        selectedId={selectedId}
        onSelect={openPlace}
        pinMode={pinMode}
        setPinMode={setPinMode}
        onMapClick={setPendingCoords}
      />
    ),
    ask: (
      <AskScreen
        answer={answer}
        thinking={thinking}
        onSearch={runSearch}
        onClear={clearSearch}
        onSelect={openPlace}
        area={state.user?.area ?? CITY.area}
        recents={state.recents}
      />
    ),
    saved: <SavedScreen results={savedResults} onSelect={openPlace} onNavigate={setScreen} />,
    profile: (
      <ProfileScreen
        user={state.user}
        reviews={state.reviews}
        userPlaces={state.userPlaces}
        favourites={state.favourites}
        places={allPlaces}
        onEdit={() => setScreen('editProfile')}
        onInterests={() => setScreen('interests')}
        onSettings={() => setScreen('settings')}
        onSelectPlace={openPlace}
        onSignIn={() => setGateDismissed(false)}
      />
    ),
    editProfile: state.user && (
      <EditProfileScreen
        user={state.user}
        onSave={(user) => setState((s) => ({ ...s, user }))}
        onBack={() => setScreen('profile')}
      />
    ),
    interests: state.user && (
      <InterestsScreen
        user={state.user}
        onSave={(interests) => {
          setState((s) => ({ ...s, user: { ...s.user, interests } }))
          setScreen('profile')
        }}
        onBack={() => setScreen('profile')}
      />
    ),
    settings: (
      <SettingsScreen
        settings={state.settings}
        setSettings={(fn) => setState((s) => ({ ...s, settings: fn(s.settings) }))}
        favourites={state.favourites}
        places={allPlaces}
        onSelectPlace={openPlace}
        onRemoveFavourite={toggleFavourite}
        onBack={() => setScreen('profile')}
        onReset={hardReset}
      />
    ),
  }

  const TITLES = {
    settings: 'SETTINGS', editProfile: 'EDIT PROFILE', interests: 'INTERESTS',
  }

  return (
    <div className="frame">
      <div className="phone">
        <header className="topbar">
          <div className="topbar__title">{TITLES[screen] ?? 'MEGALOVANIA'}</div>
          <div className="topbar__row">
            <div className="topbar__loc">
              <span className="soul soul--pulse" />
              <span>
                {locStatus === 'live' ? 'live · ' : ''}
                <b>{state.user?.area ?? CITY.area}</b>
              </span>
            </div>
            <div className="topbar__actions">
              <button className="iconbtn" title="Settings" onClick={() => setScreen('settings')}>⚙</button>
              <button className="iconbtn" title="Profile" onClick={() => setScreen('profile')}>
                {state.user?.avatar ?? '💀'}
              </button>
            </div>
          </div>
        </header>

        {/* `||` not `??` — guest-only screens evaluate to false, not undefined,
            and `??` would render the blank instead of falling back home. */}
        {screens[screen] || screens.home}

        <BottomNav
          tab={TAB_FOR[screen] ?? 'home'}
          onChange={(t) => { setScreen(t); setSelectedId(null) }}
        />

        {selected && (
          <div className="drawer">
            <PlaceDetail
              place={selected}
              userLocation={userLocation}
              hour={hour}
              user={state.user}
              isFavourite={state.favourites.includes(selected.id)}
              onToggleFavourite={toggleFavourite}
              onClose={() => setSelectedId(null)}
              onReview={addReview}
            />
          </div>
        )}

        {pendingCoords && (
          <AddSpotModal
            coords={pendingCoords}
            onCancel={() => { setPendingCoords(null); setPinMode(false) }}
            onSave={addSpot}
          />
        )}
      </div>
    </div>
  )
}
