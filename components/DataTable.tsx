import {useEffect, useState} from "react";

export const DataTable = (data: {data: object}) => {
  useEffect(() => {}, [data]);

  return (
    <>
      <h1>View Your Data Here</h1>
      <table className="block overflow-scroll h-96">
        {data &&
        data["data"] !== undefined &&
        data["data"] != null &&
        Object.keys(data["data"]).length > 0 ? (
          <>
            <thead>
              <tr>
                {Object.keys(Object.entries(data["data"])[0][1]).map(
                  (col_name: string) => (
                    <th className="p-2">{col_name}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Object.values(data["data"]).map((row: any) => (
                <tr>
                  {Object.values(row).map((col: any) => (
                    <td className="p-2">{col.toString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : null}
      </table>
    </>
  );
};
