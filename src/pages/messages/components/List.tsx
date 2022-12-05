import { Box, Stack, Typography } from "@mui/material";
import { setCurrentConversationUid } from "src/redux/slices/chat";
import { useDispatch, useSelector } from "src/redux/store";
import moment from 'moment';
import useAuth from "src/hooks/useAuth";


export default function List(){
    const { allUserConversations, currentConversationUid } = useSelector((state) => state.chat)
    const dispatch = useDispatch();
    const { user } = useAuth();

    return(
        <Box sx={{ width: '100%',height: '100%'}}>
            {allUserConversations.length === 0 ?
                <Typography>
                    Você não possui conversas no momento
                </Typography>
                :
                allUserConversations.map((conv: any) =>
                    <Box 
                        key={conv.uid}
                        sx={{
                            padding: 2.5,
                            '&:hover':{
                                cursor: 'pointer',
                                backgroundColor: (theme) => theme.palette.grey[200]
                            },
                            backgroundColor: currentConversationUid === conv.uid ? (theme) => theme.palette.grey[300] : 'transparent',
                        }} 
                        onClick={() => dispatch(setCurrentConversationUid(conv.uid))}
                    >
                        <Stack spacing={1}>
                            <Typography variant="subtitle1">
                                {conv.type === 'privada' ? conv.users[0].name : conv.name}
                            </Typography>
                            {conv.messages.length > 0 &&
                                <Typography variant="body2">
                                    {   conv.messages[conv.messages.length - 1]?.userUid === user?.uid ?
                                        `Você: ${conv.messages[conv.messages.length - 1]?.text}`
                                        :
                                        conv.users.filter((u: any) => u.uid == conv.messages[conv.messages.length - 1]?.userUid)[0]?.name + `: ${conv.messages[conv.messages.length - 1]?.text}`
                                    }
                                </Typography>
                            }
                        </Stack>
                    </Box>
                )
            }
        </Box>
    );
}