import { Card, Grid } from '@mui/material'
import List from './components/List'
import Chat from './components/Chat'
import useMessages from './hooks/Messages.hook'

export default function Messages(){
    const { messagesHook } = useMessages();

    return(
        <Card sx={{ width: '100%',height: '100%', display: 'flex', maxWidth: '1500px' }}>
            <Grid container>
                <Grid item sm={4} xs={12}>
                    <List/>
                </Grid>
                <Grid item sm={8} xs={0}>
                    <Chat/>
                </Grid>
            </Grid>
        </Card>
    )
}