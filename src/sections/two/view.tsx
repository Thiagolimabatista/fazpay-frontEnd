import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDispatch } from 'src/redux/store';
import { cleanProductData } from 'src/redux/slices/product';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CoverProducts from './cover-produtos';
// ----------------------------------------------------------------------

export default function TwoView() {
  const settings = useSettingsContext();
  const dispatch = useDispatch();

  const handleCreateNew = async () => {
    await dispatch(cleanProductData());
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Produtos"
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Lista', href: '/' },
          { name: 'Produtos' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.product.create}
            variant="contained"
            color="secondary"
            onClick={handleCreateNew}
          >
            Criar novo produto
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
          position: 'relative',
        }}
      />

      <CoverProducts />
    </Container>
  );
}
