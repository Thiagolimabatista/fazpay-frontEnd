import { Helmet } from 'react-helmet-async';

import TwoView from 'src/sections/two/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Produtos</title>
      </Helmet>

      <TwoView />
    </>
  );
}
