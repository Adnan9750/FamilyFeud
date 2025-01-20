useEffect(() => {
    // Initialize the socket connection
    const socket = io('https://family-feud-backend.onrender.com/'); // Replace with your backend URL
    // const socket = io('http://localhost:5000/'); // Replace with your backend URL

    // Listen for revealed answers
    socket.on('revealAnswer', (data) => {
        console.log('Revealed Answer:', data);
        // Update the UI based on the received data
    });

    // Listen for strikes
    socket.on('strike', (data) => {
        console.log('Strike Count:', data.countStrike);
        // Update the UI to show strikes
    });
    
    socket.on('startGame', (data) => {
        console.log('startGame:', data);
        // Update the UI to show strikes
    });

    socket.on('newQuestion', (data) => {
        console.log('newQuestion:', data);
        // Update the UI to show strikes
    });

    socket.on('endGame', (data) => {
        console.log('endGame:', data);
        // Update the UI to show strikes
    });

    // Cleanup the socket connection on component unmount
    return () => {
        socket.disconnect();
    };
}, []); 