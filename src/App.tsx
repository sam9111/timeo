import { useEffect, useState } from "react";
import { readText } from "@tauri-apps/api/clipboard";
import * as chrono from "chrono-node";
import { TextInput, DarkThemeToggle, Flowbite } from "flowbite-react";
import moment from "moment-timezone";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = moment(new Date()).tz(timezone).format("llll z");

  const [clipboardText, setClipboardText] = useState("");
  const [result, setResult] = useState(localTime);

  let previous_input = "";

  function convertDateToTimezone(input: string) {
    if (input === previous_input) {
      return;
    }
    if (input === "") {
      setResult(localTime);
    }

    const convertedDate = chrono.parseDate(input, {
      timezone: timezone,
    });
    if (convertedDate) {
      setResult(moment(convertedDate).tz(timezone).format("llll z"));
      setClipboardText(input);
      previous_input = input;
      invoke("focus_window");
      return true;
    }
  }

  async function convertClipboard() {
    await readText().then((text) => {
      convertDateToTimezone(text!);
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
    <Flowbite>
      <div className=" items-center mx-auto  p-4  bg-gradient-to-b from-sky-300 to-sky-100  space-y-6 min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-blue-800 ">
        <div className="flex justify-between items-center  mx-auto">
          <div className="text-2xl font-extrabold  text-white  ">timeo</div>

          <DarkThemeToggle />
        </div>

        <TextInput
          sizing="md"
          width="w-full"
          onChange={(e) => {
            console.log(e.target.value);
            setClipboardText(e.target.value);
            convertDateToTimezone(e.target.value);
          }}
          value={clipboardText}
          autoFocus
        />

        <div className=" text-md font-medium dark:text-white  ">
          Your time is {result}
        </div>

        <div className="text-xs text-gray-400">
          Highlight a date and press Cmd/Ctrl + C or type in a date above
        </div>
      </div>
    </Flowbite>
  );
}

export default App;
