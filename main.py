import sys
import arrow
import pyperclip
import dateparser
import pytz
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel
from PyQt5.QtCore import QTimer


class HighlightConverter(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle('Highlight Converter')

        self.label = QLabel(self)
        self.label.setGeometry(50, 50, 300, 50)
        self.label.setStyleSheet('font-size: 18px;')

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.check_clipboard)
        self.timer.start(1000)

        self.last_text = None

    def check_clipboard(self):
        # Check the clipboard for new text
        new_text = pyperclip.paste()

        # If the text is different from the last time we checked, process it
        if new_text != self.last_text:
            self.last_text = new_text
            self.convert_text()

    def convert_text(self):
        # Get the highlighted text from the clipboard
        highlighted_text = pyperclip.paste()

        # Use dateparser to extract the date and time from the text
        date = dateparser.parse(highlighted_text)


        # If dateparser found a valid date, convert it to the user's local timezone
        if date:
            print(date.tzname())
            local_timezone = arrow.now().tzinfo
            local_time = arrow.get(date).to(local_timezone)
            formatted_time = local_time.strftime('%Y-%m-%d %H:%M:%S %Z')

            self.label.setText(f'Converted time: {formatted_time}')

        else:
            self.label.setText('No time found in highlighted text')


if __name__ == '__main__':
    app = QApplication(sys.argv)
    converter = HighlightConverter()
    converter.show()
    sys.exit(app.exec_())
