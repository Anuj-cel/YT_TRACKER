function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = Math.round(seconds % 60);

    let timeString = "";
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || timeString !== "") timeString += `${minutes}m `;
    if (secondsRemaining > 0 || timeString === "") timeString += `${secondsRemaining}s`;
    return timeString.trim() === "" ? "0.00" : timeString.trim();
}


 export  default formatTime;