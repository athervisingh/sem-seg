// Main routte
import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, LayersControl, ImageOverlay, } from "react-leaflet";
import Joyride from "react-joyride";
import DrawControl from "./components/DrawControl";
import "leaflet/dist/leaflet.css";
import SearchComponent from "./components/SearchComponent";
import ScaleControl from "./components/ScaleControl";
import axios from "axios";
import "./App.css";
import Loading from "./components/Loading";
import Slider from "./components/Slider";
import UtilityButtons from "./components/UtilityButtons";
import DropDowns from "./components/Dropdowns";
import ImageOverlays from "./components/ImageOverlays";
import { TourStep } from "./components/TourStep";
import OpacitySlider from "./components/OpacitySlider";
import ControlBar from "./components/ControlBar";

const App = () => {
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingMask, setLoadingMask] = useState(false);
  const [requestImage, setRequestImage] = useState(false);
  const [requestMask, setRequestMask] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageData, setImageData] = useState({});
  const [imageButtonDisabled, setImageButtonDisabled] = useState(true);
  const [segmentButtonDisabled, setSegmentButtonDisabled] = useState(true);
  const [showMask, setShowMask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageBounds, setImageBounds] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [ROIdata, setROIdata] = useState([]);
  const [classdata, setclassdata] = useState([]);
  const [enableClasses, setenableClasses] = useState(false);
  const [enableROI, setenableROI] = useState(true);
  const [drawControl, setdrawControl] = useState(false);
  const [ROISelection, setROISelection] = useState(null);
  const [ROISelectionName, setROISelectionName] = useState(null);
  const [classSelection, setclassSelection] = useState(null);
  const [classSelectionName, setclassSelectionName] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [bandValues, setBandValues] = useState({ band1: "B4", band2: "B3", band3: "B2", });
  const [ThresholdClass, setThresholdClass] = useState([]);
  const MAHALANOBIS_DISTANCE_CLASSIFIER = "Mahalanobis Distance Classifier"
  const [modelSelection, setModelSelection] = useState(MAHALANOBIS_DISTANCE_CLASSIFIER);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [modelThresHold, setModelThresHold] = useState('1');
  const [opacitySlider, setOpacitySlider] = useState(false);
  const [showImageButton, setShowImageButton] = useState(true);

  const [allLayers, setAllLayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSegmentButton, setShowSegmentButton] = useState(false);
  const [beacon, setBeacon] = useState(() => {
    const storedData = localStorage.getItem('tour');
    return storedData ? false : true;
  });

  const steps = TourStep(beacon)

  useEffect(() => {
    const storedData = localStorage.getItem('tour');

    if (!storedData || storedData === 'false') {
      console.log("sdsd")
      axios.get('https://khaleeque.in/set_ip', {
      })
    }

  }, [])


  const [class_Data, setClass_Data] = useState(() => {
    const storedData = localStorage.getItem('class_data');
    return storedData ? JSON.parse(storedData) : {};
  });

  const [roi_Data, setroi_Data] = useState(() => {
    const storedData = localStorage.getItem('roi_data');
    return storedData ? JSON.parse(storedData) : {};
  });


  const handleSliderChange = (name, value) => () => {
    setImageData(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        opacity: parseFloat(imageData[name].opacity + value),
      },
    }));

  };

  const handleModelChange = (e) => {
    setModelSelection(e.target.value);
    if (modelSelection === "Mahalanobis Distance Classifier") {
      setModelThresHold(() => {
        const newThresholds = {};
        ThresholdClass.forEach(className => {
          newThresholds[className] = '5';
        });
        return newThresholds;
      });
    } else if (modelSelection === "Maximum Likelyhood Classifier") {
      setModelThresHold("1");
    }
  };

  const handleROISelection = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const value = selectedOption.value;
    const name = selectedOption.getAttribute('name');
    setROISelection(value);
    setROISelectionName(name)
    value === "-1" ? setenableClasses(false) : setdrawControl(true);
  };

  const handleClassSelection = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const value = selectedOption.value;
    const name = selectedOption.getAttribute('name');
    setclassSelectionName(name)
    setclassSelection(value);
    value === "-1" ? setdrawControl(false) : setdrawControl(true);
  };

  const getROIdata = (name = "") => {
    const storedData = JSON.parse(localStorage.getItem('roi_data'));
    if (storedData) {
      const newData = Object.keys(storedData).map((ele, index) => (
        <option key={index} value={storedData[ele] || ""} name={ele}>{ele}</option>
      ));
      setROIdata(newData);
      if (name.length) {
        setROISelectionName(name);
        const selectedValue = storedData[name];
        setROISelection(selectedValue);
        selectedValue === "-1" ? setenableClasses(false) : setdrawControl(true);
      }
    }
  };

  const getclassdata = (name = "") => {
    const storedData = JSON.parse(localStorage.getItem('class_data'));
    if (storedData) {
      const newData = Object.keys(storedData).map((ele, index) => (
        <option key={index} value={storedData[ele] || ""} name={ele}>{ele}</option>
      ));

      setclassdata(newData);

      if (name.length) {
        setclassSelectionName(name);
        setclassSelection(storedData[name]);
        name === "-1" ? setdrawControl(false) : setdrawControl(true);
      }
    }
  };

  useEffect(() => { getROIdata(); getclassdata(); }, []);

  const generateImageFromPixels = useCallback((imageURLFromBackend, geoJson) => {
    if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
      console.error("Invalid GeoJSON data received");
      return;
    }

   
    const coordinates = geoJson.features[0].geometry.coordinates[0];
    const bounds = [
      [coordinates[0][1], coordinates[0][0]], // South-West [lat, lng]
      [coordinates[2][1], coordinates[2][0]], // North-East [lat, lng]
    ];

    // ImageOverlay to place the image on the map
    <ImageOverlay
      url={imageUrl}
      bounds={bounds}
      opacity={0.7} // Optional: Adjust image transparency
    />

  }, []);


  const generateMaskFromPixels = (data) => {// backend
    let images = {};
    Object.keys(data).forEach(key => {
      const [base64Image, opacity, area] = data[key];
      images[key] = { url: `data:image/png;base64,${base64Image}`, opacity: opacity, area: area, };
    });
    setImageData(images);
  };

  const handleSelectionClick = (bounds) => { setImageBounds(bounds); };
  const handleImageShow = () => { setShowImage((prev) => !prev); };
  const getLayers = (elem) => { setAllLayers(prevData => [...prevData, elem]); }

  const sendGeoJsonData = async () => {
    if (requestImage) {
      handleImageShow();
      return;
    }

    try {
      setLoadingImage(true);
      handleImageShow();
      setLoading(true);

      const combinedData = {
        geojson: geoJsonData, // Your GeoJSON data
        bands: bandValues,     // Your band values
        date: selectedDate,    // The selected date
      };

      console.log("Sending data to backend:", combinedData);
    //   const params = new URLSearchParams({
    //     data: JSON.stringify(combinedData)
    //   });
    //  console.log("params",params)
    //   const eventSource = new EventSource(`https://4181-103-172-221-178.ngrok-free.app/get_gee_image?${params}`);
      // await axios.post("https://4181-103-172-221-178.ngrok-free.app/get_gee_image", combinedData, {

      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   timeout: 300000, // Set the timeout as needed
      // });

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://4181-103-172-221-178.ngrok-free.app/stream_images', true);
      xhr.timeout = 10000; // Timeout after 10 seconds

      // Initialize previous length for slicing the response in chunks
      xhr.prevLen = 0;

      // Handle timeout
      xhr.ontimeout = function () {
        console.error('Request timed out!');
      };

      // Handle progress as the response is being received
      xhr.onprogress = function () {
        // Get the full response text up to this point
        var responseText = xhr.responseText;

        // Get the new chunk of data since the last progress update
        var chunk = responseText.slice(xhr.prevLen);
        xhr.prevLen = responseText.length; // Update previous length

        // Process the chunk (you can parse JSON if needed, depending on your backend response)
        try {
          // var data = JSON.parse(chunk);
          console.log(chunk);

          // Handle the data (like images or messages) here
          if (data.status && data.status === 'done') {
            console.log('Processing complete.');
            xhr.abort(); // Close the connection when processing is complete
          }

        } catch (e) {
          console.error('Error processing chunk:', e);
        }
      };

      // Handle the complete load of the request
      xhr.onload = function () {
        console.log('Request completed!');
        // You can handle final steps when the entire request is loaded
      };

      // Handle any errors during the request
      xhr.onerror = function () {
        console.error('Request failed.');
      };

      // Send the request
      xhr.send();




      // Step 2: Set up SSE to listen for streaming data from the backend
      // const eventSource = new EventSource("https://4181-103-172-221-178.ngrok-free.app/stream_images");

      // eventSource.onmessage = function (event) {
      //   const chunk = JSON.parse(event.data);
      //   console.log("chunk", chunk);

      //   // Handle incoming image (base64) and GeoJSON data here
      //   // if (chunk.image) {
      //   //   console.log("GeoJSON Data:", chunk.geojson); // Base64 image
      //   //   // generateImageFromPixels(imageURLFromBackend); // Your method to handle the image
      //   // }

      //   // if (chunk.geojson) {
      //   //   // Handle GeoJSON data (you can store or process as needed)
      //   //   console.log("GeoJSON Data:", chunk.geojson);
      //   // }

      //   // Check for completion signal and close the connection when done
      //   if (chunk.status === "done") {
      //     eventSource.close();
      //     setShowSegmentButton(true);
      //     setenableClasses(true);
      //   }
      // };

      // eventSource.onerror = function (error) {
      //   console.error("SSE Error: ", error);
      //   eventSource.close();
      //   alert("An error occurred while receiving the data.");
      // };

    } catch (error) {
      console.error("Error:", error);
      alert("An unknown error occurred.");
    } finally {
      setLoading(false);
      setLoadingImage(false);
    }
  };
  const sendMaskData = async () => {  
    if (requestMask) {
      handleMaskShow();
      return;
    }

    try {
      setLoading(true);
      setLoadingMask(true);
      handleMaskShow();
      const combinedData = {
        "geojson": geoJsonData,
        "model": modelSelection,
        "thresholds": modelThresHold,
      };
      const response = await axios.post("https://khaleeque.in/get_mask", combinedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
        timeout: 300000,
      });
      const blob = response.data;
      const reader = new FileReader();

      reader.onloadend = async () => {
        const jsonData = reader.result;
        const maskData = JSON.parse(jsonData);
        generateMaskFromPixels(maskData);
      }
      reader.readAsText(blob);
      setRequestMask(true);
      if (allLayers.length) {
        allLayers.map((ele) => {
          ele[0].removeLayer(ele[1]);
        });

        setAllLayers([]);
      }
      setShowSegmentButton(false);
      setenableClasses(false);
      setenableROI(false);
      setShowImageButton(false);
      setdrawControl(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const blobError = error.response.data;
        const errorMsg = await blobError.text();
        alert(`Error : ${errorMsg}`);
      } else {
        alert('An unknown error occurred.');
      }
      window.location.reload();
    }
    finally {
      setLoadingMask(false);
      setLoading(false);
    }
  };

  const handleMaskShow = () => { setShowMask((prev) => !prev); };

  useEffect(() => { if (classSelectionName && classSelectionName !== "-1") { setThresholdClass(prev => [...prev, classSelectionName]); } }, [classSelection]);

  useEffect(() => {
    if (modelSelection === "Mahalanobis Distance Classifier") {
      setModelThresHold(() => {
        const newThresholds = {};
        ThresholdClass.forEach(className => {
          newThresholds[className] = '5';
        });
        return newThresholds;
      });
    } else if (modelSelection === "Maximum Likelyhood Classifier") {
      setModelThresHold("1");
    }

  }, [modelSelection, ThresholdClass]);

  return (
    <div className="relative" style={{ zIndex: "10" }}>
      <div className="absolute z-[1000] bottom-7" onClick={() => localStorage.setItem("tour", "true")}>
        <Joyride
          steps={steps}
          run={true}
          continuous
          showSkipButton
          showProgress
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      </div>
      <div className="z-[1000] absolute right-4 w-20 h-20" data-tour="Humburger"></div>
      {loading ? (<Loading />) : null}

      {/* HAMBURGER SLIDER */}
      <Slider setModelThresHold={setModelThresHold} setBandValues={setBandValues} setSelectedDate={setSelectedDate} selectedDate={selectedDate} modelSelection={modelSelection} handleModelChange={handleModelChange} ThresholdClass={ThresholdClass} geoJsonData={geoJsonData} modelThresHold={modelThresHold} />

      {/* Image Segment Reload */}
      <UtilityButtons ROIdisabled={!ROISelection} classdisabled={!classSelection} showImageButton={showImageButton} sendGeoJsonData={sendGeoJsonData} loadingImage={loadingImage} sendMaskData={sendMaskData} loadingMask={loadingMask} showSegmentButton={showSegmentButton} imageButtonDisabled={imageButtonDisabled} segmentButtonDisabled={segmentButtonDisabled} />

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={4}
        dragging={!isDraggingSlider}
        style={{ height: "100vh", width: "100%", zIndex: "1" }}
        doubleClickZoom={false}
      >
        <LayersControl data-tour="satellite-btn" position="bottomright">
          <LayersControl.BaseLayer name="Simple Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="Satellite Map">
            <TileLayer
              url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=QqTSNEE2UIK0e5wGBlP6"
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ControlBar enableROI={enableROI} ROISelection={ROISelection} handleROISelection={handleROISelection} ROIdata={ROIdata} getROIdata={getROIdata} enableClasses={enableClasses} classSelection={classSelection} handleClassSelection={handleClassSelection} classdata={classdata} getclassdata={getclassdata} showMask={showMask} setOpacitySlider={setOpacitySlider} opacitySlider={opacitySlider} imageData={imageData} handleSliderChange={handleSliderChange} setIsDraggingSlider={setIsDraggingSlider} />

        <ImageOverlays imageData={imageData} imageBounds={imageBounds} showMask={showMask} handleMaskShow={handleMaskShow} />
        {/* component */}
        {imageUrl && imageBounds && showImage && (
          <ImageOverlay
            url={imageUrl}
            bounds={imageBounds}
            eventHandlers={{ click: handleImageShow }}
          />
        )}

        {drawControl ? (
          <DrawControl
            onSelectionClick={handleSelectionClick}
            setGeoJsonData={setGeoJsonData}
            setdrawControl={setdrawControl}
            setenableClasses={setenableClasses}
            setenableROI={setenableROI}
            ROISelection={ROISelection}
            classSelection={classSelection}
            geoJsonData={geoJsonData}
            getLayers={getLayers}
            classSelectionName={classSelectionName}
            ROISelectionName={ROISelectionName}
            setImageButtonDisabled={setImageButtonDisabled}
            setSegmentButtonDisabled={setSegmentButtonDisabled}
          />
        ) : null}
        <div className="p-10 absolute bottom-9 right-8" data-tour="scale-component">
          <ScaleControl />
        </div>

      </MapContainer>
    </div>
  );
};




export default App;