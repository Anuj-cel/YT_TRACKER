import React, { useState, useEffect } from 'react';
import { PieGraph } from "../Charts/PieGraph";
import socket from '../socket';
import formatTime from '../utils/formatTime';
import PageWrapper from "../utils/PageWrapper";

function Home() {
    const [watchTime, setWatchTime] = useState({
        totalWatchTime: 0,
        totalShorts: 0,
        records: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://yt-tracker.onrender.com/watchtime");
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message);
                }
                const data = await res.json();
                console.log("This is OldData ",data)
                setWatchTime(data);
               
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socket.on("watchTimeDataUpdated", (newData) => {
            setWatchTime(newData);
            console.log("This is NewData ",newData)
        });

        return () => {
            socket.off("watchTimeDataUpdated");
        };
    }, []);

    const todayRecords = watchTime.records.filter(r => r.date === today);

    const mergedCategories = {};
    todayRecords.forEach(record => {
        record.categories.forEach(cat => {
            const key = cat.category; // Changed key to just category
            if (!mergedCategories[key]) {
                mergedCategories[key] = {
                    category: cat.category,
                    watchTime: 0,
                };
            }
            mergedCategories[key].watchTime += cat.watchTime;
        });
    });

    const todayCategoryData = Object.values(mergedCategories);

    if (loading) return <p className="text-white text-center py-10 text-lg">Loading...</p>;
    if (error) return <p className="text-red-400 text-center py-10">{error}</p>;

    return (
        <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 sm:px-6 lg:px-8 py-10">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-cyan-400 drop-shadow-md">
        📊 YouTube Watch Time Dashboard
    </h1>

    {watchTime.totalWatchTime > 0 ? (
        <>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
                <div className="bg-gray-800 border border-gray-700 text-gray-100 rounded-2xl shadow-xl p-6 w-full sm:w-1/2 max-w-xs text-center transition-transform hover:scale-105 duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-cyan-300">Total Video Time</h3>
                    <p className="text-2xl font-bold">{formatTime(Math.max(watchTime.totalWatchTime - watchTime.totalShorts))}</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 text-gray-100 rounded-2xl shadow-xl p-6 w-full sm:w-1/2 max-w-xs text-center transition-transform hover:scale-105 duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-pink-300">Total Shorts Time</h3>
                    <p className="text-2xl font-bold">{formatTime(watchTime.totalShorts)}</p>
                </div>
            </div>

            {todayCategoryData.length > 0 ? (
                <div className="max-w-3xl mx-auto bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 style=height: 434px;overflow:hidden;">
                    {console.log("This is home not pie Data ",todayCategoryData)}
                    <PieGraph categories={todayCategoryData} />
                </div>
            ) : (
                <p className="text-center text-gray-400">No category data available for today.</p>
            )}
        </>
    ) : (
        <p className="text-center text-gray-400">No Watch Time Data Available for Today.</p>
    )}
</div>
</PageWrapper>
    );
}

export default Home;