import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { CATEGORIES } from '../data/places'

const ICON_FOR = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.icon]))

// divIcon avoids Leaflet's classic "marker images 404 under a bundler" problem
// entirely — no image assets, and we get emoji category pins for free.
function pinIcon(place, { active, isUserAdded }) {
  const icon = ICON_FOR[place.category[0]] ?? '📍'
  return L.divIcon({
    className: '',
    html: `<div class="pin ${active ? 'pin--active' : ''} ${isUserAdded ? 'pin--user' : ''}">
             <span>${icon}</span>
           </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

const meIcon = L.divIcon({
  className: '',
  html: `<div class="me"><div class="me__dot"></div><div class="me__pulse"></div></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function Recenter({ center, radius }) {
  const map = useMap()
  useEffect(() => {
    // Fit the view to the search circle so the radius slider feels connected
    // to the map instead of just filtering the list silently.
    const bounds = L.latLng(center.lat, center.lng).toBounds(radius * 2.2)
    map.flyToBounds(bounds, { duration: 0.6 })
  }, [center.lat, center.lng, radius, map])
  return null
}

function ClickCatcher({ onMapClick, enabled }) {
  useMapEvents({
    click(e) {
      if (enabled) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function MapView({
  center,
  radius,
  results,
  selectedId,
  onSelect,
  pinMode,
  onMapClick,
}) {
  const markers = useMemo(
    () =>
      results.map(({ place }) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={pinIcon(place, {
            active: place.id === selectedId,
            isUserAdded: place.userAdded,
          })}
          eventHandlers={{ click: () => onSelect(place.id) }}
        />
      )),
    [results, selectedId, onSelect]
  )

  return (
    <div className={`map-wrap ${pinMode ? 'map-wrap--pinning' : ''}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        zoomControl={false}
        className="map"
        preferCanvas
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        <Circle
          center={[center.lat, center.lng]}
          radius={radius}
          pathOptions={{ color: '#6ee7b7', weight: 1, fillColor: '#6ee7b7', fillOpacity: 0.06 }}
        />
        <Marker position={[center.lat, center.lng]} icon={meIcon} />
        {markers}
        <Recenter center={center} radius={radius} />
        <ClickCatcher enabled={pinMode} onMapClick={onMapClick} />
      </MapContainer>

      {pinMode && (
        <div className="pin-hint">
          <strong>Tap anywhere on the map</strong> to drop your spot
        </div>
      )}
    </div>
  )
}
