import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const citiesApiUrl = 'https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4';
const doctorSpecialtiesApiUrl = 'https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca';
const doctorsApiUrl = 'https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21';


export const fetchCities = createAsyncThunk('state/fetchCities', async () => {
  const response = await fetch(citiesApiUrl);
  const data = await response.json();
  return data;
});

export const fetchDoctorSpecialties = createAsyncThunk('state/fetchDoctorSpecialties', async () => {
  const response = await fetch(doctorSpecialtiesApiUrl);
  const data = await response.json();
  return data;
});

export const fetchDoctors = createAsyncThunk('state/fetchDoctors', async () => {
  const response = await fetch(doctorsApiUrl);
  const data = await response.json();
  return data;
});


interface IState {
  cities: ICity[];
  doctorSpecialties: IDoctorSpecialty[];
  doctors: IDoctor[];
}

interface ICity {
  id: string,
  name: string
}

interface IDoctorSpecialty {
  id: string,
  name: string
  params?: {
    gender?: string,
    maxAge?: string,
    minAge?: string
  }
}

interface IDoctor {
  id: string,
  cityId: string,
  isPediatrician: boolean,
  name: string,
  specialityId: string,
  surname: string
}

const initialState: IState = {
  cities: [],
  doctorSpecialties: [],
  doctors: [],
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(fetchDoctorSpecialties.fulfilled, (state, action) => {
        state.doctorSpecialties = action.payload;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      });
  },
});

export default stateSlice.reducer;
