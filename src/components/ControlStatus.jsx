import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { statusData } from "../resources/data";

const ControlStatus = ({ statusProduct, setStatusProduct }) => {
  const handleChange = (e) => {
    setStatusProduct(e.target.value);
  };

  return (
    <FormControl fullWidth sx={{ width: 200, mt: 2 }}>
      <InputLabel id="demo-simple-select-label">Trạng thái đơn hàng</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={statusProduct}
        label="Trạng thái đơn hàng"
        onChange={handleChange}
      >
        {statusData.map(({ status }) => (
          <MenuItem value={status} key={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ControlStatus;
