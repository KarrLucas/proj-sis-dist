import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import { getAllUserCoversations, getAllUsers, resetAllUserConversations } from "src/redux/slices/chat";
import { useDispatch } from "src/redux/store"

const useMessages = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    
    useEffect(() =>{
        dispatch(resetAllUserConversations())
        getAllConversations();
        getUsers();
    },[])
  
    const getAllConversations = () =>{
        dispatch(getAllUserCoversations(user?.uid));
    }
    
    const getUsers = () =>{
        dispatch(getAllUsers(user?.uid));
    }

    const messagesHook: any = {
        getAllConversations,
        getUsers
    }

    return {
        messagesHook,
    }
}

export default useMessages