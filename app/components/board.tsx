"use client";
import React from 'react'
import { useState, useEffect } from 'react';

const Board = () => {
    const [guess, setGuess] = useState<string>('');
    const [guesses, setGuesses] = useState<string[]>([]);
    const [word, setWord] = useState<string>('');
    useEffect(() => {
        const fetchWord = async () => {
           fetch("https://api.datamuse.com/words?sp=?????")
           .then(res => res.json())
           .then(data => {
               const words = data.map(w => w.word);
               setWord(words[Math.floor(Math.random() * words.length)]);
           });
        }
        fetchWord();
    }, []);

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-100 ">
      <h2>Wordle Board</h2>
      <form action="submit" onSubmit={(e) => {
        e.preventDefault();
        // console.log(guess);
        setGuesses([...guesses, guess]);
        setGuess(''); 
      }}>
        <input  className='border-2 border-gray-300 rounded px-4 py-2 mb-4'
            type="text" 
            value={guess} 
            onChange={(e) => setGuess(e.target.value)} 
            maxLength={5} 
            minLength={5}
            placeholder="Enter your guess"
        />
        <button type="submit" className='bg-blue-500 text-white rounded px-4 py-2'>Submit</button>
      </form>
      <div className="grid">
        {/* word: {word} */}
        <div className="row flex flex-col justify-center items-center gap-2">

            {guesses.length > 0 && guesses.length <= 6 && (
              guesses.map((element, index) => (
                <div className="cell flex gap-1" key={index}>
                  {element=== word ? (
                      element.split('').map((letter, letterIndex) => (
                      <span key={letterIndex} className="w-14 h-12 border-2 flex justify-center items-center bg-green-500 text-white">{letter}</span>
                      //stop rendering the rest of the letters if the word is guessed correctly

                    ))
                  ) : (
                    element.split('').map((letter, letterIndex) => (
                      word.includes(letter) ? (
                         letterIndex === word.indexOf(letter) ? (
                          <span key={letterIndex} className="w-14 h-12 border-2 flex justify-center items-center bg-emerald-500 text-white">{letter}</span>
                        ) : (
                          <span key={letterIndex} className="w-14 h-12 border-2 flex justify-center items-center bg-yellow-500 text-white">{letter}</span>
                        )
                      ) : (
                        <span key={letterIndex} className="w-14 h-12 bg-gray-700 text-white border-2 flex justify-center items-center">{letter}</span>
                      )
                    ))
                  )}
                </div>
              ))
            )}
            {guesses.length === 6 && guess!==word && (
              <div className="cell flex flex-col gap-1">
                <span className="w-14 h-12 border-2 flex f justify-center items-center bg-red-500 text-white">You lost!</span>
                {word.split('').map((letter, letterIndex) => (
                  <span key={letterIndex} className="w-14 h-12 border-2 flex justify-center items-center bg-green-500 text-white">{letter}</span>
                ))}
              </div>
            )}

        </div>
        
        
       
      </div>
    </div>
  )
}

export default Board
