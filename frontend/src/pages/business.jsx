import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AppBar from "../components/HamburgerBox";
import DataGrid from "../components/DataGrid";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupIcon from "@mui/icons-material/Group";
import ImageCardBox from "../components/ImageCardBox";
import getBusinessUnits from "../services/getBusinessUnits";
import getVendors from "../services/getVendorDetails";
import postBusinessUnit from "../services/postBusinessUnit";
import postVendor from "../services/postVendor";
import deleteBusinessUnit from "../services/deleteBusinessUnit";
import deleteVendor from "../services/deleteVendor";
import putBusinessUnit from "../services/putBusinessUnit";
import putVendor from "../services/putVendor"; 
import AddDialog from "../components/AddDialog";
import CustomToast from "../components/CustomToast";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const buttonStyles = {
  marginTop: '-5px',
  mb: '5px',
  textTransform: "none",
  backgroundColor: "#F6F6F6",
  borderRadius: "10px",
  padding: "8px 16px",
  marginRight: "8px",
  color: "black",
  borderColor: "transparent",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "#E0E0E0",
    borderColor: "black",
    borderStyle: "solid",
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  "&:active": {
    transform: "scale(1.02)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(255, 105, 135, 0.5)",
  },
};

const boxStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  height: "100%",
  width: "100%",
};

const gridStyles = {
  container: {
    height: "100%",
    width: { sm: "100%", lg: "70%" },
    paddingBottom: "30px",
  },
  item: {
    marginTop: { xs: "5px", sm: "5px", md: "5px", lg: "0px" },
  },
  overflow: {
    overflowX: "auto",
    width: { xs: "90vw", sm: "95vw", md: "80vw" },
  },
};

export default function Business() {
  const [businessRows, setBusinessRows] = useState([]);
  const [vendorRows, setVendorRows] = useState([]);
  const [nextBusinessId, setNextBusinessId] = useState(1);
  const [nextVendorId, setNextVendorId] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [deleteType, setDeleteType] = useState(""); 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState(null); 
  const [editDialogType, setEditDialogType] = useState(""); 
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const businessData = await getBusinessUnits();
      const vendorData = await getVendors();
      setBusinessRows(businessData);
      setVendorRows(vendorData);
      setNextBusinessId(businessData.length + 1);
      setNextVendorId(vendorData.length + 1);
    } catch (error) {
      toast(<CustomToast />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const businessColumns = [
    { field: "unit_name", headerName: "Unit Name", width: 150, editable: false },
    { field: "permit_id", headerName: "Permit ID", width: 120, editable: false },
    {
      field: "permit_expiry_date",
      headerName: "Permit Expiry Date",
      width: 150,
      editable: false,
    },
    { field: "unit_type", headerName: "Unit Type", width: 100, editable: false },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row, "business")}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.permit_id, "business")}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const vendorColumns = [
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 150,
      editable: false,
    },
    {
      field: "licence_id",
      headerName: "Licence ID",
      width: 120,
      editable: false,
    },
    {
      field: "licence_expiry_date",
      headerName: "Expiry Date",
      width: 130,
      editable: false,
    },
    {
      field: "vendor_email",
      headerName: "Vendor Email",
      width: 200,
      editable: false,
    },
    {
      field: "vendor_phone_number",
      headerName: "Phone Number",
      width: 150,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row, "vendor")}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.licence_id, "vendor")}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleAddClick = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleAddBusinessUnit = async (newBusinessUnit) => {
    setLoading(true);
    try {
      const addedBusinessUnit = await postBusinessUnit(newBusinessUnit);
      setBusinessRows([...businessRows, { ...addedBusinessUnit, id: nextBusinessId }]);
      setNextBusinessId(nextBusinessId + 1);
    } catch (error) {
      toast(<CustomToast />);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (newVendor) => {
    setLoading(true);
    try {
      const addedVendor = await postVendor(newVendor);
      setVendorRows([...vendorRows, { ...addedVendor, id: nextVendorId }]);
      setNextVendorId(nextVendorId + 1);
    } catch (error) {
      toast(<CustomToast />);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogAdd = (data) => {
    if (dialogType === "business") {
      handleAddBusinessUnit(data);
    } else if (dialogType === "vendor") {
      handleAddVendor(data);
    }
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteClick = (id, type) => {
    setDeleteId(id);
    setDeleteType(type);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      if (deleteType === "business") {
        await deleteBusinessUnit(deleteId);
        setBusinessRows((prevRows) => prevRows.filter((row) => row.permit_id !== deleteId));
      } else if (deleteType === "vendor") {
        await deleteVendor(deleteId);
        setVendorRows((prevRows) => prevRows.filter((row) => row.licence_id !== deleteId));
      }
      toast(<CustomToast header="SUCCESS" text="Deleted successfully." />);
    } catch (error) {
      toast(<CustomToast header="ERROR" text="Failed to delete. Please try again." />);
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleEditClick = (row, type) => {
    if (type === "business") {
      setEditRow({ ...row, permit_expiry_date: dayjs(row.permit_expiry_date) });
    } else if (type === "vendor") {
      setEditRow({ ...row, licence_expiry_date: dayjs(row.licence_expiry_date) });
    }
    setEditDialogType(type);
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleEditConfirm = async () => {
    if (editDialogType === "business") {
      const { id, permit_id, unit_name, unit_type, permit_expiry_date } = editRow;
      const updatedData = {
        permit_id,
        unit_name,
        unit_type,
        permit_expiry_date: permit_expiry_date.format("YYYY-MM-DD"),
      };

      try {
        await putBusinessUnit(permit_id, updatedData);
        await fetchData();
        toast(
          <CustomToast header="SUCCESS" text="Business unit updated successfully." />
        );
        setEditDialogOpen(false);
      } catch (error) {
        toast(
          <CustomToast
            header="ERROR"
            text="Failed to update business unit. Please try again."
          />
        );
      }
    } else if (editDialogType === "vendor") {
      const { id, licence_id, vendor_name, licence_expiry_date, vendor_email, vendor_phone_number } = editRow;
      const updatedData = {
        licence_id,
        vendor_name,
        licence_expiry_date: licence_expiry_date.format("YYYY-MM-DD"),
        vendor_email,
        vendor_phone_number,
      };

      try {
        await putVendor(licence_id, updatedData);
        await fetchData();
        toast(
          <CustomToast header="SUCCESS" text="Vendor updated successfully." />
        );
        setEditDialogOpen(false);
      } catch (error) {
        toast(
          <CustomToast
            header="ERROR"
            text="Failed to update vendor. Please try again."
          />
        );
      }
    }
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
      <AppBar logout={logout} />

      <Box sx={{ flexGrow: 1, paddingLeft: "10px", paddingRight: "10px", mt: "64px", height: "80vh" }}>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}>
                  <ImageCardBox
                    Image={
                      <StorefrontIcon
                        style={{ color: "#f56c42", width: "35px", height: "35px" }}
                      />
                    }
                    Title="Number of Business Units"
                    Count={businessRows.length.toString()}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <ImageCardBox
                    Image={
                      <GroupIcon
                        style={{ color: "#f56c42", width: "35px", height: "35px" }}
                      />
                    }
                    Title="Number of Vendors"
                    Count={vendorRows.length.toString()}
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={gridStyles.container}>
              <Grid item xs={12}>
                <Box sx={boxStyles}>
                  <Box sx={{ p: "10px 0px 5px 0px", display: "grid", gridTemplateColumns: "auto 1fr", alignSelf: "start" }}>
                    <Typography sx={{ color: "black", pr: "10px", fontSize: "20px", fontWeight: "500", "@media (max-width: 600px)": { fontSize: "18px" }, "@media (min-width: 601px) and (max-width: 960px)": { fontSize: "20px" }, "@media (min-width: 961px)": { fontSize: "22px" } }}>
                      Business Units
                    </Typography>
                    <Button startIcon={<AddIcon />} sx={buttonStyles} onClick={() => handleAddClick("business")}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={gridStyles.overflow}>
                    <DataGrid rows={businessRows} columns={businessColumns} />
                  </Box>
                </Box>
              </Grid>

              <Grid sx={gridStyles.item} item xs={12}>
                <Box sx={boxStyles}>
                  <Box sx={{ p: "0px 0px 5px 0px", display: "grid", gridTemplateColumns: "auto 1fr", alignSelf: "start" }}>
                    <Typography sx={{ color: "black", pr: "10px", fontSize: "20px", fontWeight: "500", "@media (max-width: 600px)": { fontSize: "18px" }, "@media (min-width: 601px) and (max-width: 960px)": { fontSize: "20px" }, "@media (min-width: 961px)": { fontSize: "22px" } }}>
                      Authorised Vendors
                    </Typography>
                    <Button startIcon={<AddIcon />} sx={buttonStyles} onClick={() => handleAddClick("vendor")}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={gridStyles.overflow}>
                    <DataGrid rows={vendorRows} columns={vendorColumns} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Box>

      <AddDialog open={dialogOpen} handleClose={handleDialogClose} handleAdd={handleDialogAdd} type={dialogType} />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete {deleteType === "business" ? "Business Unit" : "Vendor"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this {deleteType === "business" ? "business unit" : "vendor"}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit {editDialogType === "business" ? "Business Unit" : "Vendor"}</DialogTitle>
        <DialogContent>
          {editDialogType === "business" ? (
            <>
              <TextField
                margin="dense"
                label="Unit Name"
                fullWidth
                value={editRow?.unit_name || ""}
                onChange={(e) => handleEditChange("unit_name", e.target.value)}
              />
              <Calendar
                label="Permit Expiry Date"
                value={editRow?.permit_expiry_date || dayjs()} 
                onDateChange={(newValue) => handleEditChange("permit_expiry_date", newValue)}
              />
              <TextField
                margin="dense"
                label="Unit Type"
                fullWidth
                value={editRow?.unit_type || ""}
                onChange={(e) => handleEditChange("unit_type", e.target.value)}
              />
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                label="Vendor Name"
                fullWidth
                value={editRow?.vendor_name || ""}
                onChange={(e) => handleEditChange("vendor_name", e.target.value)}
              />
              <Calendar
                label="Licence Expiry Date"
                value={editRow?.licence_expiry_date || dayjs()} 
                onDateChange={(newValue) => handleEditChange("licence_expiry_date", newValue)}
              />
              <TextField
                margin="dense"
                label="Vendor Email"
                fullWidth
                value={editRow?.vendor_email || ""}
                onChange={(e) => handleEditChange("vendor_email", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Vendor Phone Number"
                fullWidth
                value={editRow?.vendor_phone_number || ""}
                onChange={(e) => handleEditChange("vendor_phone_number", e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditConfirm} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
