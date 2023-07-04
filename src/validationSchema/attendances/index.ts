import * as yup from 'yup';

export const attendanceValidationSchema = yup.object().shape({
  selfie: yup.string().required(),
  time: yup.date().required(),
  location: yup.string().required(),
  user_id: yup.string().nullable(),
});
