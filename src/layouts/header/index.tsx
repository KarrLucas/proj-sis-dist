// @mui
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Button } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
import AccountPopover from './AccountPopover';
import NewConversation from './NewConversation';
import Newgroup from './NewGroup';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse?: boolean;
  verticalLayout?: boolean;
};

export default function Header({

  isCollapse = false,
  verticalLayout = false,
}: Props) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;
  const [openConversation, setOpenConversation] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<boolean>(false);

  const handleCloseConversation = () =>{
    setOpenConversation(false);
  }

  const handleCloseGroup = () =>{
    setOpenGroup(false);
  }

  return (
    <>
      <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
        <Toolbar
          sx={{
            minHeight: '100% !important',
            width: '100%',
            px: { lg: 5 },
            boxShadow: (theme) => theme.shadows[5]
          }}
        >
          <Stack direction='row' alignItems='center' spacing={2}>
            <Button startIcon={<Iconify icon='ic:baseline-plus'/>} variant='text' onClick={() => setOpenConversation(true)}>
              Nova Conversa
            </Button>

            <Button startIcon={<Iconify icon='ic:baseline-plus'/>} variant='text' onClick={() => setOpenGroup(true)}>
              Novo Grupo
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <AccountPopover />
          </Stack>
        </Toolbar>
        
      </RootStyle>
      <Box
        component="main"
        sx={{
          height: '100%',
          justifyContent: 'center',
          display: 'flex',
          px: { lg: 2 },
          pt: {
            xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
          },
          pb: {
            xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
          },
        }}
      >
        <Outlet />
      </Box>
      <NewConversation open={openConversation} onClose={handleCloseConversation}/>
      <Newgroup open={openGroup} onClose={handleCloseGroup}/>
    </>
  );
}
