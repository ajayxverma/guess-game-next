'use client';
import Image from 'next/image';
import { useState } from 'react';
import guessImage from '../public/guess-image.svg';

export default function Home() {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>('');
  const [country, setCountry] = useState<string | null>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const getAgeByNameRes = await fetch(`https://api.agify.io/?name=${name}`);
      const getGenderByNameRes = await fetch(`https://api.genderize.io/?name=${name}`);
      const getNationalityByNameRes = await fetch(`https://api.nationalize.io/?name=${name}`);

      if (getAgeByNameRes.ok) {
        const ageData = await getAgeByNameRes.json();
        setAge(ageData?.age || null);
      } else {
        throw new Error('Failed to fetch age data');
      }

      if (getGenderByNameRes.ok) {
        const genderData = await getGenderByNameRes.json();
        setGender(genderData?.gender || null);
      } else {
        throw new Error('Failed to fetch gender data');
      }

      if (getNationalityByNameRes.ok) {
        const nationalityData = await getNationalityByNameRes.json();
        setCountry(nationalityData?.country[0]?.country_id || null);
      } else {
        throw new Error('Failed to fetch country data');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="container flex justify-center mx-auto py-12">
      <div>
        <h1 className="text-3xl text-center font-bold mb-6 text-orange-400">Guess Game</h1>
        <p className="text-center">Let the Guess Game Begins</p>

        <Image alt="guess" src={guessImage} width={300} height={300} />
        <p>Guess Age Gender and Nationality by Name</p>

        <form onSubmit={handleSubmit} className="my-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="border text-gray-600 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 ml-2">
            Submit
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          {gender && age && country && !error && (
            <div>
              <p>Have you guessed it correctly?</p>
              <p className="my-4 text-green-500">
                {name} Age is: {age}
              </p>
              <p className="my-4 text-green-500">
                {name} Gender: {gender}
              </p>
              <p className="my-4 text-green-500">
                {name} Country: {country}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
