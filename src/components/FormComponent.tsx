import { Field, Form, ErrorMessage, useFormikContext } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './../redux-toolkit/rootReducer';
import { AppDispatch } from './../redux-toolkit';
import {
  fetchCities,
  fetchDoctorSpecialties,
  fetchDoctors,
} from './../redux-toolkit/stateSlice';
import { useState, useEffect } from 'react';


const FormComponent: React.FC = () => {

    interface IValues {
      name: string,
      birthdayDate: string,
      sex: string,
      city: string,
      specialty: string,
      doctor: string,
      email: string,
      phone: string
    }
  
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
      dispatch(fetchCities());
      dispatch(fetchDoctorSpecialties());
      dispatch(fetchDoctors());
    }, [dispatch]);
  
    const { cities, doctorSpecialties, doctors } = useSelector((state: RootState) => state.state);
    const [citiesState, setCitiesState] = useState(cities);
    const [doctorSpecialtiesState, setDoctorSpecialtiesState] = useState(doctorSpecialties);
    const [doctorsState, setDoctorsState] = useState(doctors);
  
    // Prevent empty states
    useEffect(() => {
      if (cities.length > 0) {
        setCitiesState(cities);
      }
    }, [cities]);
  
    useEffect(() => {
      if (doctorSpecialties.length > 0) {
        setDoctorSpecialtiesState(doctorSpecialties);
      }
    }, [doctorSpecialties]);
  
    useEffect(() => {
      if (doctors.length > 0) {
        setDoctorsState(doctors);
      }
    }, [doctors]);
  
    const { values, setFieldValue } = useFormikContext<IValues>();
  
    useEffect(() => {
  
      setDoctorsState(doctors)
      setDoctorSpecialtiesState(doctorSpecialties)
  
      // Filter on birthday date
      if (values.birthdayDate) {
  
        const birthDate: Date = new Date(values.birthdayDate);
        const today: Date = new Date();
  
        let age: number = today.getFullYear() - birthDate.getFullYear();
  
        // Age precision (day/month)
        if (
          birthDate.getMonth() > today.getMonth() ||
          (birthDate.getMonth() === today.getMonth() && birthDate.getDate() > today.getDate())
        ) {
          age--;
        }
        if (age < 45) {
          setDoctorsState((prev) => {
            return prev.filter(
              (item) => item.specialityId !== '12'
            );
          });
          setDoctorSpecialtiesState((prev) => {
            return prev.filter(
              (item) => item.id !== '12'
            );
          })
        }
  
        if (age > 16) {
          setDoctorsState((prev) => {
            return prev.filter(
              (item) => item.specialityId !== '11'
            );
          });
          setDoctorSpecialtiesState((prev) => {
            return prev.filter(
              (item) => item.id !== '11'
            );
          })
        }
  
        setDoctorsState((prev) => {
          const filteredDoctors = age <= 16
            ? prev.filter((item) => item.isPediatrician)
            : prev.filter((item) => !item.isPediatrician);
  
          return filteredDoctors;
        });
  
        const selectedDoctor = values.doctor;
        const selectedDoctorExists = doctorsState.some((item) => item.id === selectedDoctor);
        const selectedDoctorIsPediatrician = selectedDoctorExists && doctorsState.find((item) => item.id === selectedDoctor)?.isPediatrician;
        if (selectedDoctorIsPediatrician && age > 16) {
          setFieldValue('doctor', '')
        } else if (!selectedDoctorIsPediatrician && age <= 16) {
          setFieldValue('doctor', '')
        }
      }
  
      // Filter on city
      if (values.city && citiesState) {
        setDoctorsState((prev) => {
          return prev.filter((item) => {
            if (citiesState === undefined){return}
            const filteredDoctors = citiesState.find((item) => item.id === values.city)?.id === item.cityId
            return filteredDoctors
          })
        })
      }
  
      // Filter on sex
      if (values.sex) {
        const oppositeSex: string = values.sex === 'male' ? 'Female' : 'Male';
        setDoctorSpecialtiesState((prev) => {
          return prev.filter((item) => item?.params?.gender !== oppositeSex);
        });
  
        setDoctorsState((prev) => {
          return prev.filter((item) => {
            const specialty = doctorSpecialties.find(
              (specialtyItem) => specialtyItem.id === item.specialityId
            );
            if (specialty?.params) {
              if (
                (values.sex === "male" && specialty.params.gender === "Female") ||
                (values.sex === "female" && specialty.params.gender === "Male")
              ) {
                return false;
              }
            }
  
            return true;
          });
        });
      }
  
      // Filter on specialty
      if (values.specialty) {
        setDoctorsState((prev) => {
          return prev.filter((item) => {
            const filteredDoctors = doctorSpecialtiesState.find((item) => item.id === values.specialty)?.id === item.specialityId
            return filteredDoctors
          })
        })
      }
    }, [values]);
  
    // Get current date for date input
    const getCurrentDate = (): string => {
      const today = new Date();
      const year: number = today.getFullYear();
      let month: string | number = today.getMonth() + 1;
      let day: string | number = today.getDate();
  
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
  
      return `${year}-${month}-${day}`;
    };
  
  
    // Filling up missing values on doctor selection
    const fillMissingInputs = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const selectedDoctor = event.target.value;
      setFieldValue('doctor', selectedDoctor);
      setFieldValue("city", doctors.find((item) => item.id === selectedDoctor)?.cityId || '');
      setFieldValue("specialty", doctors.find((item) => item.id === selectedDoctor)?.specialityId || '');
    }
  
    const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Clear doctor and specialty input in case current one is not available
  const refreshDoctors = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsRefreshing(true);
    const { name, value } = event.target;
  
    if (name === 'specialty') {
      const availableSpecialties = doctorSpecialtiesState.map((item) => item.id);
      if (!availableSpecialties.includes(value)) {
        setFieldValue('specialty', '');
      }
    }
  
    if (name === 'doctor') {
      const availableDoctors = doctorsState.map((item) => item.id);
      if (!availableDoctors.includes(value)) {
        setFieldValue('doctor', '');
      }
    }
  
    setFieldValue(name, value);
    setIsRefreshing(false);
  };
  
  useEffect(() => {
    if (!isRefreshing) {
      const availableSpecialties = doctorSpecialtiesState.map((item) => item.id);
      if (!availableSpecialties.includes(values.specialty)) {
        setFieldValue('specialty', '');
      }
  
      const availableDoctors = doctorsState.map((item) => item.id);
      if (!availableDoctors.includes(values.doctor)) {
        setFieldValue('doctor', '');
      }
    }
  }, [doctorSpecialtiesState, doctorsState, values.specialty, values.doctor, isRefreshing]);
  
    return (
      <Form>
        <Field type="text" pattern="[^0-9]+" required name="name" placeholder="Name" />
        <Field type="date" required onChange={refreshDoctors} placeholder="Birthday Date" name="birthdayDate" min="1900-01-01" max={getCurrentDate()}/>
        <Field as="select" required name="sex" onChange={refreshDoctors}>
          <option value="" className='disabled-option'>Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Field>
        <Field as="select" required name="city" onChange={refreshDoctors}>
          <option value="" className='disabled-option'>City</option>
          {citiesState.map(item => {
            return <option key={item.id} value={item.id}>{item.name}</option>
          })}
        </Field>
        <Field as="select" name="specialty" onChange={refreshDoctors}>
          <option value="" className='disabled-option'>Doctor's Specialty</option>
          {doctorSpecialties.map(item => {
            if (doctorSpecialtiesState.some(obj => obj.id === item.id)) {
              return <option key={item.id} value={item.id}>{item.name}</option>
            } else {
              return <option disabled key={item.id} value={item.id}>{item.name}</option>
            }
          })}
        </Field>
        <Field as="select" required name="doctor" placeholder="Doctor" onChange={fillMissingInputs}>
          <option value="" className='disabled-option'>Doctor</option>
          {doctors.map(item => {
            const specialty = doctorSpecialties.find((specialty) => specialty.id === item.specialityId);
            const specialtyName = specialty ? specialty.name : '';
            if (doctorsState.some(obj => obj.id === item.id)) {
              return <option key={item.id} value={item.id}>{item.name} {item.surname}, {specialtyName}</option>
            } else {
              return <option disabled key={item.id} value={item.id}>{item.name} {item.surname}, {specialtyName}</option>
            }
          })}
        </Field>
        <Field type="email" name="email" placeholder="Email" />
        <Field type="tel" name="phone" placeholder="Phone Number" />
        <ErrorMessage name="phone" component="div" className="error" />
        <button type="submit">Submit</button>
      </Form>
    )
  }


  export default FormComponent