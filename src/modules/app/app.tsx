import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Container} from "@material-ui/core";
import {RootState} from "../../middleware/store/store";
import {ROOT_ID} from "../../middleware/nodes/constants/root-id.const";
import './app.css';
import {getBlock} from "../../thunks";
import { Block } from "../block-dnd/components/block";
import { initBlock } from "../../thunks";
import {IS_PARENT} from "../../middleware/relationships/constants/relationship.const";

function App() {
  const rootLookup = useSelector((state: RootState) => state.relationship.lookup[IS_PARENT]?.[ROOT_ID]) || {};
  const rootOrder = useSelector((state: RootState) => state.block.order || []);
  const rootIds = rootOrder.filter(id => rootLookup[id]);
  const dispatch = useDispatch();

  return (
    <Container>
      <Button onClick={() => {dispatch(initBlock())}}>initBlocks</Button>
      <Button onClick={() => {dispatch(getBlock())}}>getBlocks</Button>
      {rootIds.map(id => <Block key={id} id={id}/>)}
    </Container>
  );
}

export default App;