import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import PageProduct from './createProduct';

// ----------------------------------------------------------------------

export default function ProductEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Produto Edit</title>
      </Helmet>

      <PageProduct id={`${id}`} />
    </>
  );
}
