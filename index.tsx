import { useState, useEffect } from 'react';

// Quiz questions database
const quizData = [
  {
    id: 1,
    question: "What percentage of the world's energy currently comes from renewable sources?",
    options: ["Around 10%", "Around 25%", "Around 50%", "Around 75%"],
    correctAnswer: "Around 25%",
    explanation: "As of 2023, approximately 25% of global electricity comes from renewable sources, with solar and wind being the fastest-growing segments."
  },
  {
    id: 2,
    question: "Which of the following has the largest carbon footprint?",
    options: ["Taking a 4-hour flight", "Eating beef for a year", "Driving a car for a year", "Using plastic bags for a year"],
    correctAnswer: "Driving a car for a year",
    explanation: "The average car produces about 4.6 metric tons of carbon dioxide per year, which is significantly more than the other options listed."
  },
  {
    id: 3,
    question: "What is the most recycled material in the world?",
    options: ["Plastic", "Paper", "Aluminum", "Steel"],
    correctAnswer: "Steel",
    explanation: "Steel is the most recycled material globally, with over 650 million tons recycled annually. It can be recycled repeatedly without degrading its quality."
  },
  {
    id: 4,
    question: "Which of these actions saves the most water?",
    options: ["Taking shorter showers", "Fixing a leaky faucet", "Using a dishwasher instead of washing by hand", "Installing a low-flow toilet"],
    correctAnswer: "Installing a low-flow toilet",
    explanation: "Low-flow toilets can save up to 60% of water compared to traditional models, which can mean savings of thousands of gallons per year."
  },
  {
    id: 5,
    question: "Which of the following is NOT a renewable energy source?",
    options: ["Solar power", "Wind power", "Natural gas", "Hydroelectric power"],
    correctAnswer: "Natural gas",
    explanation: "Natural gas is a fossil fuel that takes millions of years to form and is not renewable on a human timescale, unlike solar, wind, and hydroelectric power."
  },
  {
    id: 6,
    question: "What is the main cause of ocean acidification?",
    options: ["Agricultural runoff", "Plastic pollution", "Oil spills", "Carbon dioxide absorption"],
    correctAnswer: "Carbon dioxide absorption",
    explanation: "The ocean absorbs about 30% of atmospheric CO2, which reacts with seawater to form carbonic acid, leading to increased acidity that threatens marine ecosystems."
  },
  {
    id: 7,
    question: "Which approach to agriculture is most sustainable?",
    options: ["Conventional farming", "Organic farming", "Regenerative agriculture", "Urban farming"],
    correctAnswer: "Regenerative agriculture",
    explanation: "Regenerative agriculture focuses on soil health, biodiversity, and ecosystem restoration while producing food, making it more sustainable long-term than other approaches."
  },
  {
    id: 8,
    question: "What percentage of plastic ever produced has been recycled?",
    options: ["About 9%", "About 25%", "About 50%", "About 75%"],
    correctAnswer: "About 9%",
    explanation: "Of all plastic produced since the 1950s, only about 9% has been recycled. The majority ends up in landfills or the natural environment."
  },
  {
    id: 9,
    question: "Which sustainable practice has the greatest impact on reducing carbon footprint?",
    options: ["Eating a plant-based diet", "Using public transportation", "Reducing air travel", "Installing solar panels"],
    correctAnswer: "Reducing air travel",
    explanation: "A single long-haul flight can generate more carbon emissions than many people produce in an entire year through other activities."
  },
  {
    id: 10,
    question: "What is the concept of 'circular economy' focused on?",
    options: ["Using only renewable energy", "Creating closed-loop systems to eliminate waste", "Focusing on local production", "Reducing water usage"],
    correctAnswer: "Creating closed-loop systems to eliminate waste",
    explanation: "A circular economy aims to redesign how we make and use things to minimize waste and pollution by keeping products and materials in use and regenerating natural systems."
  }
];

// API key from the prompt
const GEMINI_API_KEY = "AIzaSyBvBvUOHYYJDrFRm2xJc_cJkcpeih_bO3c";

export default function SustainabilityQuizBot() {
  const [activeScreen, setActiveScreen] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [customFact, setCustomFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("");

  // Function to fetch sustainability fact from Gemini API
  const fetchSustainabilityFact = async (topic) => {
    setIsLoading(true);
    setError("");
    
    try {
      const prompt = `Generate a brief, interesting fact about ${topic || 'sustainability'} that would help educate people. Keep it to 1-2 sentences and make it engaging.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sustainability fact');
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setCustomFact(data.candidates[0].content.parts[0].text);
      } else {
        setCustomFact("Did you know that small everyday choices, like using reusable water bottles and shopping bags, can significantly reduce your environmental footprint?");
      }
    } catch (err) {
      console.error('Error fetching from Gemini API:', err);
      setError("Unable to fetch a custom fact right now. Try the quiz anyway!");
      setCustomFact("Did you know that small everyday choices, like using reusable water bottles and shopping bags, can significantly reduce your environmental footprint?");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with a sustainability fact
  useEffect(() => {
    fetchSustainabilityFact();
  }, []);

  const startQuiz = () => {
    setActiveScreen('quiz');
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setAnswerSubmitted(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setActiveScreen('results');
    }
  };

  const restartQuiz = () => {
    setActiveScreen('welcome');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    // Fetch a new fact for the next attempt
    fetchSustainabilityFact(topic);
  };

  const handleTopicSubmit = () => {
    fetchSustainabilityFact(topic);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {/* Welcome Screen */}
        {activeScreen === 'welcome' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Sustainability Quiz Bot</h1>
            <div className="mb-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800">
                {isLoading ? "Loading a sustainability fact..." : customFact}
              </p>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name (optional)
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Sustainability Topic Interest
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                  placeholder="e.g., renewable energy, recycling"
                />
                <button 
                  onClick={handleTopicSubmit}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r hover:bg-blue-600"
                  disabled={isLoading}
                >
                  Get Fact
                </button>
              </div>
            </div>
            
            <button
              onClick={startQuiz}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {activeScreen === 'quiz' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Question {currentQuestion + 1}/{quizData.length}
              </span>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Score: {score}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">{quizData[currentQuestion].question}</h2>
            
            <div className="space-y-3 mb-6">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-3 text-left rounded-lg border-2 ${
                    selectedAnswer === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    answerSubmitted && option === quizData[currentQuestion].correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : answerSubmitted && selectedAnswer === option && selectedAnswer !== quizData[currentQuestion].correctAnswer
                      ? 'bg-red-100 border-red-500'
                      : ''
                  }`}
                  disabled={answerSubmitted}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {answerSubmitted ? (
              <div className="mb-6">
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === quizData[currentQuestion].correctAnswer
                    ? 'bg-green-100'
                    : 'bg-red-100'
                }`}>
                  <p className="font-medium mb-2">
                    {selectedAnswer === quizData[currentQuestion].correctAnswer
                      ? '✓ Correct!'
                      : `✗ Incorrect. The correct answer is: ${quizData[currentQuestion].correctAnswer}`
                    }
                  </p>
                  <p>{quizData[currentQuestion].explanation}</p>
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {currentQuestion < quizData.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            ) : (
              <button
                onClick={submitAnswer}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            )}
          </div>
        )}

        {/* Results Screen */}
        {activeScreen === 'results' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Quiz Results</h1>
            
            <div className="mb-6 p-6 bg-green-100 rounded-lg">
              <p className="text-3xl font-bold text-green-800 mb-2">
                {username ? `${username}, you scored:` : 'Your score:'}
              </p>
              <p className="text-4xl font-bold text-green-700 mb-4">
                {score}/{quizData.length}
              </p>
              <p className="text-green-800">
                {score === quizData.length
                  ? "Perfect score! You're a sustainability expert! 🌟"
                  : score >= quizData.length * 0.7
                  ? "Great job! You know a lot about sustainability! 🌱"
                  : score >= quizData.length * 0.5
                  ? "Good effort! You're on the right track to understanding sustainability better. 🌿"
                  : "There's still more to learn about sustainability. Keep exploring! 🌎"}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-3">Want to learn more?</h2>
              <p className="mb-4">Explore these sustainability topics:</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => fetchSustainabilityFact("renewable energy")}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Renewable Energy
                </button>
                <button 
                  onClick={() => fetchSustainabilityFact("circular economy")}
                  className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  Circular Economy
                </button>
                <button 
                  onClick={() => fetchSustainabilityFact("plastic pollution")}
                  className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                >
                  Plastic Pollution
                </button>
                <button 
                  onClick={() => fetchSustainabilityFact("sustainable food")}
                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  Sustainable Food
                </button>
              </div>
              
              {isLoading ? (
                <p className="italic text-gray-600">Loading fact...</p>
              ) : customFact ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left mb-6">
                  <p className="text-gray-800">{customFact}</p>
                </div>
              ) : null}
            </div>
            
            <button
              onClick={restartQuiz}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}