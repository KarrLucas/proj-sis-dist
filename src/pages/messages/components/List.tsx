import { Box, Typography } from "@mui/material";
import { useSelector } from "src/redux/store";


export default function List(){
    const { allUserConversations } = useSelector((state) => state.chat)

    return(
        <Box sx={{ width: '100%',height: '100%'}}>
            {allUserConversations.length === 0 ?
                <Typography>
                    Você não possui conversas no momento
                </Typography>
                :
                <p>conversa hehe</p>
            }
        </Box>
    );
}