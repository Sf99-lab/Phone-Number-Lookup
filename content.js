const button = document.querySelector('.rounded-full');

if (button) {
  button.addEventListener('click', function () {
    let count = 0; // Counter to keep track of iterations
    const maxIterations = 15; // Set the maximum number of iterations

    function myFunction() {
      // Increment the counter
      count++;

      // Extract the name and phone number
      const nameElements = document.querySelectorAll('td.p-4.align-middle.font-medium');
      const phoneElements = document.querySelectorAll('td.p-4.align-middle:not(.font-medium)');

      // Check if elements were found
      if (nameElements.length > 0 && phoneElements.length > 0) {
        // Initialize arrays to store the extracted data
        const names = new Set();
        const phoneNumbers = new Set();

        // Loop through the name elements and phone elements to extract data
        for (let i = 0; i < nameElements.length; i++) {
          names.add(nameElements[i].textContent.trim());
          phoneNumbers.add(phoneElements[i].textContent.trim());
        }

        //remove country name('OM') from the set
        phoneNumbers.delete('OM');

        //concatinate the values in one Array
        const myData = [...names, ...phoneNumbers];
        //to make each array unique
        const phone = [];
        phone.push(myData);

        //stored values in local storage 
        chrome.storage.local.get(['storedData'], async (result) => {
          if (result.storedData !== undefined) {

            const previousValues = await result.storedData;
            //concatinate previousValues and current values
            const concat2 = [...previousValues, ...phone];
            //get a unique array
            const uniqueArrays = Array.from(
              new Set(concat2.map(JSON.stringify)),
              JSON.parse
            );

            //store in local storage
            await chrome.storage.local.set({ 'storedData': uniqueArrays });

          } else {
            await chrome.storage.local.set({ 'storedData': phone });
          }

        })
        //target acheived stop function execution
        clearInterval(intervalId);
      }
      // Check if the maximum number of iterations is reached
      if (count === maxIterations) {
        clearInterval(intervalId); // Stop the interval when the condition is met
      }
    }
    // Set the interval to run every 1000 milliseconds (1 second)
    const intervalId = setInterval(myFunction, 1000);
  });
}
