import * as yup from 'yup';

export const addressValidationSchema = yup.object().shape({
  street: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zip_code: yup.string().required(),
  country: yup.string().required(),
  organization_id: yup.string().nullable(),
});
