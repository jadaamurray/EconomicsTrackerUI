// tests/EconomicMap.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import EconomicMap from '../components/EconomicMap';
import { vi } from 'vitest';
import L from 'leaflet';

// Mock react-leaflet components to avoid rendering actual maps
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer"></div>,
  GeoJSON: ({ data, style, onEachFeature }) => (
    <div 
      data-testid="geojson-layer"
      data-region-count={data?.features?.length || 0}
      onClick={() => onEachFeature?.(
        { properties: { name: 'Test Region', gdp: 400 } }, 
        { on: vi.fn() }
      )}
    />
  ),
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
  useMap: () => ({ flyTo: vi.fn() })
}));

// Mock Leaflet and its icon
vi.mock('leaflet', () => ({
  icon: vi.fn(() => 'mocked-icon'),
  Marker: {
    prototype: {
      options: {}
    }
  },
  map: vi.fn()
}));

// Mock geoJSON data
vi.mock('../data/regions-geo.json', () => ({
  features: [
    {
      properties: { name: 'Region 1', gdp: 450 },
      geometry: { type: 'Polygon', coordinates: [] }
    },
    {
      properties: { name: 'Region 2', gdp: 250 },
      geometry: { type: 'Polygon', coordinates: [] }
    }
  ]
}));

describe('EconomicMap Component', () => {
  const mockRegionalData = {
    features: [
      {
        properties: { name: 'Test Region 1', gdp: 500 },
        geometry: { type: 'Polygon', coordinates: [] }
      },
      {
        properties: { name: 'Test Region 2', gdp: 200 },
        geometry: { type: 'Polygon', coordinates: [] }
      }
    ]
  };

  it('renders the map container with base layers', () => {
    render(<EconomicMap regionalData={mockRegionalData} />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('geojson-layer')).toBeInTheDocument();
  });

  it('displays the correct number of regions', () => {
    render(<EconomicMap regionalData={mockRegionalData} />);
    const geoJsonLayer = screen.getByTestId('geojson-layer');
    expect(geoJsonLayer.getAttribute('data-region-count')).toBe('2');
  });

  it('applies correct styling based on GDP values', () => {
    // Create a test instance of the component
    const { regionStyle } = EconomicMap({ regionalData: mockRegionalData }).type;
    
    // Test high GDP
    expect(regionStyle({ properties: { gdp: 600 } }))
      .toEqual(expect.objectContaining({ fillColor: '#4daf4a' }));
    
    // Test medium GDP
    expect(regionStyle({ properties: { gdp: 400 } }))
      .toEqual(expect.objectContaining({ fillColor: '#377eb8' }));
    
    // Test low GDP
    expect(regionStyle({ properties: { gdp: 200 } }))
      .toEqual(expect.objectContaining({ fillColor: '#e41a1c' }));
    
    // Test missing GDP
    expect(regionStyle({ properties: {} }))
      .toEqual(expect.objectContaining({ fillColor: '#cccccc' }));
  });

  it('handles region hover interactions', () => {
    render(<EconomicMap regionalData={mockRegionalData} />);
    
    // Simulate hovering over a region
    const geoJsonLayer = screen.getByTestId('geojson-layer');
    fireEvent.click(geoJsonLayer);
    
    // Verify tooltip appears
    expect(screen.getByTestId('tooltip')).toHaveTextContent('Test Region');
  });

  it('initializes Leaflet marker icon correctly', () => {
    render(<EconomicMap regionalData={mockRegionalData} />);
    
    // Verify Leaflet icon was configured
    expect(L.icon).toHaveBeenCalledWith({
      iconUrl: expect.any(String),
      shadowUrl: expect.any(String),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  });
});