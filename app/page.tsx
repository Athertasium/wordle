// import Image from "next/image";
import Board from "./components/board";

export default function Home() {
  return (
   <div className="flex flex-col items-center  min-h-screen bg-gray-100 p-4">
    <h1>Welcome to Wordle</h1>
    <Board />
    <p>Guess the word in 6 tries.</p>
   </div>
  );
}
