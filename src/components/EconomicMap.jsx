import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import geoJsonData from '../data/regions-geo.json';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Initialise default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EconomicMap = ({ regionalData }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Style function for regions
  const regionStyle = (feature) => ({
    fillColor: getRegionColor(feature.properties.gdp),
    weight: 2,
    opacity: 1,
    color: '#ffffff',
    fillOpacity: 0.7,
    radius: 8
  });

  // Colour based on GDP
  const getRegionColor = (gdp) => {
    if (!gdp) return '#cccccc';
    return gdp > 500 ? '#4daf4a' : // Green for high GDP
      gdp > 300 ? '#377eb8' : // Blue for medium
        '#e41a1c';              // Red for low
  };

  // Feature interaction handlers
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => setHoveredRegion(feature.properties.name),
      mouseout: () => setHoveredRegion(null),
    });
  };

  return (
    <div className="map-container" style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          data={regionalData}
          style={regionStyle}
          onEachFeature={onEachFeature}
        />

        {hoveredRegion && (
          <Tooltip direction="top" sticky>
          {hoveredRegion}
          </Tooltip>
        )}
      </MapContainer>
    </div>
  );
};

export default EconomicMap;