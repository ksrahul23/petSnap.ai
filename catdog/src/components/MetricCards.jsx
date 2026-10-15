const MetricCards = ({ metrics }) => {
    if (!metrics) return null;

    const cards = [
        {
            title: "Accuracy",
            value: metrics.accuracy,
            bg: "bg-yellow-100",
            emoji: "🎯",
        },
        {
            title: "Precision",
            value: metrics.precision,
            bg: "bg-blue-100",
            emoji: "📌",
        },
        {
            title: "Recall",
            value: metrics.recall,
            bg: "bg-pink-100",
            emoji: "🔍",
        },
        {
            title: "F1 Score",
            value: metrics.f1_score,
            bg: "bg-green-100",
            emoji: "⚡",
        },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 mt-8 mb-14">
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl font-black text-center mb-6">
                    Model Performance
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            className={`${card.bg} border-4 border-black rounded-3xl shadow-[4px_4px_0px_#000] md:shadow-[6px_6px_0px_#000] p-4 sm:p-5 text-center`}
                        >
                            <p className="text-sm sm:text-lg font-bold mb-2">
                                {card.emoji} {card.title}
                            </p>

                            <p className="text-2xl sm:text-3xl font-black text-black break-words">
                                {(card.value * 100).toFixed(2)}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MetricCards;