import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';

function App() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Función para solicitar permisos en Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'Esta app necesita acceso a tu ubicación',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Obtener la ubicación actual
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Configurar el watcher para actualizaciones en tiempo real
  const watchLocation = () => {
    return Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Actualizar cada 10 metros
        interval: 5000, // Intervalo mínimo entre actualizaciones (ms)
        fastestInterval: 2000, // Intervalo más rápido que puede recibir actualizaciones
      },
    );
  };

  useEffect(() => {
    let watchId;
    
    const initLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
        watchId = watchLocation();
      }
    };

    initLocation();

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <MapView
      style={{flex: 1}}
      region={currentLocation}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={true}
    />
  );
}

export default App;