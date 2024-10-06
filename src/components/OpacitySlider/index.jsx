import React from 'react'
import styled from 'styled-components';

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

const OpacitySlider = ({ opacitySlider, imageData, handleSliderChange, setIsDraggingSlider }) => {
    return (
        <>
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
                            onMouseDown={() => setIsDraggingSlider(true)}
                            onMouseUp={() => setIsDraggingSlider(true)}
                            onTouchStart={() => setIsDraggingSlider(true)}
                            onTouchEnd={() => setIsDraggingSlider(true)}
                        />
                        <SliderLabel>Area: {imageData[name].area} km{<sup>2</sup>}</SliderLabel>
                    </SliderContainer>))
            )}
        </>
    )
}

export default OpacitySlider
