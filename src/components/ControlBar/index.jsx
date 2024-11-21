import SearchComponent from "../SearchComponent";
import DropDowns from "../Dropdowns";
import OpacitySlider from "../OpacitySlider";

const ControlBar = ({enableROI, ROISelection,handleROISelection, ROIdata, getROIdata,enableClasses, classSelection, handleClassSelection, classdata, getclassdata, showMask,setOpacitySlider,opacitySlider,imageData, handleSliderChange,setIsDraggingSlider }) => {
    return (
        <div className="absolute m-3 d-flex gap-11 flex-wrap z-[1000] left-16 max-[1077px]:gap-7 ">{/*component*/}
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
    )
    
}
export default ControlBar;