import { createSlice } from '@reduxjs/toolkit';
// @types
import { ChatState } from '../../@types/chat';
//
import { dispatch } from '../store';
import { getFirestore, collection, addDoc, onSnapshot, doc, getDoc, updateDoc, setDoc, getDocs, arrayUnion } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_API } from '../../config';

// ----------------------------------------------------------------------

const initialState: ChatState = {
  isLoading: false,
  error: null,
  allUserConversations: [],
  allUsers: [],
  currentConversationUid: null,
};

const firebaseApp = initializeApp(FIREBASE_API);

const DB = getFirestore(firebaseApp);

const conversationsRef = collection(DB, 'conversations');
const usersRef = collection(DB, 'users');

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getAllUserCoversationsSuccess(state, action){
      action.payload.sort((a: any,b: any) =>{
        if ((a.lastMessageTime ? a.lastMessageTime : a.createdAt) > (b.lastMessageTime ?  b.lastMessageTime : b.createdAt)) {
          return -1;
        }
        if ((a.lastMessageTime ? a.lastMessageTime : a.createdAt) < (b.lastMessageTime ?  b.lastMessageTime : b.createdAt)) {
          return 1;
        }
        return 0;
    })
      state.allUserConversations = action.payload;
    },

    resetAllUserConversations(state){
      state.allUserConversations = [];
    },

    getAllUsersSuccess(state, action){
      state.allUsers = action.payload;
    },

    setCurrentConversationUid(state, action){
      state.currentConversationUid = action.payload;
    }
  },
});

// Reducer
export default slice.reducer;

export const { setCurrentConversationUid, resetAllUserConversations } = slice.actions;

export function getAllUserCoversations(userUid: any) {
  return async () => {
    try {
      const data = onSnapshot(conversationsRef, async (querySnapshot) =>{
        const conversations: any = [];
        querySnapshot.forEach(async (_doc) => {
          if(_doc.data().uids.includes(userUid)){
            var convTemp = _doc.data();
            conversations.push(convTemp);
            convTemp.messages.sort((a: any,b: any) =>{
                if (a.date < b.date) {
                  return -1;
                }
                if (a.date > b.date) {
                  return 1;
                }
                return 0;
            })
          }
        });
        dispatch(slice.actions.getAllUserCoversationsSuccess(conversations));
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAllUsers(userUid: any) {
  return async () => {
    try {
        const data = await getDocs(usersRef);
        var users: any = [];
        data.forEach((_doc) =>{
          if(_doc.data().uid !== userUid){
            users.push(_doc.data());
          }
        })
        dispatch(slice.actions.getAllUsersSuccess(users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createConversation(currentUserUid: any, userUid: any, conversations: any){
  return async () => {
    try {
        const convAux = conversations.filter((conv: any) => conv.type === 'privada' && conv.uids.includes(currentUserUid) && conv.uids.includes(userUid))[0];
        if(convAux){
          dispatch(slice.actions.setCurrentConversationUid(convAux.uid));
        }else{
          const docRef = await addDoc(conversationsRef, {
            type: "privada",
            uids: [currentUserUid, userUid],
            messages: [],
            createdAt: Date.now()
          });

          await updateDoc(doc(DB, 'conversations', docRef.id), {
            uid: docRef.id
          });
          dispatch(slice.actions.setCurrentConversationUid(docRef.id));
        }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createGroup(currentUserUid: any, usersUid: any, groupName: any){
  return async () => {
    try {
        const docRef = await addDoc(conversationsRef, {
          name: groupName,
          type: "grupo",
          uids: [currentUserUid, ...usersUid],
          messages: [],
          createdAt: Date.now()
        });

        await updateDoc(doc(DB, 'conversations', docRef.id), {
          uid: docRef.id
        });
        dispatch(slice.actions.setCurrentConversationUid(docRef.id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function sendMessage(conversationUid: any, userUid: any, message: any){
  return async () => {
    try {
      const conversationRef = doc(DB, "conversations", conversationUid);
      await updateDoc(conversationRef, {
        messages: arrayUnion({
          text: message,
          time: Date.now(),
          userUid,
        }),
        lastMessageTime: Date.now()
    });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
