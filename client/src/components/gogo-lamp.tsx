import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface PaymentData {
  type: string;
  amount: number;
  currency: string;
  timestamp: string;
  paymentId: string;
}

interface PaymentHistoryItem {
  amount: number;
  timestamp: string;
  id: string;
}

export function GoGoLamp() {
  const [lampState, setLampState] = useState<
    "idle" | "activating" | "active" | "cooling"
  >("idle");
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    [],
  );
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("--:--:--");

  useEffect(() => {
    // Connect to Socket.IO
    const socket = io();

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("payment_received", (data: PaymentData) => {
      activateLamp(data.amount);
      addPaymentToHistory({
        amount: data.amount,
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
        id: data.paymentId,
      });
    });

    // Update time every second
    const timeInterval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1000);

    // Fetch initial payment history
    fetchPaymentHistory();

    return () => {
      socket.disconnect();
      clearInterval(timeInterval);
    };
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch("/api/payments");
      const payments = await response.json();
      const history = payments.map((p: any) => ({
        amount: p.amount, // Use amount as-is from server
        timestamp: new Date(p.timestamp).toLocaleTimeString(),
        id: p.id,
      }));
      setPaymentHistory(history);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const playPaymentSound = () => {
    try {
      const audio = new Audio('/sounds/payment-sound.m4a');
      audio.volume = 0.7; // Set volume to 70%
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Failed to play payment sound:', error);
    }
  };

  const activateLamp = (amount: number) => {
    if (lampState === "activating" || lampState === "active") return;

    setLampState("activating");
    setCurrentAmount(amount);
    
    // Play payment sound
    playPaymentSound();

    setTimeout(() => {
      setLampState("active");

      // Auto-reset after 5 seconds
      setTimeout(() => {
        resetLamp();
      }, 5000);
    }, 500);
  };

  const resetLamp = () => {
    setLampState("cooling");

    setTimeout(() => {
      setLampState("idle");
      setCurrentAmount(0);
    }, 500);
  };

  const addPaymentToHistory = (payment: PaymentHistoryItem) => {
    setPaymentHistory((prev) => [payment, ...prev.slice(0, 4)]);
  };

  const testPayment = async () => {
    const amounts = [10, 25, 50, 100, 250];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

    try {
      await fetch("/api/test-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: randomAmount }),
      });
    } catch (error) {
      console.error("Error testing payment:", error);
    }
  };

  const isActive = lampState === "active" || lampState === "activating";

  return (
    <div className="min-h-screen bg-dark-bg text-white font-inter overflow-hidden relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #00ff41 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-green rounded-lg flex items-center justify-center">
              <span className="text-dark-bg font-orbitron font-bold text-lg">
                G
              </span>
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-xl text-neon-green">
                GoGo Lamp
              </h1>
              <p className="text-gray-400 text-sm">Stripe Payment Detector</p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-neon-green animate-pulse" : "bg-red-500"}`}
              />
              <span className="text-sm text-gray-300">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              <span>{lastUpdate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Lamp Display */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Lamp Container */}
          <div className="relative mb-12">
            {/* Lamp Glow Background */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1.5 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-3xl"
                />
              )}
            </AnimatePresence>

            {/* Main GOGO Lamp */}
            <div className="relative">
              {/* GOGO Lamp Image Container */}
              <div className="relative mx-auto -mt-2">
                <motion.div
                  animate={
                    isActive
                      ? {
                          boxShadow:
                            "0 0 80px rgba(255, 20, 147, 0.8), 0 0 160px rgba(0, 191, 255, 0.6), 0 0 240px rgba(255, 20, 147, 0.4)",
                          scale: lampState === "activating" ? [1, 1.1, 1] : 1,
                        }
                      : {
                          boxShadow: "none",
                          scale: 1,
                        }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-64 h-64 flex items-center justify-center relative"
                >
                  {/* Lamp Image - Off State */}
                  {!isActive && (
                    <motion.img
                      src="/images/lamp-off.png"
                      alt="GOGO! Stripe - Off"
                      className="w-64 h-64 object-contain"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Lamp Image - On State */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.img
                        src="/images/lamp-on.png"
                        alt="GOGO! Stripe - On"
                        className="w-64 h-64 object-contain absolute inset-0"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ 
                          duration: 0.5,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="mb-8">
            <motion.div
              animate={
                isActive
                  ? {
                      color: "#00ff41",
                      textShadow: "0 0 20px #00ff41",
                    }
                  : {
                      color: "#9ca3af",
                      textShadow: "none",
                    }
              }
              className="font-orbitron text-2xl mb-4 transition-all duration-500"
            >
              {isActive ? "PAYMENT RECEIVED!" : "WAITING FOR PAYMENT..."}
            </motion.div>
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-lg text-neon-amber font-orbitron"
                >
                  ¥{currentAmount.toLocaleString()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Payment History */}
          <div className="bg-card-bg rounded-xl p-6 border border-gray-700 max-w-md mx-auto">
            <h3 className="font-orbitron font-bold text-lg mb-4 text-neon-blue">
              Recent Payments
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {paymentHistory.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No payments received yet
                </div>
              ) : (
                paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center py-2 px-3 bg-gray-800 rounded-lg"
                  >
                    <span className="text-neon-green font-orbitron">
                      ¥{payment.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {payment.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Control Panel */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-card-bg rounded-xl p-4 border border-gray-700 shadow-2xl">
          <h4 className="font-orbitron font-bold text-sm mb-3 text-neon-amber">
            Test Controls
          </h4>
          <div className="space-y-2">
            <button
              onClick={testPayment}
              className="w-full px-4 py-2 bg-neon-green text-dark-bg rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              Simulate Payment
            </button>
            <button
              onClick={resetLamp}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors"
            >
              Reset Lamp
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-400">
              Webhook URL:
              <br />
              <code className="text-neon-blue">/api/webhook/payment</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
