import { Dialog, DialogContent, DialogTitle, Box, Typography } from '@mui/material'
import useAuth from 'src/hooks/useAuth';
import { createConversation } from 'src/redux/slices/chat';
import { useDispatch, useSelector } from 'src/redux/store';

type Props = {
    open: boolean;
    onClose: () => void;
}

export default function NewConversation({
    open,
    onClose
}: Props){
    const { user } = useAuth();
    const { allUsers, allUserConversations } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const newConversation = (uid: any) =>{
        dispatch(createConversation(user?.uid, uid, allUserConversations));
        onClose();
    }

    return(
        <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
            <DialogTitle>
                Escolha um usuário:
            </DialogTitle>
            <DialogContent>
                {allUsers.map((user: any) =>
                    <Box 
                        key={user.uid} 
                        sx={{ 
                                my: 1.5, 
                                px: 2.5, 
                                py: 1.5, 
                                borderRadius: 2, 
                                '&:hover':{ backgroundColor: (theme) => theme.palette.grey[200], cursor: 'pointer' } 
                            }}
                        onClick={() => newConversation(user.uid)}
                    >
                        <Typography variant="subtitle2" noWrap>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {user.email}
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}