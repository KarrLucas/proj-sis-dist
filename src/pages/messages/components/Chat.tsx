import { Box, Divider, IconButton, Input, Stack, styled, Typography } from "@mui/material";
import { formatDistanceToNowStrict  } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import useAuth from "src/hooks/useAuth";
import { sendMessage } from "src/redux/slices/chat";
import { dispatch, useSelector } from "src/redux/store";


const InputStyle = styled('div')(({ theme }) => ({
    minHeight: 56,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
}));

const MessageStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(3),
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(0.75),
    color: theme.palette.text.secondary,
}));

const ContentStyle = styled('div')(({ theme }) => ({
    display: 'inline-block',
    maxWidth: 320,
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral,
}));


export default function Chat(){
    const { user } = useAuth();
    const { allUserConversations, currentConversationUid } = useSelector((state) => state.chat)
    var conversation = allUserConversations.filter((conv: any) => conv.uid === currentConversationUid)[0];
    const [ message, setMessage ] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollMessagesToBottom = () => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        };
        scrollMessagesToBottom();
      }, [conversation?.messages]);

    const handleSend = () =>{
        dispatch(sendMessage(currentConversationUid, user?.uid, message));
        setMessage('');
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleSend();
        }
    };

    return(
            <Box 
                sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    overflow: 'hidden',
                    borderLeft: (theme) => `1px solid ${theme.palette.grey[300]}` 
                }}
            >
            {currentConversationUid ?
                <Stack sx={{ flexGrow: 1 }}>
                    <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
                        {conversation?.messages.map((message: any) =>
                            <MessageStyle key={message.time}>
                                <Box 
                                    sx={{
                                        display: 'flex',
                                        ...((message.userUid === user?.uid) && {
                                          ml: 'auto',
                                        }),
                                      }}
                                > 
                                    <div>
                                        <InfoStyle variant="caption">
                                            {!(message.userUid === user?.uid) && `${conversation.users.filter((u: any) => u.uid === message.userUid)[0]?.name},`}&nbsp;
                                                {formatDistanceToNowStrict(new Date(message.time), {
                                                addSuffix: true,
                                                locale: ptBR
                                            })}
                                        </InfoStyle>
                                        <ContentStyle
                                            sx={{
                                                ...((message.userUid === user?.uid) && {
                                                    color: 'grey.800',
                                                    bgcolor: 'primary.lighter',
                                                }),
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {message.text}
                                            </Typography>
                                        </ContentStyle>
                                    </div>
                                </Box>
                            </MessageStyle>
                        )}
                    </Scrollbar>

                    <Divider/>
                    <InputStyle>
                        <Input
                            sx={{
                                ml: 2,
                                pr: 5
                            }}
                            fullWidth
                            onKeyUp={handleKeyUp}
                            value={message}
                            disableUnderline
                            onChange={(e) => setMessage(e.target.value)} 
                            placeholder="Digite uma mensagem..."
                            endAdornment={
                                <IconButton color="primary" disabled={!message} onClick={handleSend} sx={{ mx: 1 }}>
                                    <Iconify icon="ic:round-send" width={22} height={22} />
                                </IconButton>
                            }
                        />
                    </InputStyle>
                </Stack>
                :
                <Box sx={{ height: '100%', width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h4">
                        Selecione uma Conversa
                    </Typography>
                </Box>
            }
            </Box>
            
    );
}