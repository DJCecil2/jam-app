import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks";
import { resetJamSessions } from "../reducers/jamSession.reducer";
import { resetInstruments } from "../reducers/instruments.reducer";
import { populateMockMusicians } from "../reducers/musicians.reducer";

export const usePopulateMockData = () => {
  const dispatch = useAppDispatch();
  const instruments = useAppSelector((state) => state.instruments);

  return () => {
    dispatch(resetJamSessions());
    dispatch(resetInstruments());

    const firstNames = [
      "James",
      "Mary",
      "Robert",
      "Patricia",
      "John",
      "Jennifer",
      "Michael",
      "Linda",
      "David",
      "Elizabeth",
      "William",
      "Barbara",
      "Richard",
      "Susan",
      "Joseph",
      "Jessica",
      "Thomas",
      "Sarah",
      "Christopher",
      "Karen",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzales",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
    ];

    const mockMusicians = Array.from({ length: 20 }).map(() => {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const numInstruments = Math.floor(Math.random() * 2) + 1; // 1 or 2 instruments
      const shuffledInstruments = [...instruments].sort(
        () => 0.5 - Math.random(),
      );
      const selectedInstruments = shuffledInstruments
        .slice(0, numInstruments)
        .map((i) => i.id);

      return {
        id: nanoid(),
        name: `${firstName} ${lastName}`,
        instrumentIds: selectedInstruments,
      };
    });

    dispatch(populateMockMusicians(mockMusicians));
  };
};
