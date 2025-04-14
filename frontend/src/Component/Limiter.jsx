import { useEffect, useState } from "react";
import formatTime from "../utils/formatTime";
import socket from "../socket";
import "../App.css";

export default function App() {
    const initialCategoryLimits = {
        "Entertainment & Media": null,
        "Sports & Gaming": null,
        "News & Education": null,
        "Tech & How-To": null,
        "Music": null
    };
    const [categoryLimits, setCategoryLimits] = useState(initialCategoryLimits);
    const [touchedCategories, setTouchedCategories] = useState({});
    const [totalLimit, setTotalLimit] = useState(null);
    const [touchedTotal, setTouchedTotal] = useState(false);

    const [popup, setPopup] = useState("");
    const [blockedCategories, setBlockedCategories] = useState([]);

    useEffect(() => {
        socket.on("categoryLimitReached", (data) => {
            setPopup(`🚫 You've reached the limit for: ${data.category}`);
            setBlockedCategories((prev) => [...new Set([...prev, data.category])]);
        });

        socket.on("totalLimitReached", () => {
            setPopup("🚫 You've reached your total YouTube usage limit!");
        });

        return () => {
            socket.off("categoryLimitReached");
            socket.off("totalLimitReached");
        };
    }, []);



    const handleLimitChange = (cat, value) => {
        setCategoryLimits({ ...categoryLimits, [cat]: Number(value) });
        setTouchedCategories({ ...touchedCategories, [cat]: true });
    };

    const handleTotalLimitChange = (value) => {
        setTotalLimit(Number(value));
        setTouchedTotal(true);
    };

    const handleSubmit = () => {
        const activeCategoryLimits = {};
        for (const category in categoryLimits) {
          if (touchedCategories[category]) {
            activeCategoryLimits[category] = categoryLimits[category];
          }
        }
      
        const payload = {
            totalLimiter: touchedTotal ? totalLimit : null,
            categoryLimits: activeCategoryLimits,
          };
          
      
        socket.emit("updateLimits", payload); // emit to backend
      
        setPopup("✅ Limits updated successfully!");
        setTimeout(() => setPopup(""), 3000);
      };
      

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl space-y-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-center text-gray-800">🎯 YouTube Watch Limiter</h1>

                {/* Total Limit */}
                {/* <div>
          <label className="block font-semibold text-gray-700 mb-1">Total Limit (in seconds)</label>
          <input
            type="range"
            min="0"
            max="36000"
            step="600"
            value={totalLimit}
            onChange={(e) => setTotalLimit(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="text-sm text-gray-600 mt-1">{formatTime(totalLimit)}</div>
        </div> */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-1">Total Limit</label>
                    {totalLimit === null ? (
                        <div
                            className="w-full bg-gray-200 h-2 rounded cursor-pointer"
                            onClick={() => setTotalLimit(3600)} // default activate on click
                        >
                            <div className="text-gray-400 text-sm mt-2">Not Applied - Click to set</div>
                        </div>
                    ) : (
                        <>
                            <input
                                type="range"
                                min="0"
                                max="14400"
                                step="120"
                                value={totalLimit ?? 0}
                                onChange={(e) => handleTotalLimitChange(e.target.value)}
                                className="w-full accent-red-500"
                            />
                            <div className="text-sm text-gray-600 mt-1">
                                {touchedTotal ? formatTime(totalLimit) : "Not Active"}
                            </div>

                        </>
                    )}
                </div>



                {/* Category Limits */}
                <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">Category-wise Limits</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* {Object.entries(categoryLimits).map(([category, limit]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800">{category}</span>
                  {blockedCategories.includes(category) && (
                    <span className="text-xs text-red-600 font-semibold">❌ Blocked</span>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="14400"
                  step="600"
                  value={limit}
                  onChange={(e) => handleLimitChange(category, e.target.value)}
                  className="w-full accent-blue-500"
                />
                <div className="text-xs text-gray-600 mt-1">{formatTime(limit)}</div>
              </div>
            ))} */}
                        {Object.entries(categoryLimits).map(([category, limit]) => (
                            <div key={category} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">{category}</span>
                                    {blockedCategories.includes(category) && (
                                        <span className="text-sm text-red-600 font-semibold">❌ Blocked</span>
                                    )}
                                </div>

                                {limit === null ? (
                                    <div
                                        className="w-full bg-gray-200 h-2 rounded cursor-pointer"
                                        onClick={() => {
                                            setCategoryLimits({ ...categoryLimits, [category]: 900 });
                                            setTouchedCategories({ ...touchedCategories, [category]: true });
                                          }}
                                          
                                    >
                                        <div className="text-gray-400 text-xs mt-1">Not Applied - Click to activate</div>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="range"
                                            min="0"
                                            max="7200"
                                            step="120"
                                            value={categoryLimits[category] ?? 0}
                                            onChange={(e) => handleLimitChange(category, e.target.value)}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="text-xs text-gray-600">
                                            {touchedCategories[category] ? formatTime(categoryLimits[category]) : "Not Active"}
                                        </div>

                                        {/* <div className="text-xs text-gray-600">{formatTime(limit)}</div> */}
                                    </>
                                )}
                            </div>
                        ))}


                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
                    >
                        Save Limits
                    </button>
                </div>

                {/* Popup */}
                {popup && (
                    <div className="animate-fade-in bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-center font-medium mt-2">
                        {popup}
                    </div>
                )}
            </div>
        </div>
    );
}
