import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Business, Place, Close, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/HamburgerBox";
import PlanningMap from "../components/PlanningMap";
import BasicDatePicker from "../components/Calendar"; 
import TimePicker from "../components/Time";
import CustomToast from "../components/CustomToast";
import { toast } from "react-toastify";
import postService from "../services/postService";
import getTaxiZones from "../services/getTaxiZones";
import getBusynessScores from "../services/getBusynessScores";
import getRecommendations from "../services/getRecommendations";
import getBusinessUnits from "../services/getBusinessUnits";
import getVendors from "../services/getVendorDetails";
import dayjs from 'dayjs';

const Planning = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [zoneRecommendationData, setZoneRecommendationData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [businessUnit, setBusinessUnit] = useState(null);
  const [authorisedVendors, setAuthorisedVendors] = useState([]);
  const [areas, setAreas] = useState(null);
  const [zoneID, setZoneID] = useState(null);
  const [locationCords, setLocationCords] = useState(null);
  const [taxiZones, setTaxiZones] = useState(null);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [address, setAddress] = useState("");
  const [showPlanningBox, setShowPlanningBox] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime || !businessUnit || !authorisedVendors.length || !areas || !address) {
      let missingField = "";
      if (!selectedDate) missingField = "Date";
      else if (!selectedStartTime) missingField = "Start Time";
      else if (!selectedEndTime) missingField = "End Time";
      else if (!businessUnit) missingField = "Business Unit";
      else if (!authorisedVendors.length) missingField = "Authorised Vendors";
      else if (!areas) missingField = "Area";
      else if (!address) missingField = "Address";

      if(missingField === "Address") {
        toast(<CustomToast header="ALERT" text={`Please select a marker to set your Address`} />);
        return;
      }
      toast(<CustomToast header="WARNING" text={`Please enter ${missingField}`} />);
      return;
    }

    const startHour = selectedStartTime.hour();
    const endHour = selectedEndTime.hour();

    if ((startHour >= 1 && startHour < 4) || (endHour >= 1 && endHour < 4)) {
      setSelectedStartTime("");
      setSelectedEndTime("");
      toast(<CustomToast header="WARNING" text="Early morning services are not available." />);
      return;
    }

    if (selectedStartTime.isAfter(selectedEndTime)) {
      setSelectedStartTime("");
      setSelectedEndTime("");
      toast(<CustomToast header="WARNING" text="Start Time cannot be greater than End Time." />);
      return;
    }

    if (!locationCords) {
      toast(<CustomToast header="WARNING" text="Please select location on the map" />);
      return;
    }
    console.log(locationCords)
    const formData = {
      unit: businessUnits.find((business) => business.unit_name === businessUnit)?.permit_id,
      vendors: vendors.filter((vendor) => authorisedVendors.includes(vendor.vendor_name)).map((vendor) => vendor.licence_id),
      service_date: selectedDate.format("YYYY-MM-DD"),
      service_start_time: selectedStartTime.format("HH:mm:ss"),
      service_end_time: selectedEndTime.format("HH:mm:ss"),
      location_coords: `SRID=4326;POINT(${locationCords.lng} ${locationCords.lat})`,
      location_address: address,
      revenue: "250",
    };

    try {
      const result = await postService(formData);
      if (result) {
        navigate("/services", { state: { formData } });
      } else {
        toast(<CustomToast header="ERROR" text="Failed to create service. Please try again." />);
      }
    } catch (error) {
      toast(<CustomToast header="ERROR" text="An error occurred while creating the service. Please try again" />);
    }
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  const handleStartTimeChange = (time) => {
    const hour = time.hour();
    setSelectedStartTime(time);
  };

  const handleEndTimeChange = (time) => {
    const hour = time.hour();
    setSelectedEndTime(time);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const taxiZones = await getTaxiZones();
        setTaxiZones(taxiZones);

        const businessUnits = await getBusinessUnits();
        setBusinessUnits(businessUnits);

        const vendors = await getVendors();
        setVendors(vendors);
      } catch (error) {
        toast(<CustomToast header="WARNING" text="Failed to fetch vendors and business data. Please try again." />);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate || !selectedStartTime || !selectedEndTime) {
        return;
      }

      setLoading(true);
      try {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const formattedStartTime = selectedStartTime.format("HH:mm:ss");
        const formattedEndTime = selectedEndTime.format("HH:mm:ss");

        const response = await getBusynessScores(formattedDate, formattedStartTime, formattedEndTime);
        let data = response.data;
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        const features = data.features;
        const filteredData = features.map((item) => ({
          geometry: item.geometry,
          score: item.Score,
        }));
        setCoordinates(filteredData);
      } catch (error) {
        toast(<CustomToast header="WARNING" text="Failed to fetch busyness scores. Please try again." />);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, selectedStartTime, selectedEndTime]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(selectedDate)
      console.log(selectedStartTime)
      console.log(selectedEndTime)
      console.log(zoneID)

      if (!selectedDate || !selectedStartTime || !selectedEndTime || !zoneID) {
        return;
      }

      setLoading(true);
      try {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const formattedStartTime = selectedStartTime.format("HH:mm:ss");
        const formattedEndTime = selectedEndTime.format("HH:mm:ss");

        const response = await getRecommendations(formattedDate, formattedStartTime, formattedEndTime, zoneID, 5);
        console.log(response)
        let data = JSON.parse(response);
        const features = data.features;
        const filteredData = features.map((item) => ({
          geometry: item.geometry,
          properties: item.properties, 
        }));
        setZoneRecommendationData(filteredData);
      } catch (error) {
        toast(<CustomToast header="WARNING" text="Failed to fetch recommendations. Please try again." />);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, selectedStartTime, selectedEndTime, zoneID]);

  const handleSelectedZone = (zoneId) => {
    const area = taxiZones.features.find((zone) => zone.geometry.zone_id === zoneId)?.geometry.zone;
    setAreas(area);
    setZoneID(zoneId);
  };

  const handleMarkerClick = (address) => {
    setAddress(address);
  };

  const formContainerStyle = {
    top: "75px",
    left: showPlanningBox ? "20px" : "-100vw",
    opacity: showPlanningBox ? 1 : 0,
    height: "auto",
    width: "20vw",
    minWidth: "250px",
    borderRadius: "20px",
    p: 1.5,
    position: "absolute",
    zIndex: 10,
    backdropFilter: "blur(30px)",
    transition: "left 0.3s ease-in-out, opacity 0.3s ease-in-out",
  };

  const inputFieldStyle = {
    mb: 2,
  };

  const submitButtonStyle = {
    color: "white",
    bgcolor: "orangered",
    display: "flex",
    justifyContent: "center",
    mt: "10px",
    textAlign: "center",
    width: "100%",
  };

  const toggleButtonStyle = {
    position: "absolute",
    top: "75px",
    left: showPlanningBox ? "calc(20vw + 20px)" : "10px",
    zIndex: 11,
    transition: "left 0.3s ease-in-out",
    backgroundColor: "orangered",
    color: "white",
    "&:hover": {
      backgroundColor: "darkorange",
    },
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return (
    <Box>
      <AppBar logout={logout} />
      <Box sx={mapContainerStyle}>
        <PlanningMap
          initialHeatMapCor={coordinates}
          zoneRecommendationData={zoneRecommendationData}
          taxiZoneData={taxiZones}
          selectedZone={selectedZone}
          selectedCord={locationCords}
          setSelectedCord={setLocationCords}
          handleSelectedZone={handleSelectedZone}
          onMarkerClick={handleMarkerClick} 
        />
      </Box>

      <Box sx={formContainerStyle}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1000,
              borderRadius: "20px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Typography variant="h5" sx={{ color: "orangered" }}>
          Plan A Service
        </Typography>

        <BasicDatePicker 
          onDateChange={handleDateChange} 
          sx={{ mb: 5 }}
          minDate={dayjs()}
          maxDate={dayjs().add(2, 'week')}
        />

        <TimePicker name="Start Time" onTimeChange={handleStartTimeChange} selectedDate={selectedDate} />

        <TimePicker name="End Time" onTimeChange={handleEndTimeChange} selectedDate={selectedDate} />

        <Autocomplete
          fullWidth
          options={taxiZones ? taxiZones.features.map((zone) => zone.geometry.zone) : []}
          value={areas}
          onChange={(event, newValue) => {
            setAreas(newValue);
            const zoneDetails = taxiZones.features.find((zone) => zone.geometry.zone === newValue);
            setSelectedZone(zoneDetails);
          }}
          isOptionEqualToValue={(option, value) => option === value}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Areas"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Place />
                  </InputAdornment>
                ),
              }}
              sx={inputFieldStyle}
            />
          )}
        />

        <Autocomplete
          fullWidth
          options={businessUnits ? businessUnits.map((unit) => unit.unit_name) : []}
          value={businessUnit}
          onChange={(event, newValue) => {
            const newBusinessUnit = newValue;
            setBusinessUnit(newBusinessUnit);
          }}
          isOptionEqualToValue={(option, value) => option === value}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Business Unit"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
              sx={inputFieldStyle}
            />
          )}
        />

        <FormControl fullWidth sx={inputFieldStyle}>
          <InputLabel id="vendors-label">Authorised Vendors</InputLabel>
          <Select
            labelId="vendors-label"
            multiple
            value={authorisedVendors}
            onChange={(event) => {
              const newVendor = event.target.value;
              setAuthorisedVendors(event.target.value);
            }}
            input={<OutlinedInput label="Authorised Vendors" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {vendors.map((vendor) => (
              <MenuItem key={vendor.vendor_name} value={vendor.vendor_name}>
                {vendor.vendor_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={inputFieldStyle}
        />

        <Button sx={submitButtonStyle} variant="contained" onClick={handleClick}>
          Submit
        </Button>

        <IconButton
          sx={{ position: "absolute", top: "10px", right: "10px", color: "orangered" }}
          onClick={() => setShowPlanningBox(false)}
        >
          <Close />
        </IconButton>
      </Box>

      {!showPlanningBox && (
        <IconButton sx={toggleButtonStyle} onClick={() => setShowPlanningBox(true)}>
          <ArrowForward />
        </IconButton>
      )}
    </Box>
  );
};

export default Planning;
