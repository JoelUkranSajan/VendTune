import Papa from "papaparse";

const getTaxiZones = async () => {
  const response = await fetch("/taxi_zone.csv");
  const csvData = await response.text();
  const parsedData = Papa.parse(csvData, { header: true }).data;
  const geoJsonFeatures = parsedData
    .map((row) => {
      const feature = parseMultipolygon(row);
      if (feature) {
        return feature;
      }
      return null;
    })
    .filter((feature) => feature !== null);

  return { type: "FeatureCollection", features: geoJsonFeatures };
};

const parseMultipolygon = (data) => {
  if (!data.geometry) return null;

  const regex = /(-?\d+\.\d+)\s+(-?\d+\.\d+)/g;
  const multipolygonMatches = data.geometry.match(/\(\(\(.*?\)\)\)/g);

  if (!multipolygonMatches) return null;

  const coordinates = multipolygonMatches.map((polygon) => {
    const ringMatches = polygon.match(/\(\(.*?\)\)/g);
    return ringMatches.map((ring) => {
      const coords = [];
      let match;
      while ((match = regex.exec(ring)) !== null) {
        coords.push([parseFloat(match[1]), parseFloat(match[2])]);
      }
      return coords;
    });
  });

  const zone = data.zone;
  const zone_id = data.location_id;

  const center_cor = calculateCentroid(coordinates);

  return {
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: coordinates,
      center_cor: center_cor,
      multipolygon: coordinates,
      zone: zone,
      zone_id: zone_id
    },
  };
};

const calculateCentroid = (coordinates) => {
  let totalArea = 0;
  let centroidX = 0;
  let centroidY = 0;

  coordinates.forEach(polygon => {
    polygon.forEach(ring => {
      const ringArea = calculateRingArea(ring);
      const ringCentroid = calculateRingCentroid(ring, ringArea);

      centroidX += ringCentroid[0] * ringArea;
      centroidY += ringCentroid[1] * ringArea;
      totalArea += ringArea;
    });
  });

  return [centroidX / totalArea, centroidY / totalArea];
};

const calculateRingArea = (ring) => {
  let area = 0;
  for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    area += (xj * yi - xi * yj);
  }
  return area / 2;
};

const calculateRingCentroid = (ring, ringArea) => {
  let cx = 0;
  let cy = 0;
  let factor;

  for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    factor = (xj * yi - xi * yj);
    cx += (xi + xj) * factor;
    cy += (yi + yj) * factor;
  }

  factor = 1 / (6 * ringArea);
  return [cx * factor, cy * factor];
};

export default getTaxiZones;
