import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import {
  addInstrument,
  removeInstrument,
} from "../../reducers/instruments.reducer.ts";
import { useState } from "react";

export function InstrumentList() {
  const instruments = useAppSelector(({ instruments }) => instruments);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");

  function handleClick() {
    if (inputValue) {
      dispatch(addInstrument({ name: inputValue }));
      setInputValue("");
    }
  }

  function handleRemove(id: string) {
    return () => {
      dispatch(removeInstrument({ id }));
    };
  }

  return (
    <>
      <div>
        {instruments.map(({ id, name }) => (
          <div key={id} onClick={handleRemove(id)}>
            {name}
          </div>
        ))}
      </div>
      <input
        value={inputValue}
        onChange={({ target: { value } }) => setInputValue(value)}
      />
      <button onClick={handleClick}>Make Thing</button>
    </>
  );
}
