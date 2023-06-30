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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createAddress } from 'apiSdk/addresses';
import { Error } from 'components/error';
import { addressValidationSchema } from 'validationSchema/addresses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { AddressInterface } from 'interfaces/address';

function AddressCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AddressInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAddress(values);
      resetForm();
      router.push('/addresses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AddressInterface>({
    initialValues: {
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: addressValidationSchema,
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
            Create Address
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="street" mb="4" isInvalid={!!formik.errors?.street}>
            <FormLabel>Street</FormLabel>
            <Input type="text" name="street" value={formik.values?.street} onChange={formik.handleChange} />
            {formik.errors.street && <FormErrorMessage>{formik.errors?.street}</FormErrorMessage>}
          </FormControl>
          <FormControl id="city" mb="4" isInvalid={!!formik.errors?.city}>
            <FormLabel>City</FormLabel>
            <Input type="text" name="city" value={formik.values?.city} onChange={formik.handleChange} />
            {formik.errors.city && <FormErrorMessage>{formik.errors?.city}</FormErrorMessage>}
          </FormControl>
          <FormControl id="state" mb="4" isInvalid={!!formik.errors?.state}>
            <FormLabel>State</FormLabel>
            <Input type="text" name="state" value={formik.values?.state} onChange={formik.handleChange} />
            {formik.errors.state && <FormErrorMessage>{formik.errors?.state}</FormErrorMessage>}
          </FormControl>
          <FormControl id="zip_code" mb="4" isInvalid={!!formik.errors?.zip_code}>
            <FormLabel>Zip Code</FormLabel>
            <Input type="text" name="zip_code" value={formik.values?.zip_code} onChange={formik.handleChange} />
            {formik.errors.zip_code && <FormErrorMessage>{formik.errors?.zip_code}</FormErrorMessage>}
          </FormControl>
          <FormControl id="country" mb="4" isInvalid={!!formik.errors?.country}>
            <FormLabel>Country</FormLabel>
            <Input type="text" name="country" value={formik.values?.country} onChange={formik.handleChange} />
            {formik.errors.country && <FormErrorMessage>{formik.errors?.country}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
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
    entity: 'address',
    operation: AccessOperationEnum.CREATE,
  }),
)(AddressCreatePage);
