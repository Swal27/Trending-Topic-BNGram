import { createSlice } from '@reduxjs/toolkit';

const getdataLocalStorage = () => {
    const getLocalStorage = localStorage.getItem("Perform")
    if (getLocalStorage === null) {
        return {
            isProcessed: false,
            isPulled: false,
            isPreProcessed: false,
            isVisual:false
        }
    } else {
        const { isProcessed, isPreProcessed, isPulled, isVisual } = JSON.parse(getLocalStorage)
        return {
            isProcessed, isPreProcessed, isPulled, isVisual
        }
    }
}

const saveDataLocalStorage = (isData) => {
    localStorage.setItem("Perform", JSON.stringify(isData));
}


const initialState = getdataLocalStorage();

const PerformSlice = createSlice({
    name: 'perform',
    initialState: initialState,
    reducers: {
        yProcessed(state) {
            state.isProcessed = true;
            saveDataLocalStorage({
                isProcessed: true,
                isPulled: true,
                isPreProcessed: true,
                isVisual:false
            });
        },
        nProcessed(state) {
            state.isProcessed = false;
            state.isVisual = false;
            saveDataLocalStorage({
                isProcessed: false,
                isPulled: true,
                isPreProcessed: true,
                isVisual:false
            });
        },
        yPulled(state) {
            state.isPulled = true;
            saveDataLocalStorage({
                isProcessed: false,
                isPulled: true,
                isPreProcessed: false,
                isVisual:false
            });
        },
        nPulled(state) {
            state.isProcessed = false;
            state.isPulled = false;
            state.isPreProcessed = false;
            state.isVisual = false;
            saveDataLocalStorage({
                isProcessed: false,
                isPulled: false,
                isPreProcessed: false,
                isVisual:false
            });
        },
        yPreProcessed(state) {
            state.isPreProcessed = true;
            saveDataLocalStorage({
                isProcessed: false,
                isPulled: true,
                isPreProcessed: true,
                isVisual:false
            });
        },
        nPreProcessed(state) {
            state.isProcessed = false;
            state.isPreProcessed = false;
            state.isVisual = false;
            saveDataLocalStorage({
                isProcessed: false,
                isPulled: true,
                isPreProcessed: false,
                isVisual:false
            });
        },
        yVisual(state) {
            state.isVisual = true;
            saveDataLocalStorage({
                isProcessed: true,
                isPulled: true,
                isPreProcessed: true,
                isVisual:true
            });
        },
        nVisual(state) {
            state.isVisual = false;
            saveDataLocalStorage({
                isProcessed: true,
                isPulled: true,
                isPreProcessed: true,
                isVisual:false
            });
        },
    },
});

export const DataAction = PerformSlice.actions;
export default PerformSlice.reducer;
