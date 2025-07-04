"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Board = () => {
  const [guess, setGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [word, setWord] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showInvalidGuess, setShowInvalidGuess] = useState<boolean>(false);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch("https://api.datamuse.com/words?sp=?????");
        const data = await res.json();
        const words = data.map((w: { word: string }) => w.word);
        setWord((words[Math.floor(Math.random() * words.length)]).toUpperCase());
      } catch (error) {
        console.error('Failed to fetch word:', error);
      }
    };
    fetchWord();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (guess.length !== 5 || gameOver || isSubmitting) {
      setShowInvalidGuess(true);
      setTimeout(() => setShowInvalidGuess(false), 500);
      return;
    }
    
    setIsSubmitting(true);
    
    // Add a small delay for better animation timing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setGuesses(prev => [...prev, guess]);
    
    if (guess === word) {
      setGameOver(true);
    } else if (guesses.length + 1 === 6) {
      setGameOver(true);
    }
    setGuess('');
    setIsSubmitting(false);
  }, [guess, word, guesses.length, gameOver, isSubmitting]);

  const getLetterState = (letter: string, index: number, guessWord: string) => {
    if (guessWord === word) return 'correct';
    if (word[index] === letter) return 'correct';
    if (word.includes(letter)) return 'present';
    return 'absent';
  };

  const letterVariants = {
    hidden: { 
      rotateX: -90, 
      opacity: 0,
      scale: 0.8 
    },
    visible: (i: number) => ({
      rotateX: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const rowVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.17, 0.67, 0.83, 0.67] // cubic-bezier for easeOut
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const celebrationVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -180 
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const renderLetter = (letter: string, index: number, guessWord: string, rowIndex: number) => {
    const state = getLetterState(letter, index, guessWord);
    
    const getBackgroundColor = () => {
      switch (state) {
        case 'correct': return 'bg-green-500 border-green-600';
        case 'present': return 'bg-yellow-500 border-yellow-600';
        case 'absent': return 'bg-gray-700 border-gray-800';
        default: return 'bg-gray-200 border-gray-300';
      }
    };

    return (
      <motion.span
        key={`${rowIndex}-${index}`}
        custom={index}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`w-14 h-12 border-2 flex justify-center items-center font-bold text-lg text-white ${getBackgroundColor()}`}
        style={{ perspective: '1000px' }}
      >
        <motion.span
          initial={{ rotateX: -90 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
        >
          {letter}
        </motion.span>
      </motion.span>
    );
  };

  return (
    <motion.div 
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-gray-800 mb-2"
          animate={{ 
            scale: [1, 1.05, 1],
            color: ['#1f2937', '#3b82f6', '#1f2937']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Wordle Clone
        </motion.h1>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Guess the 5-letter word!
        </motion.p>
      </motion.div>
      
      {/* Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex gap-4 items-center">
          <motion.input
            className={`border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold uppercase tracking-wider focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value.toUpperCase())}
            maxLength={5}
            placeholder="GUESS"
            disabled={gameOver || isSubmitting}
            animate={showInvalidGuess ? {
              x: [-10, 10, -10, 10, 0],
              borderColor: ['#ef4444', '#f97316', '#ef4444']
            } : {}}
            transition={{ duration: 0.5 }}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button 
            type="submit" 
            className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200`}
            disabled={gameOver || isSubmitting || guess.length !== 5}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isSubmitting ? { 
              scale: [1, 1.05, 1],
              backgroundColor: ['#3b82f6', '#6366f1', '#3b82f6']
            } : {}}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isSubmitting ? 'submitting' : 'submit'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.form>
      
      {/* Game Board */}
      <motion.div 
        className="grid gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <AnimatePresence>
            {guesses.map((element, rowIndex) => (
              <motion.div 
                key={rowIndex}
                className="cell flex gap-1"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                layout
              >
                {element.split('').map((letter, letterIndex) => 
                  renderLetter(letter, letterIndex, element, rowIndex)
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Game Over Screen */}
          <AnimatePresence>
            {gameOver && (
              <motion.div 
                className="mt-6 text-center"
                variants={celebrationVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {guesses[guesses.length - 1] === word ? (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <motion.h2 
                      className="text-3xl font-bold text-green-600 mb-2"
                      animate={{ 
                        textShadow: [
                          '0 0 0px #22c55e',
                          '0 0 10px #22c55e',
                          '0 0 0px #22c55e'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🎉 Congratulations! 🎉
                    </motion.h2>
                    <motion.p 
                      className="text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      You guessed the word in {guesses.length} tries!
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h2 
                      className="text-2xl font-bold text-red-600 mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      Game Over!
                    </motion.h2>
                    <motion.p 
                      className="text-gray-700 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      The word was:
                    </motion.p>
                    <motion.div 
                      className="flex gap-1 justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {word.split('').map((letter, letterIndex) => (
                        <motion.span 
                          key={letterIndex} 
                          className="w-14 h-12 border-2 flex justify-center items-center bg-green-500 text-white font-bold text-lg border-green-600"
                          initial={{ rotateY: -90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          transition={{ 
                            delay: letterIndex * 0.1 + 0.7,
                            duration: 0.6
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
                <motion.button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-6 py-2 font-semibold transition-all duration-200"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Board;
// This code defines a Wordle clone game board component using React and Framer Motion for animations.