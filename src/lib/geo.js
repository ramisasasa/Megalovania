// Distance + proximity helpers. No PostGIS needed at this scale — 40-ish places
// filtered client-side is instant, and it keeps the demo dependency-free.

const EARTH_RADIUS_M = 6371000

const toRad = (deg) => (deg * Math.PI) / 180

/** Great-circle distance between two {lat,lng} points, in metres. */
export function distanceMeters(a, b) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

/** "820 m" / "1.4 km" */
export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`
  return `${(meters / 1000).toFixed(1)} km`
}

/** Rough walking time at 5 km/h, rounded to the nearest minute. */
export function walkMinutes(meters) {
  return Math.max(1, Math.round(meters / 83.3))
}

/**
 * Bayesian average — stops a place with one 5-star review from outranking a
 * place with forty 4.6-star reviews. C is how many "average" votes we blend in.
 */
export function bayesianScore(reviews, globalMean = 3.9, C = 6) {
  if (!reviews.length) return globalMean
  const sum = reviews.reduce((acc, r) => acc + r.stars, 0)
  return (C * globalMean + sum) / (C + reviews.length)
}

/** Is the place open at `hour` (0-23)? Handles past-midnight closing times. */
export function isOpenAt(place, hour) {
  const { open, close } = place.hours
  if (close > open) return hour >= open && hour < close
  return hour >= open || hour < close // wraps midnight
}
