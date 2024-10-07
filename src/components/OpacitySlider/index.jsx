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
  const handleSliderInputChange = (name) => (e) => {
    const newValue = parseFloat(e.target.value);
    handleSliderChange(name, newValue - imageData[name].opacity);
  };
  return (
    <>
      {opacitySlider && (
        Object.keys(imageData).map((name, index) => (
          <SliderContainer key={index} style={{ bottom: `${30 + index * 20}%` }}>
            <SliderLabel>{name.charAt(0).toUpperCase() + name.slice(1)} Opacity</SliderLabel>
            <div className='flex justify-center items-center gap-1 z-[1000]'>
              <button className='btn btn-sm rounded-circle btn-primary ' onClick={handleSliderChange(name, -0.1)} disabled={(imageData[name].opacity) <= 0}>-</button>
              <StyledSlider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={imageData[name].opacity}
                onChange={handleSliderInputChange(name)}
              />
              <button className='btn btn-sm rounded-circle btn-primary ' onClick={handleSliderChange(name, 0.1)} disabled={imageData[name].opacity >= 1}>+</button>
            </div>
            <SliderLabel>Area: {imageData[name].area} km{<sup>2</sup>}</SliderLabel>
          </SliderContainer>))
      )}
    </>
  )
}

export default OpacitySlider
