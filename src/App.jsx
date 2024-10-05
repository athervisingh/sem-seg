
import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ImageOverlay,
} from "react-leaflet";
import Joyride from "react-joyride";
import DrawControl from "./components/DrawControl";
import GeoJsonDisplay from "./components/GeoJsonDisplay";
import "leaflet/dist/leaflet.css";
import SearchComponent from "./components/SearchComponent";
import MapModel from "./components/MapModel";
import ClassModel from "./components/ClassModel";
import ScaleControl from "./components/ScaleControl";
import axios from "axios";
import "./App.css";
import styled from 'styled-components';
import closeImage from './assets/close.png'
import menuImage from './assets/menu.png'
import maps from './assets/maps.gif'
import loadPng from './assets/load.gif'
import load from './assets/Spinner-3.gif'
import Leaf from 'leaflet';


const SliderContainer = styled.div`
  background:#c3c9c8;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const SliderLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const StyledSlider = styled.input`
  width: 100%;
  height:8px;
  margin-bottom: 5px;
  cursor: pointer;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 5px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 15px;
    height: 15px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
  }
`;






const App = () => {
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingMask, setLoadingMask] = useState(false);
  const [requestImage, setRequestImage] = useState(false);
  const [requestMask, setRequestMask] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);
  const [imageData, setImageData] = useState({});
  const [showMask, setShowMask] = useState(null);
  const [imageBounds, setImageBounds] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [ROIdata, setROIdata] = useState([]);
  const [classdata, setclassdata] = useState([]);
  const [enableClasses, setenableClasses] = useState(false);
  const [enableROI, setenableROI] = useState(true);
  const [drawControl, setdrawControl] = useState(false);
  const [ROISelection, setROISelection] = useState(null);
  const [classSelection, setclassSelection] = useState(null);
  const [classSelectionName, setclassSelectionName] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [bandValues, setBandValues] = useState({
    band1: "B7",
    band2: "B4",
    band3: "B2",
  });
  const [ThresholdClass, setThresholdClass] = useState([]);
  const MAHALANOBIS_DISTANCE_CLASSIFIER = "Mahalanobis Distance Classifier"
  const [modelSelection, setModelSelection] = useState(MAHALANOBIS_DISTANCE_CLASSIFIER);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [modelThresHold, setModelThresHold] = useState('1');
  const [opacitySlider, setOpacitySlider] = useState(false);
  const [runTour, setRunTour] = useState(true);
  const [showImageButton, setShowImageButton] = useState(true);
  const [showSegmentButton, setShowSegmentButton] = useState(false);

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
    },
    {
      target: '[data-tour="roi-dropdown"]', // Select by attribute
      content: 'Start by selecting a Region of Interest (ROI). Begin your analysis by choosing the area you want to focus on.',
    },

    {
      target: '[data-tour="get-image"]',
      content: 'Click the "Image" button to load the satellite imagery for your selected ROI.',
    },
    {
      target: '[data-tour="class-dropdown"]',
      content: 'Select the class/feature you want to extract or segment, such as urban areas, forests, or rivers.',
    },

    {
      target: '[data-tour="get-mask"]',
      content: 'Click Segment to load the mask or segmented image on the screen.',
    },
    {
      target: '[data-tour="reload-btn"]', // Assuming you have a reload button
      content: 'Click here to reload the current view or reset your analysis.',
    },
    {
      target: '[data-tour="scale-component"]', // Assuming you have a scale selection component
      content: 'For best results make selection between the scale of 2-3 km. You can toggle between satellite and street map accordingly.',
    },
    {
      target: '[data-tour="search-bar"]', // For the search bar
      content: 'Use the search bar to quickly find specific locations or features within the satellite imagery.',
    },
  ];

  const handleSliderChange = (name) => (e) => {
    setImageData(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        opacity: parseFloat(e.target.value),
      },
    }));
  };

  const handleMouseDown = () => {
    setIsDraggingSlider(true);
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
  };

  const handleBandChange = (e, bandKey) => {
    setBandValues((prev) => ({
      ...prev,
      [bandKey]: e.target.value,
    }));
  };

  const handleModelChange = (e) => {
    setModelSelection(e.target.value);
    // Reset thresholds based on model selection
    if (modelSelection === "Mahalanobis Distance Classifier") {
      setModelThresHold(() => {
        // Create a new object to hold the thresholds
        const newThresholds = {};

        // Set the threshold value to '5' for each class in ThresholdClass
        ThresholdClass.forEach(className => {
          newThresholds[className] = '5'; // Set threshold value to '5'
        });

        return newThresholds; // Return the new state object
      });

    } else if (modelSelection === "Maximum Likelyhood Classifier") {

      setModelThresHold("1");
      // Default thresholds for this model
    } else {
      setThresholdClass([]); // Clear for other models
    }
  };

  const handleROISelection = (e) => {
    const value = e.target.value;
    console.log(value, "Value")
    setROISelection(value);

    if (value === "-1") {
      setenableClasses(false);
    } else {
      setdrawControl(true);
    }
  };

  const handleClassSelection = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const value = selectedOption.value;
    const name = selectedOption.dataset.name;
    console.log(value, name, "Class, Value")
    setclassSelectionName(name)
    setclassSelection(value);

    if (value === "-1") {
      setdrawControl(false);
    } else {
      setdrawControl(true);
    }
  };

  const getROIdata = (name = "") => {
    const storedData = JSON.parse(localStorage.getItem('roi_data'));

    if (storedData) {
      // Generate the options based on storedData, not roi_Data
      const newData = Object.keys(storedData).map((ele, index) => (
        <option key={index} value={storedData[ele] || ""}>
          {ele}
          {console.log(storedData[ele])}
        </option>
      ));

      // Update the ROIdata state with the new options
      setROIdata(newData);

      // If a name is provided, select the ROI and enable/disable controls accordingly
      if (name) {
        const selectedValue = storedData[name];
        setROISelection(selectedValue);

        if (selectedValue === "-1") {
          setenableClasses(false);
        } else {
          setdrawControl(true);
        }
      }
    }
  };


  const getclassdata = (name = "") => {
    // Retrieve Classes from localStorage

    const newData = Object.keys(class_Data).map((key, index) => (
      <option key={index} value={class_Data[key] || ""} data-name={key}>
        {key}
      </option>
    ));

    // Set the class options
    setclassdata(newData);

    // Handle class selection logic
    if (name) {
      setclassSelection(class_Data[name]); // Update the selected class

      // Use 'name' directly instead of 'classSelection' because 'setclassSelection' is async
      if (name === "-1") {
        setdrawControl(false); // Disable draw control for invalid selection
      } else {
        setdrawControl(true);  // Enable draw control
      }
    }
  };


  useEffect(() => {
    getROIdata();
    getclassdata();
  }, []);

  const generateImageFromPixels = useCallback((imageURLFromBackend) => {
    setImageUrl(imageURLFromBackend);
    setGeoJsonData([])

  }, []);
  const generateMaskFromPixels = (data) => {
    let images = {};

    Object.keys(data).forEach(key => {

      const [base64Image, opacity, area] = data[key];
      images[key] = {
        url: `data:image/png;base64,${base64Image}`,
        opacity: opacity,
        area: area,
      };
    });
    setImageData(images);
  };

  const handleSelectionClick = (bounds) => {
    setImageBounds(bounds);
  };

  const handleImageShow = () => {
    setShowImage((prev) => !prev);
  };


  const [allLayers, setAllLayers] = useState([]);

  const getLayers = (elem) => {
    setAllLayers(prevData => [...prevData, elem]);
  }

  const [loading, setLoading] = useState(false);

  const sendGeoJsonData = async () => {
    if (requestImage) {
      handleImageShow();
      return;
    }

    try {
      setLoadingImage(true);  // Show loading before the request
      handleImageShow();
      setLoading(true);

      console.log(loading);

      const combinedData = {
        "geojson": geoJsonData,
        "bands": bandValues,
      };
      console.log("combinedData", combinedData);

      const response = await axios.post(
        "http://127.0.0.1:5001/get_gee_image",
        combinedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const pixelData = await response.data;
      console.log("pixelData", pixelData);

      const imageURLFromBackend = URL.createObjectURL(pixelData);
      generateImageFromPixels(imageURLFromBackend);
      setRequestImage(true);
      setShowImageButton(false);
      setShowSegmentButton(true);

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
      setLoading(false); // Stop loading after everything finishes
      setLoadingImage(false);  // Stop loading image
    }
  };


  const handleMaskShow = () => {
    setShowMask((prev) => !prev);
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
      console.log("mask", combinedData);

      const response = await axios.post("http://127.0.0.1:5001//get_mask", combinedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });
      const blob = response.data;
      const reader = new FileReader();

      reader.onloadend = async () => {
        const jsonData = reader.result;
        const maskData = JSON.parse(jsonData);
        console.log("Parsed Mask Data:", maskData);
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
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(`Error: ${error.response.data}`);
        console.log(error.response.data)
      } else {
        alert('An unknown error occurred.');
      }
      window.location.reload();
    }
    finally {
      setLoadingMask(false); // Stop loading
      setLoading(false);
    }

  };

  useEffect(() => {

    if (classSelectionName && classSelectionName !== "-1") {
      setThresholdClass(prev => [...prev, classSelectionName]);
    }
  }, [classSelection]);

  useEffect(() => {
    if (modelSelection === "Mahalanobis Distance Classifier") {
      setModelThresHold(() => {
        // Create a new object to hold the thresholds
        const newThresholds = {};

        // Set the threshold value to '5' for each class in ThresholdClass
        ThresholdClass.forEach(className => {
          newThresholds[className] = '5'; // Set threshold value to '5'
        });

        return newThresholds; // Return the new state object
      });

    } else if (modelSelection === "Maximum Likelyhood Classifier") {

      setModelThresHold("1");
      // Default thresholds for this model
    }

  }, [modelSelection, ThresholdClass])

  const [settingsSelected, setSettingsSelected] = useState(true);
  const toggleOpacity = () => {
    setOpacitySlider(!opacitySlider);
  };

  return (
    <div className="relative" style={{ zIndex: "10" }}>
      <div className="absolute z-[1000] bottom-7">
        <Joyride
          steps={steps}
          run={runTour} // Controls if the tour is running
          continuous
          showSkipButton
          showProgress
          styles={{
            options: {
              zIndex: 10000,// Ensure it's above everything
            },
          }}
        />
      </div>

      {loading ? (
        <div className="w-full h-[100vh] flex justify-center items-center backdrop-blur-sm backdrop-brightness-50 fixed top-0 left-0 z-[1000]">
          <img src={loadPng} alt="Loading..." width={100} />
        </div>
      ) : null}


      <div className={`${sliderOpen ? "w-[40%] max-[1224px]:w-[60%] max-[812px]:w-[70%] max-[700px]:w-[100%]" : "w-0"} z-[1001] d-flex flex-column align-items-center sidebar position-absolute right-0 rounded-xl`} style={{ overflowY: "scroll", height: '100vh', overflowX: "hidden" }}>

        <div className="w-100 d-flex justify-between">
          <div className={`${settingsSelected ? "bg-primary cursor-pointer text-white" : "bg-light cursor-pointer text-black"} fw-bold text-lg w-[50%] text-center d-flex justify-content-center gap-3 align-items-center`} onClick={() => setSettingsSelected(true)}>
            <img src={maps} alt="" className="w-8 rounded-full" />Advanced Settings
          </div>

          <div className={`${!settingsSelected ? "bg-primary text-white cursor-pointer" : "bg-light cursor-pointer text-black"} fw-bold text-lg w-[50%] text-center d-flex justify-content-center gap-3 align-items-center`} onClick={() => setSettingsSelected(false)}>
            <img src={maps} alt="" className="w-8 rounded-full" />Geo Json
          </div>

          <img src={closeImage} alt="" width={15} className="m-3 cursor-pointer" onClick={() => setSliderOpen(false)} />
        </div>
        <div className={`${!sliderOpen ? "d-none" : "d-flex"} flex-column w-100 `}>
          {settingsSelected && <>
            <div className="rounded-lg">

              <h1 className="text-xl pt-4 pl-5 cursor-pointer" data-tour="band-settings">Bands</h1>
              <div className="">
                <div className="p-2 bg-white m-3 w-100">
                  <select
                    className="form-select cursor-pointer"
                    aria-label="B options"
                    style={{ maxHeight: "150px", overflowY: "auto", width: "90%" }}
                    onChange={(e) => handleBandChange(e, "band1")}
                  >
                    <option value="-1">Band 1</option>
                    {[...Array(15)].map((_, index) => (
                      <option key={index} value={`B${index + 1}`}>
                        B{index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-2 bg-white m-3 w-100">
                  <select
                    className="form-select cursor-pointer"
                    aria-label="B options"
                    style={{ maxHeight: "150px", overflowY: "auto", width: "90%" }}
                    onChange={(e) => handleBandChange(e, "band2")}
                  >
                    <option value="-1">Band 2</option>
                    {[...Array(15)].map((_, index) => (
                      <option key={index} value={`B${index + 1}`}>
                        B{index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-2 bg-white m-3 w-100">
                  <select
                    className="form-select cursor-pointer"
                    aria-label="B options"
                    style={{ maxHeight: "150px", overflowY: "auto", width: "90%" }}
                    onChange={(e) => handleBandChange(e, "band3")}
                  >
                    <option value="-1">Band 3</option>
                    {[...Array(15)].map((_, index) => (
                      <option key={index} value={`B${index + 1}`}>
                        B{index + 1}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>

            <div className="rounded-lg">
              <h1 className="text-xl pt-4 pl-5">Model</h1>
              <div className="p-2 bg-white m-3">
                <select
                  className="form-select w-100 cursor-pointer"
                  aria-label="B options"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                  defaultValue={modelSelection}
                  onChange={handleModelChange}
                >
                  <option value="-1">Model CLassifier</option>

                  <option value="Random Forest Classifier">
                    Random Forest Classifier
                  </option>
                  <option value="Parallelepiped Classifier">
                    Parallelepiped Classifier
                  </option>
                  <option value="Maximum Likelyhood Classifier">
                    Maximum Likelyhood Classifier
                  </option>
                  <option value="Mahalanobis Distance Classifier">
                    Mahalanobis Distance Classifier
                  </option>
                </select>
              </div>
            </div>
            {modelSelection === "Maximum Likelyhood Classifier" && (
              <div className="rounded-lg">
                <h1 className="text-xl pt-4 pl-5">Threshold</h1>
                <div className="p-2 bg-white m-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter threshold value"
                    // value={modelThresHold === null || typeof modelThresHold!=='number' ? 1 : modelThresHold}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (e.target.value.length === 0) {
                        setModelThresHold("1")
                      }
                      if (isNaN(value)) {
                        alert("Please enter a numeric value");
                      } else {
                        setModelThresHold(() => {
                          return (
                            value
                          );
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {console.log("ThresholdClass", ThresholdClass)}
            {modelSelection === "Mahalanobis Distance Classifier" &&
              [...new Set(ThresholdClass)].map((name, index) => {
                // Looping through the unique names only once
                return (
                  <div key={index} className="rounded-lg mb-5">
                    <h1 className="text-xl pt-4 pl-5">Threshold for {name}</h1>
                    <div className="p-2 bg-white m-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter threshold for ${name}`}
                        value={modelThresHold[name] || ""} // Ensure no undefined value
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isNaN(value)) {
                            alert("Please enter a numeric value");
                          } else {
                            setModelThresHold((prev) => ({
                              ...prev,
                              [name]: value,
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })
            }

          </>}

          {!settingsSelected && (
            <div className="p-10 bg-gray-50 border rounded-lg shadow-lg">
              {geoJsonData ? (
                <pre className="text-2xl flex justify-center text-gray-800 p-4 bg-gray-100 rounded overflow-auto">
                  <code className="whitespace-pre-wrap">{JSON.stringify(geoJsonData, null, 2)}</code>
                </pre>
              ) : (
                <div className="text-gray-500 text-center">No data available</div>
              )}
            </div>
          )}


        </div>
      </div>
      <div className="absolute z-[998] bottom-0 flex max-[720px]:flex-col">
        {showImageButton && <div data-tour="get-image" className="p-2 w-36">
          <button
            type="button"
            onClick={sendGeoJsonData}
            className="w-100 cursor-pointer p-1 px-3 d-flex gap-3 align-items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm border border-black"
          >
            {loadingImage && (
              <div className="">
                <img src={load} alt="" className="w-6  rounded-full" />
              </div>
            )}
            {!loadingImage && <img src={maps} alt="" className="w-6  rounded-full" />}

            <div className="text-sm">Image</div>
          </button>
        </div>}

        {showSegmentButton && <div className="p-2 w-36">
          <button
            data-tour="get-mask"
            type="button"
            onClick={sendMaskData}
            className="w-100 cursor-pointer p-1 px-3 d-flex gap-3 align-items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm border border-black"
          >
            {loadingMask && (
              <div className="">
                <img src={load} alt="" className="w-6  rounded-full" />
              </div>
            )}
            {!loadingMask && <img src={maps} alt="" className="w-6  rounded-full" />}
            <div className="text-sm">Segment</div>
          </button>
        </div>}

        <div className="p-2 w-36">
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            data-tour="reload-btn"
            className="w-100 cursor-pointer p-1 px-3 d-flex gap-3 align-items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm border border-black"
          >
            <img src={maps} alt="" className="w-6 rounded-full" />
            <div className="text-sm">Reload</div>
          </button>
        </div>
      </div>

      <div onClick={() => setSliderOpen(true)} className={`${sliderOpen ? 'd-none' : 'd-block'} position-absolute bg-white border rounded p-2 cursor-pointer`} style={{ zIndex: "1000", top: "20px", right: "25px" }} >
        <img src={menuImage} alt="..." width={20} />
      </div>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={4}
        dragging={!isDraggingSlider}
        style={{ height: "100vh", width: "100%", zIndex: "1" }}
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
              url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=fIYt5qeKuBJ66khalaCH"
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <div className="absolute m-3 d-flex gap-11 flex-wrap z-[1000] left-16 max-[1077px]:gap-7 ">
          <div className="" data-tour="search-bar"><SearchComponent /></div>

          <div
            data-tour="roi-dropdown"
            className=" d-flex gap-3"
            style={{ zIndex: "1000", top: "10px", minWidth: '280px' }}
          >
            <select
              className="form-select w-100 border p-2 rounded border-black w-full"
              aria-label="Default select example"
              onChange={handleROISelection}
              value={ROISelection || ""}
              style={{ fontSize: '12px', fontWeight: "bold" }}
              disabled={!enableROI}
            >
              <option value="-1">Region of Interest</option>
              {ROIdata}
            </select>
            <div
              className="w-50"
              style={{ zIndex: "1000", top: "50px", left: "10%", right: "10%" }}
            >
              <button
                type="button"
                className="btn btn-primary w-100"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                disabled={!enableROI}
              >
                New
              </button>
            </div>
            <MapModel ROIdata={getROIdata} />
          </div>


          {/* Class */}
          <div
            data-tour="class-dropdown"
            className="d-flex gap-3"
            style={{ zIndex: "999", top: "60px", minWidth: '280px' }}
          >
            <select
              className="form-select form-select w-100 border rounded border-black w-full"
              aria-label="Default select example"
              disabled={!enableClasses}
              value={classSelection || ""}
              onChange={handleClassSelection}
              style={{ fontSize: '12px', fontWeight: "bold" }}
            >
              <option value="-1">Classes</option>
              {classdata}
            </select>
            <div
              className="w-50"
              style={{ zIndex: "999", top: "50px", left: "10%", right: "10%" }}
            >
              <button
                disabled={!enableClasses}
                type="button"
                className="btn btn-primary w-100"
                data-bs-toggle="modal"
                data-bs-target="#classModel"
              >
                New
              </button>
            </div>
            <ClassModel getclassdata={getclassdata} />
          </div>
          <div className={showMask ? 'z-[1000] cursor-pointer w-[178px] bg-white h-9 text-center font-bold text-xs border border-black rounded-lg ' : 'hidden'}>

            <button className="w-full h-full" onClick={toggleOpacity}>
              {opacitySlider ? 'Hide Opacity' : 'Show Opacity'}
            </button>

            {opacitySlider && (

              Object.keys(imageData).map((name, index) => (
                <SliderContainer key={index} style={{ bottom: `${30 + index * 20}%` }}>
                  <SliderLabel>{name.charAt(0).toUpperCase() + name.slice(1)} Opacity</SliderLabel>
                  <StyledSlider
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={imageData[name].opacity}
                    onChange={handleSliderChange(name)}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                  />
                  <SliderLabel>Area: {imageData[name].area} km{<sup>2</sup>}</SliderLabel>
                </SliderContainer>))
            )}
          </div>
        </div>
        {/* Dynamically render ImageOverlay and Sliders */}
        {Object.keys(imageData).map((name, index) => (
          <div key={index}>
            {imageData[name].url && imageBounds && showMask && (
              <ImageOverlay
                url={imageData[name].url}
                bounds={imageBounds}
                opacity={imageData[name].opacity}
                eventHandlers={{ click: handleMaskShow }}
              />
            )}



          </div>
        ))}

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

          />
        ) : null}
        <GeoJsonDisplay />
        <div className="p-10 absolute bottom-9 right-8" data-tour="scale-component">
          <ScaleControl />
        </div>

      </MapContainer>
    </div>
  );
};

export default App;