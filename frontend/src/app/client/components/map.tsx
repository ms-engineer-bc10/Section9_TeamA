import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  name: string;
  location: Location;
}

interface MapComponentProps {
  places: Place[];
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

// 一旦東京駅を基準に地図表示。userが選択したlocationを中心にできるよう要修正
const center = {
  lat: 35.681236,
  lng: 139.767125,
};

const MapComponent: React.FC<MapComponentProps> = ({ places }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, // 環境変数からAPIキーを取得
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12} 
    >
      {places.map((place, index) => (
        <Marker
          key={index}
          position={place.location} 
          title={place.name}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
