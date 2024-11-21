import toggleGif from "../../assets/toggle.gif"
import classGif from "../../assets/class.gif"
import roiGif from "../../assets/roi.gif"
import advancedGif from "../../assets/advanced.gif"


export const TourStep = (beacon) => [// 1 component
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