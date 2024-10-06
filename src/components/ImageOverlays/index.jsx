import React from 'react'
import { ImageOverlay } from 'react-leaflet'

const ImageOverlays = ({imageData , imageBounds , showMask , handleMaskShow}) => {
    return (
        <>
            {
                Object.keys(imageData).map((name, index) => (
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
                ))
            }
        </>
    )
}

export default ImageOverlays
