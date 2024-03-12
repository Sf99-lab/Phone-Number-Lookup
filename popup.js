function download1() {

  chrome.storage.local.get(['storedData']).then((result) => {
    // Loop through the data and extract values using regular expressions
    try {
      // array of arrays
      const arrayOfArrays = result.storedData;

      // Function to convert an array to CSV format with UTF-32 encoding
      function arrayToCSV(dataArray) {
        const csvRows = [];

        // Header row with 'phone', 'name1', 'name2', ..., 'name20'
        const headerRow = ['phone'];
        for (let i = 1; i <= 20; i++) {
          headerRow.push(`name${i}`);
        }
        csvRows.push(headerRow.join('\t'));

        // Loop through the data array and format it for CSV
        for (const arr of dataArray) {
          const phone = arr[arr.length - 1]; // Last index value
          const names = arr.slice(0, 20); // First 20 values, if available

          // Create a CSV row for each set of values
          const csvRow = [phone, ...names].map(value => `"${value}"`).join('\t');
          csvRows.push(csvRow);
        }

        return csvRows.join('\n');
      }

      // Convert the array of arrays to CSV format
      const csvData = arrayToCSV(arrayOfArrays);

      // Function to convert text to UTF-32 bytes (little-endian)
      function textToUTF32LE(text) {
        const buffer = new ArrayBuffer(text.length * 4); // Each character is 4 bytes
        const view = new DataView(buffer);

        for (let i = 0; i < text.length; i++) {
          view.setUint32(i * 4, text.charCodeAt(i), true); // Set little-endian byte order
        }

        return buffer;
      }

      // Convert the CSV text to UTF-32 encoded bytes
      const utf32Bytes = textToUTF32LE("\ufeff" + csvData);

      // Create a Blob with UTF-32 encoded data
      const blob = new Blob([utf32Bytes], { type: 'text/csv;charset=utf-32;' });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'myData.csv';

      // Simulate a click to trigger the download
      link.click();

      // Clean up by revoking the Blob URL
      URL.revokeObjectURL(url);

    } catch (error) {
      window.confirm("Search a Phone Number First.");
    }
  });
}
document.querySelector('.download-button').addEventListener('click', () => {
  download1();
})


////////////////////////////////// Clear previous Data //////////////////////////////////////
const showDialogButton = document.getElementById('showDialog');
const customConfirm = document.getElementById('customConfirm');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

showDialogButton.addEventListener('click', () => {
  const downloadButton = document.getElementsByClassName("download-button");
  // hide download button
  if (downloadButton) {
    downloadButton[0].classList.add("hidden");
  }
  customConfirm.classList.remove('hidden');
});

confirmYes.addEventListener('click', () => {
  chrome.storage.local.remove('storedData', function () {
  });
  const downloadButton = document.getElementsByClassName("download-button");
  // un hide download button
  if (downloadButton) {
    downloadButton[0].classList.remove("hidden");
  }
  customConfirm.classList.add('hidden');
});

confirmNo.addEventListener('click', () => {
  const downloadButton = document.getElementsByClassName("download-button");
  // un hide download button
  if (downloadButton) {
    downloadButton[0].classList.remove("hidden");
  }
  customConfirm.classList.add('hidden');
});
