import React, { useState, useEffect } from "react";

function App() {
  const [gold, setGold] = useState(
    () => parseInt(localStorage.getItem("gold")) || 0
  );
  const [clickPower, setClickPower] = useState(
    () => parseInt(localStorage.getItem("clickPower")) || 1
  );
  const [prestige, setPrestige] = useState(
    () => parseInt(localStorage.getItem("prestige")) || 0
  );
  const [autoMiners, setAutoMiners] = useState(
    () => parseInt(localStorage.getItem("autoMiners")) || 0
  );
  const [upgradeCostMultiplier, setUpgradeCostMultiplier] = useState(
    () => parseFloat(localStorage.getItem("upgradeCostMultiplier")) || 1
  );
  const [clickPowerMultiplier, setClickPowerMultiplier] = useState(
    () => parseFloat(localStorage.getItem("clickPowerMultiplier")) || 1
  );
  const [showEndGameMessage, setShowEndGameMessage] = useState(false);

  const prestigeGoal = 1000000000;
  const endGameGoal = 1000000000000;
  const baseUpgradeCosts = {
    1: 50,
    5: 250,
    10: 500,
    50: 2500,
    100: 5000,
    500: 25000,
    1000: 50000,
    5000: 250000,
    10000: 1000000,
  };
  const autoMinerCost = 1000;

  useEffect(() => {
    const autoClickInterval = setInterval(() => {
      setGold((prevGold) => {
        const newGold =
          prevGold + autoMiners * clickPower * clickPowerMultiplier;
        if (newGold >= endGameGoal && !showEndGameMessage) {
          setShowEndGameMessage(true);
        }
        return newGold;
      });
      saveGameState();
    }, 1000);
    return () => clearInterval(autoClickInterval);
  }, [autoMiners, clickPower, clickPowerMultiplier, endGameGoal, showEndGameMessage]);

  const saveGameState = () => {
    localStorage.setItem("gold", gold.toString());
    localStorage.setItem("clickPower", clickPower.toString());
    localStorage.setItem("prestige", prestige.toString());
    localStorage.setItem("autoMiners", autoMiners.toString());
    localStorage.setItem(
      "upgradeCostMultiplier",
      upgradeCostMultiplier.toString()
    );
    localStorage.setItem(
      "clickPowerMultiplier",
      clickPowerMultiplier.toString()
    );
  };

  const increaseGold = () => {
    const newGold =
      gold + clickPower * clickPowerMultiplier * (1 + prestige * 0.1);
    setGold(newGold);
    if (newGold >= endGameGoal && !showEndGameMessage) {
      setShowEndGameMessage(true);
    }
    saveGameState();
  };

  const upgradeClickPower = (amount) => {
    const cost = Math.floor(baseUpgradeCosts[amount] * upgradeCostMultiplier);
    if (gold >= cost) {
      setGold(gold - cost);
      setClickPower(clickPower + amount);
      saveGameState();
    }
  };

  const buyAutoMiner = () => {
    if (gold >= autoMinerCost) {
      setGold(gold - autoMinerCost);
      setAutoMiners(autoMiners + 1);
      saveGameState();
    }
  };

  const performPrestige = (choice) => {
    if (gold >= prestigeGoal) {
      setPrestige(prestige + 1);
      setGold(0);
      setClickPower(1);
      setAutoMiners(0);
      if (choice === "cost") {
        setUpgradeCostMultiplier(upgradeCostMultiplier * 0.9);
      } else if (choice === "power") {
        setClickPowerMultiplier(clickPowerMultiplier * 1.1);
      }
      saveGameState();
    }
  };

  const EndGameModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4">تهانينا!</h2>
        <p className="mb-4">لقد أنهيت اللعبة! أنت الآن سلطان الذهب الحقيقي!</p>
        <button
          onClick={onClose}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          استمر في اللعب
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 p-2 sm:p-4 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center pt-2 sm:pt-4 mb-4 sm:mb-8">
        نقرات السلطان
      </h1>
      {showEndGameMessage && (
        <EndGameModal onClose={() => setShowEndGameMessage(false)} />
      )}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-yellow-700">
            الذهب: {gold.toLocaleString()}
          </h2>
          <button
            onClick={increaseGold}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl mb-4 sm:mb-6 transition duration-300 transform hover:scale-105"
          >
            انقر لجمع الذهب
          </button>
          {gold >= prestigeGoal && (
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => performPrestige("cost")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded transition duration-300 text-sm sm:text-base"
              >
                ترقية المستوى (تخفيض التكاليف)
              </button>
              <button
                onClick={() => performPrestige("power")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded transition duration-300 text-sm sm:text-base"
              >
                ترقية المستوى (زيادة القوة)
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {Object.entries(baseUpgradeCosts).map(([amount, baseCost]) => {
              const cost = Math.floor(baseCost * upgradeCostMultiplier);
              return (
                <button
                  key={amount}
                  onClick={() => upgradeClickPower(parseInt(amount))}
                  className={`text-white px-2 sm:px-4 py-2 rounded transition duration-300 text-sm sm:text-base ${
                    gold >= cost
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={gold < cost}
                >
                  ترقية +{amount} (التكلفة: {cost})
                </button>
              );
            })}
            <button
              onClick={buyAutoMiner}
              className={`text-white px-2 sm:px-4 py-2 rounded transition duration-300 text-sm sm:text-base ${
                gold >= autoMinerCost
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={gold < autoMinerCost}
            >
              شراء جامع ذهب تلقائي (التكلفة: {autoMinerCost})
            </button>
          </div>
          <div className="mt-4 sm:mt-6 text-gray-700 text-sm sm:text-base">
            <p>قوة النقر: {(clickPower * clickPowerMultiplier).toFixed(2)}</p>
            <p>عدد جامعي الذهب التلقائيين: {autoMiners}</p>
            <p>المستوى: {prestige}</p>
            <p>مضاعف تكلفة الترقية: {upgradeCostMultiplier.toFixed(2)}</p>
            <p>مضاعف قوة النقر: {clickPowerMultiplier.toFixed(2)}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;
