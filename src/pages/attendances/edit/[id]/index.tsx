import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getAttendanceById, updateAttendanceById } from 'apiSdk/attendances';
import { Error } from 'components/error';
import { attendanceValidationSchema } from 'validationSchema/attendances';
import { AttendanceInterface } from 'interfaces/attendance';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function AttendanceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AttendanceInterface>(
    () => (id ? `/attendances/${id}` : null),
    () => getAttendanceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AttendanceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAttendanceById(id, values);
      mutate(updated);
      resetForm();
      router.push('/attendances');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AttendanceInterface>({
    initialValues: data,
    validationSchema: attendanceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Attendance
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="selfie" mb="4" isInvalid={!!formik.errors?.selfie}>
              <FormLabel>Selfie</FormLabel>
              <Input type="text" name="selfie" value={formik.values?.selfie} onChange={formik.handleChange} />
              {formik.errors.selfie && <FormErrorMessage>{formik.errors?.selfie}</FormErrorMessage>}
            </FormControl>
            <FormControl id="time" mb="4">
              <FormLabel>Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.time ? new Date(formik.values?.time) : null}
                  onChange={(value: Date) => formik.setFieldValue('time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'attendance',
    operation: AccessOperationEnum.UPDATE,
  }),
)(AttendanceEditPage);
