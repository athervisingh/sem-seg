
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import Leaf from 'leaflet';
import 'leaflet-draw';



const DrawControl = ({ ROISelectionName, classSelectionName, onSelectionClick, setdrawControl, setenableClasses, setenableROI, ROISelection, classSelection, setGeoJsonData, geoJsonData, getLayers }) => {

    const map = useMap();
    window.type = true;

    useEffect(() => {
        const drawnItems = new Leaf.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new Leaf.Control.Draw({
            edit: {
                featureGroup: drawnItems,

            },
            draw: {
                polygon: true,
                polyline: false,
                rectangle: true,
                marker: true,
                circle: true,
                circlemarker: false,
            },
        });

        map.addControl(drawControl);
        const onCreate = (event) => {
            const layer = event.layer;
            drawnItems.addLayer(layer);
            const geojson = layer.toGeoJSON();

            const storedData = JSON.parse(localStorage.getItem('roi_data'));

            if (ROISelection && ROISelection !== "-1" && !classSelection) {
                console.log(ROISelectionName);
                console.log(storedData[ROISelectionName]);

                geojson["properties"]['roi'] = ROISelectionName;
                geojson["properties"]['fill'] = storedData[ROISelectionName];

                layer.setStyle({
                    fillColor: storedData[ROISelectionName], 
                    fillOpacity: 0.5, 
                    color: '#000', 
                    weight: 1 
                });

                setGeoJsonData(prevData => [...prevData, geojson]);
                getLayers([drawnItems, layer]);
                setdrawControl(false);

            } else if (classSelection && classSelection !== "-1" && ROISelection && ROISelection !== "-1") {
                geojson["properties"]['class'] = classSelectionName;
                geojson["properties"]['fill'] = classSelection;

                layer.setStyle({
                    fillColor: classSelection, 
                    fillOpacity: 0.5, 
                    color: '#000', 
                    weight: 1
                });

                setGeoJsonData(prevData => [...prevData, geojson]);
                getLayers([drawnItems, layer]);
            }

            setenableROI(false);

            if (layer && onSelectionClick && ROISelection && ROISelection !== "-1" && !classSelection) {
                const bounds = layer.getBounds();
                onSelectionClick([
                    [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                    [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
                ]);
            }
        };

        map.on(Leaf.Draw.Event.CREATED, onCreate);

        return () => {
            map.off(Leaf.Draw.Event.CREATED, onCreate);
            map.removeControl(drawControl);
        };
    }, [map, onSelectionClick, ROISelection, classSelection, setdrawControl, setenableClasses, geoJsonData, setGeoJsonData]);

    return null;
};

export default DrawControl;