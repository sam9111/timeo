import pyperclip
import arrow
import dateparser
import PySimpleGUI as sg


def main():
    sg.theme('Default 1')

    layout = [[sg.Text('Highlight Converter', font=('Helvetica', 18))],
              [sg.Text('Converted time: ', font=('Helvetica', 14)), sg.Text('', size=(40, 1), key='-TIME-')],
              [sg.Button('Exit')]]

    window = sg.Window('Highlight Converter', layout, icon='icon.ico')

    while True:
        event, values = window.read(timeout=1000)

        # Check the clipboard for new text
        new_text = pyperclip.paste()

        # If the text is different from the last time we checked, process it
        if new_text != values['-LAST-']:
            window['-LAST-'].update(new_text)
            convert_text(new_text, window)

        if event in (sg.WIN_CLOSED, 'Exit'):
            break

    window.close()


def convert_text(highlighted_text, window):
    # Use dateparser to extract the date and time from the text
    date = dateparser.parse(highlighted_text)

    # If dateparser found a valid date, convert it to the user's local timezone
    if date:
        local_timezone = arrow.now().tzinfo
        if date.tzname() is None:
            date = date.replace(tzinfo=local_timezone)

        local_time = arrow.get(date).to(local_timezone)
        formatted_time = local_time.format('YYYY-MM-DD HH:mm:ss ZZ')

        window['-TIME-'].update(formatted_time)

    else:
        window['-TIME-'].update('No time found in highlighted text')


if __name__ == '__main__':
    main()
