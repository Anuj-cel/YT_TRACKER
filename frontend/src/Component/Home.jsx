import React from 'react'
import { PieGraph } from "../Charts/PieGraph";
import { useState, useEffect } from 'react';
import "../App.css";
import socket from '../socket';
import formatTime from '../utils/formatTime';

function Home() {
    const [watchTime, setWatchTime] = useState({
        totalWatchTime: 0,
        totalShorts: 0,
        record: { categories: [] }
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch("http://localhost:3000/watchtime");
    //             console.log("API response:", res);
    //             console.log("This is response ", res);
    //             if (!res.ok) {
    //                 throw new Error("No Data Found");
    //             }
    //             const data = await res.json();
    //             setWatchTime(data);
    //             console.log("This is from dashboard ", data);
    //         } catch (error) {
    //             setError(error);
    //             console.error("Error fetching watch time:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    //     // ✅ Listen to socket updates
    //     socket.on("watchTimeDataUpdated", (newData) => {
    //         console.log("Socket update received", newData);
    //         setWatchTime(newData);
    //     });

    //     // ✅ Clean up listener when component unmounts
    //     return () => {
    //         console.log("Umounted");
    //         socket.off("watchTimeDataUpdated");
    //     };
    // }, []);
    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const res = await fetch("http://localhost:3000/watchtime");
        //         if (!res.ok) throw new Error("No Data Found");
        //         const data = await res.json();
        //         setWatchTime(data);
        //         console.log("Fetched from API", data);
        //     } catch (error) {
        //         setError(error.message);
        //         console.error("Error fetching watch time:", error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        const fetchData = async () => {
            try {
              const res = await fetch("http://localhost:3000/watchtime");
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message);
              }
              const data = await res.json();
              setWatchTime(data);
              console.log("Fetched from API", data);
            } catch (error) {
              setError(error.message);
              console.error("Error fetching watch time:", error);
            } finally {
              setLoading(false);
            }
          };
        fetchData();
    
        // ✅ Add listener after fetch
        socket.on("watchTimeDataUpdated", (newData) => {
            console.log("Socket update received", newData);
            setWatchTime(newData);
        });
    
        // ✅ Clean up on unmount
        return () => {
            socket.off("watchTimeDataUpdated");
            console.log("Unmounted and listener removed");
        };
    }, []);
    


    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-message">{error}</p>;
    return (
        <>
            <h1 className="dashboard-title">📊 YouTube Watch Time Dashboard</h1>

            {watchTime.totalWatchTime > 0 ? (
                <>
                    <div className="watch-summary">
                        <div className="watch-card">
                            <h3>Total Video Time</h3>
                            <p>{formatTime(watchTime.totalWatchTime - watchTime.totalShorts)}</p>
                        </div>
                        <div className="watch-card">
                            <h3>Total Shorts Time</h3>
                            <p>{formatTime(watchTime.totalShorts)}</p>
                        </div>
                    </div>

                    {watchTime.record.categories.length > 0 ? (
                        <PieGraph categories={watchTime.record.categories} />
                    ) : (
                        <p className="no-data">No category data available.</p>
                    )}
                </>
            ) : (
                <>
                    <p>No Watch Time Data Available for Today.</p>
                </>
            )}
        </>
    )
}

export default Home