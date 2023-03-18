import logo from "./logo.svg";
import "./App.css";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/checkbox/checkbox.js";

function App() {
  return (
    <div className="App">
      <label>
        Material 3<md-checkbox checked></md-checkbox>
      </label>
      <md-outlined-button label="Back"></md-outlined-button>
    </div>
  );
}

export default App;
