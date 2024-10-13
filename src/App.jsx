
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
import toggleGif from "./assets/toggle.gif"
import classGif from "./assets/class.gif"
import roiGif from "./assets/roi.gif"
import advancedGif from "./assets/advanced.gif"
import OpacitySlider from "./components/OpacitySlider";

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
  const [runTour, setRunTour] = useState(true);
  const [allLayers, setAllLayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSegmentButton, setShowSegmentButton] = useState(false);
  const [beacon, setBeacon] = useState(() => {
    const storedData = localStorage.getItem('tour');
    return storedData ? false : true;
  });

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

  const steps = [
    {
      target: 'body', // Global target for the welcome message
      content: 'Welcome to Sementic Segmentation of satellite imagery! This tool allows users to perform interactive semantic segmentation on satellite imagery using WMS services while leveraging on-device GPU/NPU for enhanced performance.',
      disableBeacon: beacon
    },
    {
      target: '[data-tour="roi-dropdown"]', // Select by attribute
      content: 
      (
        <div>
            <p>Start by selection a Region of Interest. Begin your analysis by marking the area you want to focus with one of the draw tools. <br /> <b>Make sure to choose the scale less than or equals to 5 Km</b></p>
          <img
              src={roiGif}
              alt="Step 2 GIF"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),
    },

    {
      target: '[data-tour="get-image"]',
      content: 'Click the "Image" button to load the satellite imagery for your selected ROI Or Click Segment to load the mask or segmented image on the screen. ',
    },
    {
      target: '[data-tour="class-dropdown"]',
      content: 
      (
        <div>
          <p>Select the class/feature you want to extract or segment, such as urban areas, forests, or rivers.</p>
          <img
            src={classGif}
            alt="Step 2 GIF"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),
    },
    {
      target: '[data-tour="reload-btn"]', // Assuming you have a reload button
      content: 'Click here to reload the current view or reset your analysis.',
    },
    {
      target: '[data-tour="scale-component"]', // Assuming you have a scale selection component
      content:
      (
        <div>
          <p>For best results make selection less than or equal to 5km. <br /> You can toggle between the satellite map and the street map according to your requirements</p>
          <img
            src={toggleGif}
            alt="Step 2 GIF"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),

    },
    {
      target: '[data-tour="search-bar"]', // For the search bar
      content: 'Use the search bar to quickly find specific locations or features within the satellite imagery.',
    },
    {
      target: '[data-tour="Humburger"]', // For the search bar
      content: (
        <div>
          <p>This is the advanced section, you can select the bands, models and adjust the thresholds
            Also you can export geojson for the selected features</p>
          <img
            src={advancedGif}
            alt="Step 2 GIF"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),
    },
  ];

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

  const generateImageFromPixels = useCallback((imageURLFromBackend) => { setImageUrl(imageURLFromBackend); setGeoJsonData([]) }, []);

  const generateMaskFromPixels = (data) => {
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
        "geojson": geoJsonData,
        "bands": bandValues,
        "date": selectedDate,
      };
      console.log("data",combinedData)

      const response = await axios.post(
        "https://khaleeque.in/get_gee_image",
        combinedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
          timeout: 300000,
        }
      );

      const pixelData = await response.data;

      const imageURLFromBackend = URL.createObjectURL(pixelData);
      generateImageFromPixels(imageURLFromBackend);
      setRequestImage(true);
      setShowImageButton(false);
      setShowSegmentButton(true);
      setenableClasses(true);

      if (allLayers.length) {
        allLayers.forEach((ele) => {
          ele[0].removeLayer(ele[1]);
        });
        setAllLayers([]);
        setShowImageButton(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const blobError = error.response.data;
        const errorMsg = await blobError.text();
        alert(`Error : ${errorMsg}`);
      } else {
        alert('An unknown error occurred.');
      }
      window.location.reload();
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
    const combinedData = {
      "geojson": geoJsonData,
      "model": modelSelection,
      "thresholds": modelThresHold,
    };
 

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
    }  catch (error) {
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
          run={runTour}
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
        doubleClickZoom= {false}
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

        <div className="absolute m-3 d-flex gap-11 flex-wrap z-[1000] left-16 max-[1077px]:gap-7 ">
          <div className="" data-tour="search-bar"><SearchComponent /></div>

          {/* ROI Dropdown */}
          <DropDowns dataTour={"roi-dropdown"} enable={enableROI} value={ROISelection} handleChange={handleROISelection} heading={"Region of Interest"} data={ROIdata} modal={"#exampleModal"} getData={getROIdata} />

          {/* Classes Dropdown */}
          <DropDowns dataTour={"class-dropdown"} enable={enableClasses} value={classSelection} handleChange={handleClassSelection} heading={"Classes"} data={classdata} modal={"#classModel"} getData={getclassdata} />

          <div className={showMask ? 'z-[1000] cursor-pointer w-[178px] bg-white h-9 text-center font-bold text-xs border border-black rounded-lg ' : 'hidden'}>

            <button className="w-full h-full" onClick={() => setOpacitySlider(!opacitySlider)}>{opacitySlider ? 'Hide Opacity' : 'Show Opacity'}</button>

            <OpacitySlider opacitySlider={opacitySlider} imageData={imageData} handleSliderChange={handleSliderChange} setIsDraggingSlider={setIsDraggingSlider} />
          </div>
        </div>

        <ImageOverlays imageData={imageData} imageBounds={imageBounds} showMask={showMask} handleMaskShow={handleMaskShow} />

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