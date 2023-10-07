import { useEffect, useState } from "react";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import * as chrono from "chrono-node";
import {
  TextInput,
  Button,
  Modal,
  DarkThemeToggle,
  Flowbite,
} from "flowbite-react";
import moment from "moment-timezone";

function App() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = moment(new Date()).tz(timezone).format("llll z");

  const [clipboardText, setClipboardText] = useState("");
  const [result, setResult] = useState(localTime);

  function convertDateToTimezone(input: string) {
    if (input === "") {
      setResult(localTime);
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
      if (text !== "" && text !== clipboardText) {
        convertDateToTimezone(text!);
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

  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };

  return (
    <Flowbite>
      <div className=" items-center mx-auto  p-4  bg-gradient-to-b from-sky-300 to-sky-100  space-y-8 min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-blue-700  ">
        <div className="flex justify-between items-center space-x-8 mx-auto">
          <div className="text-4xl font-semibold  text-white">timeo</div>
          <Button
            onClick={() => props.setOpenModal("dismissible")}
            className="bg-transparent dark:bg-transparent"
          >
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
            </svg>
          </Button>
          <Modal
            dismissible
            show={props.openModal === "dismissible"}
            onClose={() => props.setOpenModal(undefined)}
          >
            <Modal.Header>Settings</Modal.Header>
            <Modal.Body>
              <div className="text-sm text-gray-400 flex justify-between items-center">
                Toggle light/dark mode
                <DarkThemeToggle />
              </div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </div>
        <div className="flex justify-between items-center space-x-8 mx-auto">
          <div className="text-8xl text-center ">🌤️</div>

          <div className=" text-2xl font-medium dark:text-white  ">
            {result}
          </div>
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
    </Flowbite>
  );
}

export default App;
