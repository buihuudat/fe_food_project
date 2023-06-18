import React from "react";
import { Box, Button, Fab, Grid, Typography } from "@mui/material";
import Item from "./Item";
import { useDispatch, useSelector } from "react-redux";
import AddVoucher from "./AddVoucher";
import AddIcon from "@mui/icons-material/Add";
import { setAddVoucherModal } from "../../../../redux/reducers/modalReducer";
import voucherApi from "../../../../api/voucherApi";
import { setVoucher } from "../../../../redux/reducers/voucherReducer";
import { useEffect } from "react";
import DeleteModal from "./deleteModal";

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
                  <Item props={voucher} />
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
      <AddVoucher />
      <DeleteModal />
    </Box>
  );
};

export default Vouchers;
