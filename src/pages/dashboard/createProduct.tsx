import { useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getProductId } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductosCreateIsEdit from 'src/sections/two/create/view';

// ----------------------------------------------------------------------
type Props = {
  id?: string;
};

export default function PageProduct({ id }: Props) {
  const settings = useSettingsContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getProductId(id));
    }
  }, [dispatch, id]);

  const { productData } = useSelector((state) => state.product);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={id ? 'Editar produto' : 'Criar Novo'}
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Produtos', href: paths.dashboard.two },
          { name: id ? 'Editar produto' : 'Criar novo produto' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ProductosCreateIsEdit isEdit currentUser={productData || {}} />
    </Container>
  );
}
