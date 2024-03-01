/* eslint-disable import/no-extraneous-dependencies */
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Container, Typography } from '@mui/material';

import { useDispatch } from 'src/redux/store';
import { saveProduct, createProduct } from 'src/redux/slices/product';

import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

import { Product } from 'src/types/product';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
type FormValues = any;

type Props = {
  isEdit?: boolean;
  currentUser?: Product;
};

export default function ProductosCreateIsEdit({ isEdit = false, currentUser }: Props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Paramêtro obrigatorio'),
    description: Yup.string().required('Paramêtro obrigatorio'),
    value: Yup.string().required('Paramêtro obrigatorio'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || undefined,
      name: currentUser?.name || '',
      description: currentUser?.description || '',
      value: currentUser?.value || '',
    }),
    [currentUser]
  );

  const methods = useForm<FormValues>({
    // @ts-ignore
    resolver: yupResolver<CreateBlock>(registerSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: FormValues) => {
    const body = {
      ...data,
    };

    try {
      if (currentUser?.id) {
        await dispatch(saveProduct(currentUser?.id, body));
        enqueueSnackbar('Produto editado com sucesso');
        navigate('/dashboard/two');
      } else {
        await dispatch(createProduct(body));
        navigate('/dashboard/two');
        enqueueSnackbar('Produto criado com sucesso');
      }
      methods.reset();
    } catch (error) {
      console.error('Não foi possível processar a requisição', error);
    }
  };

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser, reset, defaultValues]);

  return (
    <Container>
      <Typography sx={{ typography: 'body2', color: '#637381', fontWeight: 700, marginBottom: 3 }}>
        INFORMAÇÕES DO PRODUTO
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <RHFTextField
            name="name"
            label="Nome do produto*"
            sx={{ width: '100%', maxWidth: '285px' }}
          />
          <RHFTextField
            name="description"
            label="Descrição do produto*"
            sx={{ width: '100%', maxWidth: '285px' }}
          />
          <RHFTextField
            name="value"
            label="R$ Valor do produto*"
            sx={{ width: '100%', maxWidth: '285px' }}
          />
        </Box>
        <LoadingButton
          sx={{
            width: '144px',
            height: '45px',
            color: 'white',
            marginTop: 4,
            background: isValid ? '#0063FF' : '#CCCCCC',
            '&:hover': {
              background: isValid ? '#0051C7' : '#CCCCCC',
            },
          }}
          type="submit"
          loading={isSubmitting}
          disabled={!isValid}
        >
          Salvar
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}
