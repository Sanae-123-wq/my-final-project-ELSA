import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useLanguage } from '../context/LanguageContext';

const locations = [
    {
        name: "Patisserie Tafarnout",
        lat: 30.4217,
        lng: -9.5981,
    },
    {
        name: "Patisserie O ‘Plaza",
        lat: 30.4344,
        lng: -9.5855,
    },
    {
        name: "Patisserie Amoud",
        lat: 30.4147,
        lng: -9.5898,
    },
    {
        name: "ELSA Main Workshop",
        lat: 30.4278,
        lng: -9.5981,
    }
];

const MapSection = () => {
    const mapRef = useRef(null);
    const { t, language } = useLanguage();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fallback for missing translations to prevent crash
        if (!t || !t.map) return;

        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
            version: "weekly",
        });

        loader.load().then((google) => {
            try {
                if (!mapRef.current) return;

                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: 30.4278, lng: -9.5981 },
                    zoom: 14,
                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "geometry",
                            "stylers": [{ "visibility": "on" }]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#f5f5f5" }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [{ "visibility": "off" }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "all",
                            "stylers": [{ "visibility": "simplified" }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [{ "color": "#E6CCB2" }, { "visibility": "on" }]
                        }
                    ],
                    disableDefaultUI: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                const infoWindow = new google.maps.InfoWindow();

                locations.forEach((loc) => {
                    const marker = new google.maps.Marker({
                        position: { lat: loc.lat, lng: loc.lng },
                        map: map,
                        title: loc.name,
                        animation: google.maps.Animation.DROP,
                    });

                    marker.addListener("click", () => {
                        infoWindow.setContent(`<div class="info-window"><h3>${loc.name}</h3></div>`);
                        infoWindow.open(map, marker);
                    });

                    marker.addListener("mouseover", () => {
                        infoWindow.setContent(`<div class="info-window"><h3>${loc.name}</h3></div>`);
                        infoWindow.open(map, marker);
                    });
                });

                setMapLoaded(true);
            } catch (err) {
                console.error("Error initializing Google Map:", err);
                setError("Could not initialize map. Please check your API key.");
            }
        }).catch(e => {
            console.error("Error loading Google Maps API:", e);
            setError("Error loading Google Maps API.");
        });
    }, [language, t]);

    // If translations are missing, don't render anything to avoid crash
    if (!t || !t.map) return null;

    return (
        <section className="map-section">
            <div className="container">
                <div className="map-header text-center">
                    <h2 className="section-title">{t.map.title}</h2>
                    <p className="section-subtitle">{t.map.subtitle}</p>
                </div>
                <div className="map-container-wrapper">
                    <div ref={mapRef} className="google-map" style={{ height: '450px', width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: '#f5f5f5' }}>
                        {error ? (
                            <div className="map-error flex justify-center items-center h-full text-center p-4">
                                <div>
                                    <p className="mb-2" style={{ color: 'var(--error)' }}>{error}</p>
                                    <p className="text-sm text-gray-500">Make sure VITE_GOOGLE_MAPS_API_KEY is set in your .env file.</p>
                                </div>
                            </div>
                        ) : !mapLoaded ? (
                            <div className="map-loading flex justify-center items-center h-full">
                                <p>{t.common.loading}</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
