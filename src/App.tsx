import "./App.css";
import { useState, useEffect, useCallback, useRef } from "react";

function App() {
  const [length, setLength] = useState<number>(6);
  const [password, setPassword] = useState<string>("");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Copy");

  const ref = useRef<HTMLInputElement>(null);
  const buttonTextRef = useRef<string>(buttonText);

  const copyToClipboard = () => {
    ref.current?.select();
    navigator.clipboard.writeText(password);
    setButtonText("Copied");
  };

  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    includeNumbers && (str += "0123456789");
    includeSymbols && (str += "!@#$%^&*()_+");
    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, includeNumbers, includeSymbols, setPassword]);

  useEffect(() => {
    generatePassword();

    // Store the buttonText in a ref
    buttonTextRef.current = buttonText;

    const intervalId = setTimeout(() => {
      if (buttonTextRef.current === "Copied") {
        setButtonText("Copy");
      }
    }, 1000);
    return () => {
      clearTimeout(intervalId);
    };
  }, [generatePassword, buttonText]);

  return (
    <div className="md:max-w-lg max-w-sm bg-slate-700 px-4 my-7 py-8 shadow-md rounded-md mx-auto w-full text-orange-500">
      <h1 className="text-white font-bold text-2xl mb-4 text-center">
        Password Generator
      </h1>
      <div className="flex gap-2 items-center overflow-hidden mb-4">
        <input
          placeholder="password"
          value={
            password.length > 25 ? password.substring(0, 20) + "..." : password
          }
          // show all password on click
          onClick={(e) => {
            e.currentTarget.value = password;
          }}
          className="bg-slate-600 px-4 py-3 w-full text-white outline-none rounded-md"
          readOnly
          ref={ref}
        />
        <button
          onClick={copyToClipboard}
          className="px-3 py-3 rounded-md text-white bg-indigo-500"
        >
          {buttonText}
        </button>
      </div>
      <div className="flex gap-x-5 flex-col md:flex-row gap-y-5">
        <div className="flex gap-3 items-center">
          <input
            type="range"
            onChange={(e) => {
              setLength(+e.target.value);
            }}
            min={8}
            max={100}
            value={length}
          />
          <label>Length: {length}</label>
        </div>
        <div className="flex items-center gap-x-1 w-full">
          <input
            id="num"
            type="checkbox"
            defaultChecked={includeNumbers}
            onChange={() => {
              setIncludeNumbers((prev) => !prev);
            }}
          />
          <label htmlFor="num">Numbers</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={includeSymbols}
            onChange={() => {
              setIncludeSymbols((prev) => !prev);
            }}
          />
          <label>Characters</label>
        </div>
      </div>
    </div>
  );
}

export default App;
