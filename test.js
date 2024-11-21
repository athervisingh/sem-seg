 var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://4181-103-172-221-178.ngrok-free.app/stream_images', true);
      xhr.timeout = 10000; // Timeout after 10 seconds

      // Initialize previous length for slicing the response in chunks
      xhr.prevLen = 0;

      // Handle timeout
      xhr.ontimeout = function () {
        console.error('Request timed out!');
      };

      // Handle progress as the response is being received
      xhr.onprogress = function () {
        // Get the full response text up to this point
        var responseText = xhr.responseText;

        // Get the new chunk of data since the last progress update
        var chunk = responseText.slice(xhr.prevLen);
        xhr.prevLen = responseText.length; // Update previous length

        // Process the chunk (you can parse JSON if needed, depending on your backend response)
        try {
          // var data = JSON.parse(chunk);
          console.log(chunk);

          // Handle the data (like images or messages) here
        //   if (data.status && data.status === 'done') {
        //     console.log('Processing complete.');
        //     xhr.abort(); // Close the connection when processing is complete
        //   }

        } catch (e) {
          console.error('Error processing chunk:', e);
        }
      };

      // Handle the complete load of the request
      xhr.onload = function () {
        console.log('Request completed!');
        // You can handle final steps when the entire request is loaded
      };

      // Handle any errors during the request
      xhr.onerror = function () {
        console.error('Request failed.');
      };

      // Send the request
      xhr.send();