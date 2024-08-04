import "./index.css";
import CsvReader from "./components/csvReader";
import GraphVisualizer from "./components/maps";

function App() {
  const data = CsvReader();

  console.log('Data in App:', data); 

  return (
    <>
      <GraphVisualizer data={data} />
    </>
  );
}

export default App
