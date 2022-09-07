import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import {toast} from 'react-toastify';

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { TextField, Button, Modal } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import UpdateModal from './updateModal';
import { setAdminUpdateModal } from '../../../../redux/reducers/modalReducer'
import Toast from '../../../common/Toast';
import userApi from '../../../../api/userApi';
import { setAllUser } from '../../../../redux/reducers/userReducer';

export default function Users() {
  document.title = 'Users | Administrator';

  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [openModalSubmit, setOpenModalSubmit] = useState(false);

  const users = useSelector(state => state.user.allUser);
  
  let rows = users;

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: 'createdAt',
      numeric: false,
      disablePadding: true,
      label: 'CreatedAt',
    },
    {
      id: 'fullname',
      numeric: false,
      disablePadding: false,
      label: 'Fullname',
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
    },
    {
      id: 'phone',
      numeric: false,
      disablePadding: false,
      label: 'Phone',
    },
    {
      id: 'password',
      numeric: false,
      disablePadding: true,
      label: 'Password',
    },
    {
      id: 'permission',
      numeric: false,
      disablePadding: true,
      label: 'Permission',
    },
    {
      id: 'actions',
      numeric: true,
      disablePadding: false,
      label: 'Actions',
    },
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleView = (row) => {
    dispatch(setAdminUpdateModal({type: true, data: row}))
  }

  const handleDelete = async (e) => {
    setLoading(true);
    let data = [];
    selected.length? data = selected:data.push(e._id);
    try {
      const users = await userApi.delete(data)
      dispatch(setAllUser(users))
      Toast('success', 'Deleted successfully!!!');
      setLoading(false);
      setSelected([]);
      setOpenModalSubmit(false);
    } catch {
      Toast('error', 'Ohshit - Has been error!😢');
    }
  }

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            No Selected
          </Typography>
        )}

        {numSelected > 0 ? (
          <Box>
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon color='error' />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row._id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      flexDirection: 'column',
      background: `url()`
    }}>
      <Paper sx={{ width: '100%', mb: 1, p: 0 }}>
        <Box sx={{p:2, fontWeight: 600}}>Total {rows.length}</Box>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox"
                      onClick={(event) => handleClick(event, {...row})}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                        </TableCell>
                      <TableCell 
                        scope="row"
                        padding="none"
                      >
                          {row.createdAt.split('T')[0]}
                      </TableCell>
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell padding='none'><TextField variant='standard' disabled defaultValue={row.password} type='password' /></TableCell>
                      <TableCell>{row.permission===0?'Amin':'User'}</TableCell>
                      <TableCell align='right' 
                        > 
                        <Button 
                          type='submit'
                          color='error'
                          onClick={() => setOpenModalSubmit(true)}
                        ><DeleteIcon /></Button>
                        <Button 
                          onClick={() => handleView(row)}
                        ><RemoveRedEyeIcon /></Button>
                      </TableCell>
                      <Modal
                        open={openModalSubmit}
                        onClose={() => setOpenModalSubmit(false)}
                        hideBackdrop
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            width: 400,
                            border: '2px solid #11568C',
                            boxShadow: 24,
                            p: 4,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='h5'>Do you want to delete this user?</Typography>
                          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', pt: 4}}>
                            <Button variant='outlined' color='primary' sx={{width: '100px'}} onClick={() =>  {setLoading(false); setOpenModalSubmit(false)}}>Cancel</Button>
                            <LoadingButton variant='outlined' color='error' sx={{width: '100px'}} loading={loading} onClick={() => handleDelete(row)}>Delete</LoadingButton>
                          </Box>
                        </Box>
                      </Modal>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <UpdateModal />
    </Box>
  );
}
