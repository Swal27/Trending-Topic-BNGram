import { createSlice } from '@reduxjs/toolkit';

const getProcessLocalStorage = () => {
    const getLocalStorage = localStorage.getItem("processing")
    if (getLocalStorage === null) {
        return {
            isProccessed: false
        }
    } else {
        const { isProccessed } = JSON.parse(getLocalStorage)
        return {
            isProccessed
        }
    }
}

const saveProcessLocalStorage = (isProccessed) => {
    const processing = { isProccessed }
    localStorage.setItem("processing", JSON.stringify(processing));
}

const removeProcessLocalStorage = () => {
    localStorage.removeItem("processing");
}


const initialState = getProcessLocalStorage();

const processSlice = createSlice({
    name: 'process',
    initialState: initialState,
    reducers: {
        yProcessed(state) {
            state.isProccessed = true;
            saveProcessLocalStorage(true);
        },
        nProcessed(state) {
            state.isProccessed = false;
            removeProcessLocalStorage();
        },
    },
});

export const processAction = processSlice.actions;
export default processSlice.reducer;
