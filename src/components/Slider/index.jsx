import React, { useState } from 'react'
import maps from "../../assets/maps.gif"
import menuImage from "../../assets/menu.png"
import closeImage from "../../assets/close.png"
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'; // Import the DatePicker component
import 'react-datepicker/dist/react-datepicker.css';
import { FiCopy } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'

const Slider = ({ modelSelection, setModelThresHold , setSelectedDate , selectedDate , setBandValues, handleModelChange, ThresholdClass, geoJsonData, modelThresHold }) => {
    const [sliderOpen, setSliderOpen] = useState(false);
    const [settingsSelected, setSettingsSelected] = useState(true);
    const [error, setError] = useState('');

    const handleDateChange = (date) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';

        // Regular expression to validate the format: yyyy-mm-dd
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (date && !datePattern.test(formattedDate)) {
            setError('Invalid date format. Please use YYYY-MM-DD.');
        } else {
            setError(''); // Clear the error
            setSelectedDate(formattedDate); // Set the valid date
        }
    };


    const handleBandChange = (e, bandKey) => {
        setBandValues((prev) => ({
            ...prev,
            [bandKey]: e.target.value,
        }));
    };


  
    const handleCopy = () => {
        const dataToCopy = JSON.stringify(geoJsonData, null, 2); // Convert to string
        navigator.clipboard.writeText(dataToCopy)
            .then(() => {
                toast.info('Data copied to clipboard!', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            })
            .catch(err => {
                console.error("Failed to copy:", err);
            });
    };
   

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
            />

            <div onClick={() => setSliderOpen(true)} className={`${sliderOpen ? 'd-none' : 'd-block'} position-absolute bg-white border rounded p-2 cursor-pointer`} style={{ zIndex: "1000", top: "20px", right: "25px" }} >
                <img src={menuImage} alt="..." width={20} />
            </div>
            <div className={`${sliderOpen ? "w-[40%] max-[1224px]:w-[60%] max-[812px]:w-[70%] max-[700px]:w-[100%]" : "w-0"} z-[1001] d-flex flex-column align-items-center sidebar position-absolute right-0 rounded-xl`} style={{ overflowY: "scroll", height: '100vh', overflowX: "hidden" }}>

                <div className="w-100 d-flex justify-between">
                    <div className={`${settingsSelected ? "bg-primary cursor-pointer text-white" : "bg-light cursor-pointer text-black"} fw-bold text-lg w-[50%] text-center d-flex justify-content-center gap-3 align-items-center`} onClick={() => setSettingsSelected(true)}>
                        <img src={maps} alt="..." className="w-8 rounded-full" />Advanced Settings
                    </div>

                    <div className={`${!settingsSelected ? "bg-primary text-white cursor-pointer" : "bg-light cursor-pointer text-black"} fw-bold text-lg w-[50%] text-center d-flex justify-content-center gap-3 align-items-center`} onClick={() => setSettingsSelected(false)}>
                        <img src={maps} alt="..." className="w-8 rounded-full" />Geo Json
                    </div>

                    <img src={closeImage} alt="..." width={15} className="m-3 cursor-pointer" onClick={() => setSliderOpen(false)} />
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
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index} value={`B${index + 1}`}>
                                                B{index + 1}
                                            </option>
                                        ))}
                                        <option value="B8A">B8A</option>
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
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index} value={`B${index + 1}`}>
                                                B{index + 1}
                                            </option>
                                        ))}
                                        <option value="B8A">B8A</option>
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
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index} value={`B${index + 1}`}>
                                                B{index + 1}
                                            </option>
                                        ))}
                                        <option value="B8A">B8A</option>
                                    </select>
                                </div>

                            </div>

                        </div>

                        <div className="rounded-lg">
                            <h1 className="text-xl pt-4 pl-5">Select Date</h1>
                            <div className="p-2 bg-white m-3">
                                <DatePicker
                                    selected={selectedDate ? new Date(selectedDate) : null}
                                    onChange={(date) => handleDateChange(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                    placeholderText="YYYY-MM-DD"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    maxDate={new Date()} 
                                />
                                {error && <p className="text-red-500">{error}</p>}
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
                                                toast.error('Please enter a numeric value', {
                                                    position: "top-left",
                                                    autoClose: 3000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: "colored",
                                                    transition: Bounce,
                                                });
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
                                                        toast.error('Please enter a numeric value', {
                                                            position: "top-left",
                                                            autoClose: 3000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                            theme: "colored",
                                                            transition: Bounce,
                                                        });
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
                        <div className="p-4 bg-gray-50 border rounded-lg shadow-lg">
                            <div className="flex justify-end">
                                <FiCopy
                                    onClick={handleCopy}
                                    className="text-3xl text-blue-500 cursor-pointer hover:text-blue-600"
                                    title="Copy Data"
                                />
                            </div>
                            {geoJsonData.length > 0 ? (
                                <pre className="text-2xl flex justify-center text-gray-800 p-4 mt-2 rounded-lg bg-gray-100 overflow-auto">
                                    <code className="whitespace-pre-wrap">{JSON.stringify(geoJsonData, null, 2)}</code>
                                </pre>
                            ) : (
                                <div className="text-gray-500 text-center">No data available</div>
                            )}
                        </div>
                    )}


                </div>
            </div>
        </>
    )
}

export default Slider
