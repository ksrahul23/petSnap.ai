import { useState } from "react";
import Button from "./Button.jsx";

const Facts = () => {
    const [fact, setFact] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);

    const catFacts = [
        "Cats sleep for around 70% of their lives.",
        "A cat can jump up to 6 times its height.",
        "Cats have over 20 muscles controlling their ears.",
        "Every cat's nose print is unique.",
        "Cats can make more than 100 vocal sounds.",
        "Cats use their whiskers to judge whether they can fit through a space.",
        "A group of cats is called a clowder.",
        "Cats have five toes on their front paws but usually only four on the back.",
        "The oldest known pet cat existed over 9,000 years ago.",
        "Cats can rotate their ears 180 degrees.",
        "A cat’s purr can vibrate at frequencies linked to healing.",
        "Cats can run at speeds of up to 30 mph.",
        "Most cats dislike water, but some breeds like the Turkish Van enjoy it.",
        "Cats spend a lot of time grooming to regulate body temperature.",
        "Kittens are born blind and deaf.",
        "Cats can see well in very low light.",
        "A cat’s brain is more similar to a human brain than a dog’s in some ways.",
        "House cats share about 95% of their DNA with tigers.",
        "Cats can’t taste sweetness.",
        "A cat’s tail helps with balance and communication.",
        "Cats sweat mostly through their paw pads.",
        "Ancient Egyptians worshipped cats and considered them sacred.",
        "Some cats are polydactyl, meaning they have extra toes.",
        "Cats dream while they sleep, just like humans.",
        "Cats often rub against people to mark them with their scent."
    ];

    const dogFacts = [
        "Dogs can learn over 100 words and gestures.",
        "A dog's nose print is unique like fingerprints.",
        "Dogs can smell 40 times better than humans.",
        "The Basenji is known as the barkless dog.",
        "Dogs dream while sleeping.",
        "Dogs have three eyelids, including one to keep their eyes moist.",
        "A Greyhound can run up to 45 mph.",
        "Puppies are born deaf, blind, and toothless.",
        "Dogs use body language more than barking to communicate.",
        "A dog’s sense of smell is their strongest sense.",
        "The Labrador Retriever has been one of the most popular dog breeds for years.",
        "Dogs can hear sounds at frequencies much higher than humans can.",
        "The Saluki is one of the oldest known dog breeds.",
        "Dogs sweat mainly through their paw pads.",
        "Some dogs can detect diseases like cancer and diabetes.",
        "Dogs have been human companions for at least 14,000 years.",
        "A dog’s whiskers help them sense nearby objects.",
        "The world’s tallest dog was over 3 feet tall.",
        "Dogs can get jealous when their owners pay attention to other pets.",
        "Newfoundland dogs are excellent swimmers because of their webbed feet.",
        "A dog’s wet nose helps it absorb scent chemicals better.",
        "Dalmatian puppies are born completely white and develop spots later.",
        "Dogs can understand human pointing better than many other animals.",
        "Dogs can sense changes in weather and air pressure."
    ];

    function showFact(id) {
        setSelectedTeam(id);
        const facts = {
            cat: catFacts,
            dog: dogFacts
        };

        const randomIndex = Math.floor(Math.random() * facts[id].length);
        setFact(facts[id][randomIndex]);
    }

    return (
        <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 my-10">
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-6 sm:p-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-6">
                    <span className="bg-amber-200 border-2 border-black rounded-full px-4 py-1 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] inline-block mb-3">
                        ⚡ Community Showdown
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-black">
                        Team Dog vs Team Cat
                    </h2>
                    <p className="text-zinc-600 font-bold text-sm sm:text-base mt-2">
                        Pick your loyalty and unlock fascinating trivia about your favorite companion!
                    </p>
                </div>

                {/* Team Buttons */}
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 my-4">
                    <button
                        onClick={() => showFact("dog")}
                        className={`flex items-center gap-3 px-6 py-3.5 border-4 border-black rounded-2xl font-black text-base sm:text-lg uppercase tracking-wide transition cursor-pointer ${
                            selectedTeam === "dog"
                                ? "bg-blue-300 shadow-[2px_2px_0px_#000] translate-x-[2px] translate-y-[2px]"
                                : "bg-blue-100 hover:bg-blue-200 shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000]"
                        }`}
                    >
                        <span className="text-2xl">🐶</span>
                        <span>Team Dog</span>
                    </button>

                    <button
                        onClick={() => showFact("cat")}
                        className={`flex items-center gap-3 px-6 py-3.5 border-4 border-black rounded-2xl font-black text-base sm:text-lg uppercase tracking-wide transition cursor-pointer ${
                            selectedTeam === "cat"
                                ? "bg-amber-300 shadow-[2px_2px_0px_#000] translate-x-[2px] translate-y-[2px]"
                                : "bg-amber-100 hover:bg-amber-200 shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000]"
                        }`}
                    >
                        <span className="text-2xl">🐱</span>
                        <span>Team Cat</span>
                    </button>
                </div>

                {/* Fact Result Card */}
                {fact && (
                    <div className="mt-6 max-w-2xl mx-auto bg-yellow-100 border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] p-5 sm:p-6 transition-all">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">
                                    {selectedTeam === "dog" ? "🐶" : "🐱"}
                                </span>
                                <h3 className="text-lg sm:text-xl font-black">
                                    {selectedTeam === "dog" ? "Team Dog Fact" : "Team Cat Fact"}
                                </h3>
                            </div>

                            <button
                                onClick={() => {
                                    setFact("");
                                    setSelectedTeam(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition font-black text-xs cursor-pointer"
                                aria-label="Close fact"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-base sm:text-lg font-bold leading-relaxed text-zinc-900">
                            &ldquo;{fact}&rdquo;
                        </p>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => showFact(selectedTeam)}
                                className="text-xs font-black uppercase tracking-wider bg-white border-2 border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition cursor-pointer"
                            >
                                🎲 Another Fact
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Facts;