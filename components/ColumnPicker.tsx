import {useEffect, useState} from "react";

export const ColumnPicker = ({
  title,
  columns,
  selected,
  setSelected,
  only_one_allowed,
}: {
  title: string;
  columns: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  only_one_allowed: boolean;
}) => {
  useEffect(() => {}, [selected]);

  return (
    <>
      <h1>{title}</h1>
      <div className="flex justify-left border-4 border-indigo-600 rounded-lg p-4 my-4 flex-wrap">
        {columns.map((column: string) => (
          <div
            key={column}
            className={`hover:bg-indigo-700 text-white py-2 px-4 rounded m-1 ${
              selected.includes(column) ? "bg-indigo-700" : "bg-indigo-500"
            }`}
            onClick={() => {
              if (only_one_allowed) {
                setSelected([column]);
              } else {
                selected.includes(column)
                  ? setSelected(selected.filter((c) => c != column))
                  : setSelected([...selected, column]);
              }
            }}
          >
            {column}
          </div>
        ))}
      </div>
    </>
  );
};
