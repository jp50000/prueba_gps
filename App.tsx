import 'react-native-gesture-handler';
import React from 'react';
import MapView from 'react-native-maps';

function App() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={true}
    />
  );
}

export default App;