import { useEffect, useState } from "react";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import * as chrono from "chrono-node";
import { TextInput } from "flowbite-react";
import moment from "moment-timezone";
// get system local timezone

function App() {
  // get local time
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = moment(new Date()).tz(timezone).format("llll z");

  const [clipboardText, setClipboardText] = useState("");
  const [result, setResult] = useState(localTime);

  function convertDateToTimezone(input: string) {
    if (input === "") {
      setResult(localTime);

      return false;
    }

    const convertedDate = chrono.parseDate(input, timezone);
    if (convertedDate) {
      setResult(moment(convertedDate).tz(timezone).format("llll z"));
      setClipboardText(input);

      return true;
    }
  }

  async function convertClipboard() {
    await readText().then((text) => {
      if (text !== clipboardText) {
        if (convertDateToTimezone(text!)) {
          writeText(text!);
        }
      }
    });
  }

  useEffect(() => {
    convertClipboard();
    const interval = setInterval(() => {
      convertClipboard();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" items-center mx-auto  p-8  bg-gradient-to-b from-sky-300 to-sky-50  space-y-8 min-h-screen ">
      <div className="flex justify-between items-center space-x-8 mx-auto">
        <div className="text-4xl font-semibold  text-white">timeo</div>
        <svg
          className="w-6 h-6 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </div>
      <div className="flex justify-between items-center space-x-8 mx-auto">
        <div className="text-8xl text-center ">🌤️</div>

        <div className=" text-2xl font-medium  ">{result}</div>
      </div>

      <TextInput
        sizing="xl"
        width="w-full"
        onChange={(e) => {
          setClipboardText(e.target.value);
          convertDateToTimezone(e.target.value);
        }}
        value={clipboardText}
      />

      <div className="text-sm text-gray-400">
        Highlight a date and press Cmd/Ctrl + C or type in a date above
      </div>
    </div>
  );
}

export default App;
