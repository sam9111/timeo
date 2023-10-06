import { useEffect, useState } from "react";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import * as chrono from "chrono-node";
import { TextInput } from "flowbite-react";
import moment from "moment-timezone";
// get system local timezone

function App() {
  // get local time
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const abbrTimezone = moment().tz(timezone).zoneAbbr();

  const localTime = new Date().toLocaleString() + " " + abbrTimezone;

  const [clipboardText, setClipboardText] = useState("");
  const [result, setResult] = useState(localTime);

  const [error, setError] = useState("");

  function convertDateToTimezone(input: string) {
    if (input === "") {
      setResult(localTime);
      return;
    }

    const convertedDate = chrono.parseDate(input, timezone);
    if (convertedDate) {
      setResult(convertedDate.toLocaleString() + " " + abbrTimezone);
      setClipboardText(input);
      setError("");
      return true;
    } else {
      setError("Invalid date");
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
    <div className="h-screen mx-auto p-8 flex flex-col bg-gradient-to-b from-sky-300 to-sky-100 ">
      <div className="text-4xl font-semibold text-center text-white">timeo</div>
      <div className="space-y-8  flex flex-col my-auto bg-white rounded-xl shadow-xl p-8">
        <div className="text-9xl  justify-between items-center mx-auto">🌤️</div>

        <div className=" text-2xl  text-center">{result}</div>
        <TextInput
          sizing="xl"
          onChange={(e) => {
            setError("");
            setClipboardText(e.target.value);
            convertDateToTimezone(e.target.value);
          }}
          value={clipboardText}
        />
        {error != "" ? (
          <div className="text-red-500 text-center text-sm">{error}</div>
        ) : (
          <span className="text-sm text-gray-400">
            Highlight a date and press Ctrl + C or type a date above
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
