import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';

// Fix for default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
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

  // Sample GeoJSON - replace with your actual data
  const geoJsonData = {
    type: "FeatureCollection",
    features: regionalData.map(region => ({
      type: "Feature",
      properties: {
        name: region.region,
        gdp: region.gdp,
        inflation: region.inflation
      },
      geometry: {
        type: "Point",
        coordinates: [region.longitude, region.latitude] // Add these to your data
      }
    }))
  };

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
          data={geoJsonData}
          onEachFeature={onEachFeature}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 8,
              fillColor: "#ff7800",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
          }}
        />
        
        {hoveredRegion && (
          <Tooltip 
            position={[
              geoJsonData.features.find(f => f.properties.name === hoveredRegion)?.geometry.coordinates[1],
              geoJsonData.features.find(f => f.properties.name === hoveredRegion)?.geometry.coordinates[0]
            ]}
            permanent={false}
            direction="top"
          >
            <div>
              <h4>{hoveredRegion}</h4>
              <p>GDP: {
                regionalData.find(r => r.region === hoveredRegion)?.gdp || 'N/A'
              }%</p>
              <p>Inflation: {
                regionalData.find(r => r.region === hoveredRegion)?.inflation || 'N/A'
              }%</p>
            </div>
          </Tooltip>
        )}
      </MapContainer>
    </div>
  );
};

export default EconomicMap;