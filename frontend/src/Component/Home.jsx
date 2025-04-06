import React from 'react'
import { PieGraph } from "../Charts/PieGraph";
import { useState, useEffect } from 'react';
function Home() {
    const [watchTime, setWatchTime] = useState({
        totalWatchTime: 0,
        totalShorts: 0,
        record: { categories: [] }
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/watchtime");
                console.log("This is response ", res);
                if (!res.ok) {
                    throw new Error("No Data Found");
                }
                const data = await res.json();
                setWatchTime(data);
                console.log("This is from dashboard ", data);
            } catch (error) {
                setError(error);
                console.error("Error fetching watch time:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatTime = (seconds) => {
        if (seconds >= 3600) return `${(seconds / 3600).toFixed(2)} hours`;
        if (seconds >= 60) return `${(seconds / 60).toFixed(2)} minutes`;
        return `${seconds.toFixed(2)} seconds`;
    };
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
                            <p>{formatTime(watchTime.totalWatchTime-watchTime.totalShorts)}</p>
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