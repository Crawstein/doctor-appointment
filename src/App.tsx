import { Formik } from 'formik';
import FormComponent from './components/FormComponent';

const App: React.FC = () => {

  function capitalizeWords(str: string) {
    let words = str.split(' '); // Split the string into an array of words
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1); // Capitalize the first letter of each word
    }
    return words.join(' '); // Join the words back into a string
  }

  interface IFormErrors {
    phone?: string
  }
  return (
    <>
      <Formik
        initialValues={{
          "name": "",
          "birthdayDate": "",
          "sex": "",
          "city": "",
          "specialty": "",
          "doctor": "",
          "email": "",
          "phone": ""
        }}
        validate={(values) => {
          const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
          const phoneNumberRegex = /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
          const errors: IFormErrors = {};
          if (!values.email && !values.phone) {
            errors.phone = 'Please provide at least one of the following: email or phone number';
          }

          if (values.email && !emailRegex.test(values.email)){
            errors.phone = 'Please, enter a valid email adress'
          }

          if (values.phone && !phoneNumberRegex.test(values.phone)){
            errors.phone = 'Please, enter a valid phone number'
          }


            return errors;
        }}
        onSubmit={(values) => {
          values.name = capitalizeWords(values.name.trim())
          values.phone = values.phone.trim()
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <FormComponent />
      </Formik>
    </>
  );
};

export default App;
