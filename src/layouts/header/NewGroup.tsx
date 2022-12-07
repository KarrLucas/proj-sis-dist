import { Dialog, DialogContent, DialogTitle, Box, Typography, Stack, Checkbox, TextField, Button, IconButton } from '@mui/material'
import { useEffect, useState } from 'react';
import Iconify from 'src/components/Iconify';
import useAuth from 'src/hooks/useAuth';
import { createGroup } from 'src/redux/slices/chat';
import { useDispatch, useSelector } from 'src/redux/store';

type Props = {
    open: boolean;
    onClose: () => void;
}

export default function Newgroup({
    open,
    onClose
}: Props){
    const { user } = useAuth();
    const [ selecteds, setSelecteds ] = useState<any>([]);
    const [ groupName, setGroupName ] = useState<any>('');
    const { allUsers } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    useEffect(()=>{
        setSelecteds([]);
        setGroupName('');
    },[open])

    const newGroup = () =>{
        dispatch(createGroup(user?.uid, selecteds, groupName));
        onClose();
    }

    const changeChecks = (value: any, uid: any) => {
        if(value){
            var aux = [...selecteds, uid];
            setSelecteds(aux);
        }else{
            var filtered = selecteds.filter((id: any) => id !== uid);
            setSelecteds(filtered);
        }
    }

    return(
        <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction='row' alignItems='center'>
                    Novo Grupo:  
                    <Box flexGrow={1}/>
                    <IconButton onClick={() => onClose()}>
                        <Iconify icon='ph:x-bold'/>
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Nome do Grupo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    fullWidth
                    sx={{ 
                        mt: 2
                    }}
                />
                {allUsers.map((user: any) =>
                    <Box 
                        key={user.uid} 
                        sx={{ 
                                my: 1.5, 
                                px: 2.5, 
                                py: 1.5, 
                                borderRadius: 2, 
                            }}
                    >
                        <Stack alignItems='center' direction='row' spacing={1}>
                            <Checkbox
                                checked={selecteds.includes(user?.uid)}
                                onChange={(e) => changeChecks(e.target.checked, user.uid)}
                            />
                            <Stack>
                                <Typography variant="subtitle2" noWrap>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                    {user.email}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                )}
                <Stack direction='row'>
                    <Box flexGrow={1}/>
                    <Button
                        variant='contained' 
                        disabled={selecteds.length === 0 || !groupName || groupName === ''}
                        onClick={() => newGroup()}
                    >
                        Criar Grupo
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}