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
      var index = state.allUserConversations.findIndex((conv: any) => conv.uid === action.payload.uid);
      if(index !== -1){
        state.allUserConversations[index] = action.payload;
      }else{
        state.allUserConversations.push(action.payload);
      }
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
        querySnapshot.forEach(async (_doc) => {
          if(_doc.data().uids.includes(userUid)){
            var convTemp = _doc.data();
            convTemp.users = [];
            const map = convTemp.uids.map(async (uid: any) =>{
              if(uid !== userUid){
                var user = await getDoc(doc(DB, 'users', uid));
                convTemp.users.push(user.data());
              }
            })
            await Promise.all(map);
            convTemp.messages.sort((a: any,b: any) =>{
                if (a.date < b.date) {
                  return -1;
                }
                if (a > b.date) {
                  return 1;
                }
                return 0;
            })
            dispatch(slice.actions.getAllUserCoversationsSuccess(convTemp));
          }
        });
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

export function sendMessage(conversationUid: any, userUid: any, message: any){
  return async () => {
    try {
      const conversationRef = doc(DB, "conversations", conversationUid);
      await updateDoc(conversationRef, {
        messages: arrayUnion({
          text: message,
          time: Date.now(),
          userUid,
        })
    });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
