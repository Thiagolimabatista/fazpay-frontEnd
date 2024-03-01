import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 0 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack flexGrow={1} spacing={10} alignItems="center" justifyContent="center">
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center', padding: 4 }}>
        FazPay
        <Typography style={{ color: '#546e7a' }}>
          Neste teste, foram empregados Redux, Typescript, Firebase, PostgreSQL, Node.js, Nest.js e
          Google Cloud. Além disso, foi estabelecida uma eficiente pipeline de CI/CD diretamente no
          repositório.
        </Typography>
      </Typography>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
