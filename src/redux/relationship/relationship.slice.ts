import {createSlice} from "@reduxjs/toolkit";
import {initialRelationshipState} from "./initial-state.const";
import {removeRelationshipAction} from "./actions";
import {logger} from "../../logger";

const relationshipSlice = createSlice({
    name: 'relationship',
    initialState: initialRelationshipState,
    reducers: {
        registerRelationship: (state, action) => {
            const {relationship, type} = action.payload;
            state.type[relationship] = type;
            state.lookup[relationship] = {};
            state.reverseLookup[relationship] = {};
            state.order[relationship] = {};
        },
        // Does not check relationship type. Do it in thunk
        addRelationship: (state, action) => {
            const {from, to, relationship} = action.payload;
            if (!state.lookup[relationship] || !state.reverseLookup[relationship]){
                logger.warn('Unregistered relationship');
                return;
            }

            // Forward Lookup
            if (!state.lookup[relationship][from]) {
                state.lookup[relationship][from] = {};
            }
            state.lookup[relationship][from][to] = true;

            // Reverse Lookup
            if (!state.reverseLookup[relationship][to]) {
                state.reverseLookup[relationship][to] = {};
            }
            state.reverseLookup[relationship][to][from] = true;
        },
        removeRelationship: (state, action) => {
            const {from, to, relationship} = action.payload;
            if (!relationship) return;
            if (!from && !to) return;

            let froms = from ? [from] : Object.keys(state.reverseLookup[relationship]?.[to] || {});
            let tos = to ? [to] : Object.keys(state.lookup[relationship]?.[from] || {});
            froms.forEach(from => {
                tos.forEach(to =>{
                    removeRelationshipAction({from, to, relationship}, state);
                })
            });
        },
    }
});

export default relationshipSlice.reducer;
export const {addRelationship, removeRelationship, registerRelationship} = relationshipSlice.actions;