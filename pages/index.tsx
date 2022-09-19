import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {useState} from "react";
import {ColumnPicker} from "../components/ColumnPicker";
import {DataTable} from "../components/DataTable";

const Home: NextPage = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState<object | null>(null);
  const [columns, setColumns] = useState<object | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [inputs, setInputs] = useState<string[] | null>(null);
  const [predictionValues, setPredictionValues] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [prediction, setPrediction] = useState<string | null>(null);

  var BASE_URL = "https://actively-take-home.uc.r.appspot.com/";

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    BASE_URL = "http://localhost:8080/";
  }

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);

    let formData = new FormData();
    formData.append("data", e.target.files[0]);
    fetch(BASE_URL + "data/upload", {
      method: "POST",
      mode: "cors",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        setData(JSON.parse(res.data));
        setColumns(res.types);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center flex-col w-8/12 mx-auto">
        <div className="flex justify-center mb-3">
          <div className="mb-3">
            <label
              htmlFor="formFile"
              className="form-label inline-block mb-2 mt-5 text-gray-700"
            >
              1) Upload a data file
            </label>
            <input
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="file"
              id="formFile"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <h1>2) Customize your Model</h1>

        <ColumnPicker
          title="Input Columns (Choose 1 or more)"
          columns={
            columns
              ? (Object.entries(columns)
                  .map((column) => (column[1] == "int" ? column[0] : null))
                  .filter((column) => column != null) as string[])
              : []
          }
          selected={inputs ? inputs : []}
          setSelected={setInputs}
          only_one_allowed={false}
        />
        <ColumnPicker
          title="Output Column (Choose 1)"
          columns={
            columns
              ? (Object.entries(columns)
                  .map((column) => (column[1] == "bool" ? column[0] : null))
                  .filter((column) => column != null) as string[])
              : []
          }
          selected={output ? [output] : []}
          setSelected={(selected) => setOutput(selected[0])}
          only_one_allowed={true}
        />

        <DataTable data={data ? data : {}} />
        <br />
        <br />

        <h1>
          Enter values for which you want to predict the output (choose inputs
          above first)
        </h1>
        <br />
        {inputs &&
          inputs.map((input) => (
            <div key={input} className="flex justify-center">
              <div className="mb-3 xl:w-96">
                <label
                  htmlFor={`${input}Input`}
                  className="form-label inline-block mb-2 text-gray-700"
                >
                  {input}
                </label>
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id={`${input}Input`}
                  placeholder="Enter a value"
                  onChange={(e) => {
                    setPredictionValues(
                      predictionValues.set(input, e.target.value)
                    );
                  }}
                />
              </div>
            </div>
          ))}

        <h1>3) Train your model and use it to predict</h1>
        <br />
        <button
          type="button"
          disabled={output == null || inputs == null || inputs.length < 1}
          className="mb-8 inline-flex w-32 disabled:bg-slate-400 font-bold justify-center items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            let formData = new FormData();
            formData.append("dataset", file);
            formData.append("output", output as string); // button is disabled if output is null
            formData.append("inputs", JSON.stringify(inputs)); // button is disabled if inputs is null
            let temp: {[x: string]: string}[] = [];
            predictionValues.forEach((value, key) => {
              temp.push({[key]: value});
            });
            formData.append(
              "hypothetical_input",
              JSON.stringify(Object.assign({}, ...temp))
            );
            fetch(BASE_URL + "data/predict", {
              method: "POST",
              mode: "cors",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => setPrediction(data.prediction));
          }}
        >
          Train
        </button>
        <h1>4) View the Results</h1>
        <div className="flex justify-left border-2 border-indigo-600 rounded-lg p-4 my-4 flex-wrap">
          <h2>Prediction: {`${prediction ? prediction : undefined}`}</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
