import React, { useState, useEffect } from 'react';
import { PieGraph } from "../Charts/PieGraph";
import "../App.css";
import socket from '../socket';
import formatTime from '../utils/formatTime';

function Home() {
    const [watchTime, setWatchTime] = useState({
        totalWatchTime: 0,
        totalShorts: 0,
        records: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
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

        socket.on("watchTimeDataUpdated", (newData) => {
            console.log("Socket update received", newData);
            setWatchTime(newData);
        });

        return () => {
            socket.off("watchTimeDataUpdated");
            console.log("Unmounted and listener removed");
        };
    }, []);

    // Filter all today's records
    const todayRecords = watchTime.records.filter(r => r.date === today); 

    // Merge all categories from today's records
    const mergedCategories = {};
    todayRecords.forEach(record => {
        record.categories.forEach(cat => {
            const key = `${cat.category}-${cat.isShorts}`; // Differentiate shorts and regular
            if (!mergedCategories[key]) {
                mergedCategories[key] = {
                    category: cat.category,
                    watchTime: 0,
                    isShorts: cat.isShorts
                };
            }
            mergedCategories[key].watchTime += cat.watchTime;
        });
    });

    // Convert to array
    const todayCategoryData = Object.values(mergedCategories);
    console.log("Today's merged categories:", todayCategoryData);

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

                    {todayCategoryData.length > 0 ? (
                        <PieGraph categories={todayCategoryData} />
                    ) : (
                        <p className="no-data">No category data available for today.</p>
                    )}
                </>
            ) : (
                <p>No Watch Time Data Available for Today.</p>
            )}
        </>
    );
}

export default Home;


//errors which i was doing 
/**
 * i was having a array of records of same date and i was using .find which was only giving the first element that met the today===record.date so i changed that to .fillter to get an array of objects then during sending to pie we should be sending a record with categories so we merged to have the all same categories to one either shorts or not and of all of same date
 */