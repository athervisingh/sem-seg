import React from 'react'
import load from '../../assets/Spinner-3.gif'
import maps from '../../assets/maps.gif'

const UtilityButtons = ({ imageButtonDisabled, segmentButtonDisabled, showImageButton, sendGeoJsonData, sendMaskData, loadingMask, loadingImage, showSegmentButton }) => {
    return (
        <div className="absolute z-[998] bottom-0 flex max-[720px]:flex-col">
            {showImageButton && <div data-tour="get-image" className="p-2 w-36">
                <button
                    type="button"
                    onClick={sendGeoJsonData}
                    className={`w-100 p-1 px-3 d-flex gap-3 align-items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm border border-black ${imageButtonDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'
                        }`}
                    disabled={imageButtonDisabled}
                >
                    {loadingImage ? (
                        <img src={load} alt="" className="w-6 rounded-full" />
                    ) : (
                        <img src={maps} alt="" className="w-6 rounded-full" />
                    )}
                    <div className="text-sm">Image</div>
                </button>


            </div>}

            {showSegmentButton && <div className="p-2 w-36">
                <button
                    type="button"
                    onClick={sendMaskData}
                    className={`w-100 p-1 px-3 d-flex gap-3 align-items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm border border-black ${segmentButtonDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'
                        }`}
                    disabled={segmentButtonDisabled}
                >
                    {loadingMask ? (
                        <div>
                            <img src={load} alt="" className="w-6 rounded-full" />
                        </div>
                    ) : (
                        <img src={maps} alt="" className="w-6 rounded-full" />
                    )}
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
    )
}

export default UtilityButtons