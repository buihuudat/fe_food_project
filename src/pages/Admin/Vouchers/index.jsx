import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Fab, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import VoucherItem from "../../../components/voucherItem";
import AddVoucherModal from "../../../components/modals/adminVoucherAddModal";
import DeleteVoucherModal from "../../../components/modals/adminVoucherDeleteModal";
import voucherApi from "../../../utils/api/voucherApi";
import { setAddVoucherModal } from "../../../redux/reducers/modalReducer";
import { setVoucher } from "../../../redux/reducers/voucherReducer";

const Vouchers = () => {
  document.title = "Voucher | Administrator";

  const voucherData = useSelector((state) => state.voucher.data);
  const deleteVoucher = useSelector((state) => state.modal.deleteVoucher);
  const dispatch = useDispatch();

  useEffect(() => {
    const getVoucher = async () => {
      const voucher = await voucherApi.getAll();
      dispatch(setVoucher(voucher));
    };
    getVoucher();
  }, [dispatch, deleteVoucher]);

  const handleAdd = () => {
    dispatch(setAddVoucherModal(true));
  };

  return (
    <Box>
      {!voucherData.length ? (
        <Typography align="center" fontSize={30}>
          Chưa có voucher
        </Typography>
      ) : (
        <div>
          <Box p={3}>
            <Grid container spacing={3}>
              {voucherData.map((voucher, index) => (
                <Grid key={index} item xs={2.5}>
                  <VoucherItem props={voucher} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      )}
      <Fab
        color="primary"
        sx={{
          position: "absolute",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        onClick={handleAdd}
      >
        <AddIcon />
      </Fab>
      <AddVoucherModal />
      <DeleteVoucherModal />
    </Box>
  );
};

export default Vouchers;
