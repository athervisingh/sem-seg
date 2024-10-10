import React from 'react'
import ClassModel from '../ClassModel'
import MapModel from '../MapModel'

const DropDowns = ({ dataTour, enable, value, handleChange, heading, data, modal, getData }) => {
    return (
        <div
            data-tour={dataTour}
            className="d-flex gap-3"
            style={{ zIndex: "1000", top: "10px", minWidth: '280px' }}
        >
            <select
                className={`form-select form-select w-100 border rounded border-black w-full ${!enable ? 'cursor-not-allowed opacity-70':'cursor-pointer opacity-100'}`}
                aria-label="Default select example"
                disabled={!enable}
                value={value || ""}
                onChange={handleChange}
                style={{ fontSize: '12px', fontWeight: "bold" }}
            >
                <option value="-1">{heading}</option>
                {data}
            </select>
            <div
                className="w-50"
                style={{ zIndex: "1000", top: "50px", left: "10%", right: "10%" }}
            >
                <button
                    disabled={!enable}
                    type="button"
                    className={`btn btn-primary w-100 ${!enable ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}`}
                    data-bs-toggle="modal"
                    data-bs-target={modal}
                >
                    New
                </button>
            </div>
            {heading === "Classes" ? <ClassModel data={data} getclassdata={getData} /> : <MapModel ROIdata={getData} />}
        </div>
    )
}

export default DropDowns
