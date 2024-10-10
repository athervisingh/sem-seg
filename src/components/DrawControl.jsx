
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import Leaf from 'leaflet';
import 'leaflet-draw';



const DrawControl = ({setImageButtonDisabled , setSegmentButtonDisabled , ROISelectionName, classSelectionName, onSelectionClick, setdrawControl, setenableClasses, setenableROI, ROISelection, classSelection, setGeoJsonData, geoJsonData, getLayers }) => {

    const map = useMap();
    window.type = true;

    useEffect(() => {
        const drawnItems = new Leaf.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new Leaf.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                remove: true ,
            },
            draw: {
                polygon: true,
                polyline: false,
                rectangle: true,
                marker: false,
                circle: false,
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
                setImageButtonDisabled(false);

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
                setSegmentButtonDisabled(false);
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


        const onEdit = (event) => {
            const layers = event.layers;
            layers.eachLayer(layer => {
                const updatedGeojson = layer.toGeoJSON();
                // Update geoJsonData accordingly or handle updates here
            });
            console.log('Layers edited:', event.layers);
        };

        const onDelete = (event) => {
            const layers = event.layers;
            layers.eachLayer(layer => {
                // You can handle deletion here
                // For example, remove the geoJson data associated with this layer
                console.log('Layer deleted:', layer);
            });
        };


        map.on(Leaf.Draw.Event.CREATED, onCreate);
        map.on(Leaf.Draw.Event.EDITED, onEdit);  // Attach the edit handler
        map.on(Leaf.Draw.Event.DELETED, onDelete); 

        return () => {
            map.off(Leaf.Draw.Event.CREATED, onCreate);
            map.off(Leaf.Draw.Event.EDITED, onEdit);  // Remove edit handler
            map.off(Leaf.Draw.Event.DELETED, onDelete);  
            map.removeControl(drawControl);
        };
    }, [map, onSelectionClick, ROISelection, classSelection, setdrawControl, setenableClasses, geoJsonData, setGeoJsonData]);

    return null;
};

export default DrawControl;