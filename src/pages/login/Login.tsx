import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Stack, Link, Container, Typography } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';
import Page from '../../components/Page';
import LoginForm from './components/LoginForm';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Page title="Login">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Acesso ao Chat
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Coloque seus dados de acesso.</Typography>
              </Box>
            </Stack>

            <LoginForm />
            
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Não possui uma conta?{' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Registre-se
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
